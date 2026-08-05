import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";

import { getPagination, getPaginationMeta } from "../utils/pagination.js";

const getProject = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
          labels: true,
          notes: true,
          snippets: true,
        },
      },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return project;
};

const getTask = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: userId,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          ownerId: true,
        },
      },
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};

const validateLabels = async (projectId, labelIds = []) => {
  if (!labelIds.length) return;

  const labels = await prisma.label.findMany({
    where: {
      id: {
        in: labelIds,
      },
      projectId,
    },
  });

  if (labels.length !== labelIds.length) {
    throw new ApiError(400, "One or more labels are invalid.");
  }
};

const validateAssignee = async (assigneeId, ownerId) => {
  if (!assigneeId) return ownerId;

  const user = await prisma.user.findUnique({
    where: {
      id: assigneeId,
    },
  });

  if (!user) {
    throw new ApiError(404, "Assignee not found.");
  }

  return assigneeId;
};

export const createTask = async (userId, projectId, data) => {
  const project = await getProject(userId, projectId);

  await validateLabels(projectId, data.labelIds);

  const assigneeId = await validateAssignee(data.assigneeId, project.ownerId);

  const task = await prisma.$transaction(async (tx) => {
    const createdTask = await tx.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assigneeId,
        projectId,
      },
    });

    if (data.labelIds.length) {
      await tx.taskLabel.createMany({
        data: data.labelIds.map((labelId) => ({
          taskId: createdTask.id,
          labelId,
        })),
      });
    }

    return createdTask;
  });

  return await prisma.task.findUnique({
    where: {
      id: task.id,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },

      labels: {
        include: {
          label: true,
        },
      },
    },
  });
};

export const getTasks = async (userId, projectId, query) => {
  await getProject(userId, projectId);

  const { page, limit, skip } = getPagination(query);

  const where = {
    projectId,
  };

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.assigneeId) {
    where.assigneeId = query.assigneeId;
  }

  if (query.labelId) {
    where.labels = {
      some: {
        labelId: query.labelId,
      },
    };
  }

  const sortField = query.sort || "updatedAt";

  const sortOrder = query.order || "desc";

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },

        labels: {
          include: {
            label: true,
          },
        },
      },
    }),

    prisma.task.count({
      where,
    }),
  ]);

  return {
    tasks,
    pagination: getPaginationMeta({
      page,
      limit,
      total,
    }),
  };
};

export const getTaskById = async (userId, taskId) => {
  await getTask(userId, taskId);

  return await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },

      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },

      labels: {
        include: {
          label: true,
        },
      },
    },
  });
};

export const updateTask = async (userId, taskId, data) => {
  const task = await getTask(userId, taskId);

  if (data.labelIds) {
    await validateLabels(task.projectId, data.labelIds);
  }

  let assigneeId = task.assigneeId;

  if (Object.prototype.hasOwnProperty.call(data, "assigneeId")) {
    if (data.assigneeId === null) {
      assigneeId = task.project.ownerId;
    } else {
      assigneeId = await validateAssignee(
        data.assigneeId,
        task.project.ownerId,
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate:
          data.dueDate === undefined
            ? undefined
            : data.dueDate === null
              ? null
              : new Date(data.dueDate),
        assigneeId,
      },
    });

    if (data.labelIds) {
      await tx.taskLabel.deleteMany({
        where: {
          taskId,
        },
      });

      if (data.labelIds.length) {
        await tx.taskLabel.createMany({
          data: data.labelIds.map((labelId) => ({
            taskId,
            labelId,
          })),
        });
      }
    }
  });

  return await getTaskById(userId, taskId);
};

export const updateTaskStatus = async (userId, taskId, status) => {
  await getTask(userId, taskId);

  const completedAt = status === "DONE" ? new Date() : null;

  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
      completedAt,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },

      labels: {
        include: {
          label: true,
        },
      },
    },
  });
};

export const deleteTask = async (userId, taskId) => {
  await getTask(userId, taskId);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};
