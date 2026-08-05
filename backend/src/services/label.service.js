import { Prisma } from "../generated/prisma/index.js";

import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";

const getProject = async (userId, projectId) => {
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

const getLabel = async (userId, labelId) => {
  const label = await prisma.label.findFirst({
    where: {
      id: labelId,
      project: {
        ownerId: userId,
      },
    },
  });

  if (!label) {
    throw new ApiError(404, "Label not found.");
  }

  return label;
};

export const createLabel = async (userId, projectId, data) => {
  await getProject(userId, projectId);

  try {
    return await prisma.label.create({
      data: {
        ...data,
        projectId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "A label with this name already exists.");
    }

    throw error;
  }
};

export const getLabels = async (userId, projectId) => {
  await getProject(userId, projectId);

  return await prisma.label.findMany({
    where: {
      projectId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const updateLabel = async (userId, labelId, data) => {
  await getLabel(userId, labelId);

  try {
    return await prisma.label.update({
      where: {
        id: labelId,
      },
      data,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "A label with this name already exists.");
    }

    throw error;
  }
};

export const deleteLabel = async (userId, labelId) => {
  await getLabel(userId, labelId);

  await prisma.label.delete({
    where: {
      id: labelId,
    },
  });
};
