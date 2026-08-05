import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export const createProject = async (userId, data) => {
  try {
    return await prisma.project.create({
      data: {
        ...data,
        ownerId: userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
            notes: true,
            snippets: true,
            labels: true,
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        "A project with this name already exists."
      );
    }

    throw error;
  }
};

export const getProjects = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);

  const where = {
    ownerId: userId,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.favorite !== undefined) {
    where.isFavorite = query.favorite === "true";
  }

  if (query.search) {
    where.OR = [
      {
        name: {
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

  const sortField = query.sort || "updatedAt";

  const sortOrder = query.order || "desc";

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
      include: {
        _count: {
          select: {
            tasks: true,
            notes: true,
            snippets: true,
            labels: true,
          },
        },
      },
    }),

    prisma.project.count({
      where,
    }),
  ]);

  return {
    projects,
    pagination: getPaginationMeta({
      page,
      limit,
      total,
    }),
  };
};

export const getProjectById = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },include: {
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

export const updateProject = async (userId, projectId, data) => {
  await getProjectById(userId, projectId);

  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data,
    include: {
      _count: {
        select: {
          tasks: true,
          notes: true,
          snippets: true,
          labels: true,
        },
      },
    },
  });
};

export const deleteProject = async (userId, projectId) => {
  await getProjectById(userId, projectId);

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
};

export const toggleFavorite = async (userId, projectId) => {
  const project = await getProjectById(userId, projectId);

  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      isFavorite: !project.isFavorite,
    },
    include: {
      _count: {
        select: {
          tasks: true,
          notes: true,
          snippets: true,
          labels: true,
        },
      },
    },
  });
};

export const archiveProject = async (userId, projectId) => {
  await getProjectById(userId, projectId);

  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status: "ARCHIVED",
    },
    include: {
      _count: {
        select: {
          tasks: true,
          notes: true,
          snippets: true,
          labels: true,
        },
      },
    },
  });
};

export const unarchiveProject = async (userId, projectId) => {
  await getProjectById(userId, projectId);

  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      status: "ACTIVE",
    },
    include: {
      _count: {
        select: {
          tasks: true,
          notes: true,
          snippets: true,
          labels: true,
        },
      },
    },
  });
};
