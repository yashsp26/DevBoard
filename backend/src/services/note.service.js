import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";

const getProject = async (userId, projectId) => {
  if (!projectId) return null;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return project;
};

const getNote = async (userId, noteId) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
    },
  });

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  return note;
};

export const createNote = async (userId, data) => {
  await getProject(userId, data.projectId);

  return await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId,
      projectId: data.projectId ?? null,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });
};

export const getNotes = async (userId, query) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 20;

  const skip = (page - 1) * limit;

  const where = {
    userId,

    ...(query.projectId && {
      projectId: query.projectId,
    }),

    ...(query.search && {
      OR: [
        {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };
  const [notes, total] = await prisma.$transaction([
    prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [query.sort || "updatedAt"]: query.order || "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    }),

    prisma.note.count({
      where,
    }),
  ]);

  return {
    notes,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNoteById = async (userId, noteId) => {
  await getNote(userId, noteId);

  return await prisma.note.findUnique({
    where: {
      id: noteId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });
};

export const updateNote = async (userId, noteId, data) => {
  await getNote(userId, noteId);

  if (Object.prototype.hasOwnProperty.call(data, "projectId")) {
    await getProject(userId, data.projectId);
  }

  return await prisma.note.update({
    where: {
      id: noteId,
    },
    data: {
      title: data.title,
      content: data.content,
      projectId: data.projectId === undefined ? undefined : data.projectId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });
};

export const deleteNote = async (userId, noteId) => {
  await getNote(userId, noteId);

  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
};
