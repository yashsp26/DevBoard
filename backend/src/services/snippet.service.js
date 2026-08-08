import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";

const getProjectOwnership = async (projectId, userId) => {
  if (!projectId) return;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }
};

export const createSnippet = async (userId, data) => {
  await getProjectOwnership(data.projectId, userId);

  return await prisma.snippet.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      language: data.language,
      code: data.code,
      projectId: data.projectId ?? null,
      userId,
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

export const getSnippets = async (userId, query) => {
  const { page, limit, search, projectId, language, favorite, sort, order } =
    query;

  const where = {
    userId,
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        code: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (projectId) {
    where.projectId = projectId;
  }

  if (language) {
    where.language = language;
  }

  if (favorite !== undefined) {
    where.isFavorite = favorite === "true";
  }

  const [snippets, total] = await prisma.$transaction([
    prisma.snippet.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.snippet.count({
      where,
    }),
  ]);

  return {
    snippets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

export const getSnippet = async (id, userId) => {
  const snippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId,
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

  if (!snippet) {
    throw new ApiError(404, "Snippet not found.");
  }

  return snippet;
};

export const updateSnippet = async (id, userId, data) => {
  const snippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet not found.");
  }

  await getProjectOwnership(data.projectId, userId);

  return await prisma.snippet.update({
    where: {
      id,
    },
    data: {
      ...data,
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

export const deleteSnippet = async (id, userId) => {
  const snippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet not found.");
  }

  await prisma.snippet.delete({
    where: {
      id,
    },
  });
};

export const toggleFavorite = async (id, userId) => {
  const snippet = await prisma.snippet.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!snippet) {
    throw new ApiError(404, "Snippet not found.");
  }

  return await prisma.snippet.update({
    where: {
      id,
    },
    data: {
      isFavorite: !snippet.isFavorite,
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
