import path from "node:path";

import prisma from "../Config/prisma.js";

import ApiError from "../utils/ApiError.js";

import * as storageService from "./storage.service.js";

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

export const generateUploadUrl = async (
  userId,
  fileName
) => {

   const extension = path
    .extname(fileName)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new ApiError(
      400,
      "Unsupported image format."
    );
  }
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  return storageService.generateAvatarUploadUrl(
    userId,
    fileName
  );
};

export const updateAvatar = async (
  userId,
  objectPath
) => {
  const expectedPrefix = `avatars/${userId}/`;

  if (!objectPath.startsWith(expectedPrefix)) {
    throw new ApiError(403, "Invalid avatar path.");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      avatar: true,
    },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  const oldAvatar = profile.avatar;

  const updatedProfile = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      avatar: objectPath,
    },
    select: {
      avatar: true,
    },
  });

  if (oldAvatar) {
    try {
      await storageService.deleteFile(oldAvatar);
    } catch (error) {
      console.error(
        "Failed to delete previous avatar:",
        error
      );
    }
  }

  return updatedProfile;
};

export const getAvatar = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      avatar: true,
    },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  if (!profile.avatar) {
    return {
      avatarUrl: null,
    };
  }

  const avatarUrl =
    await storageService.createSignedUrl(
      profile.avatar
    );

  return {
    avatarUrl,
  };
};

export const deleteAvatar = async (
  userId
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      avatar: true,
    },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  if (!profile.avatar) {
    return;
  }

  const oldAvatar = profile.avatar;

  await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      avatar: null,
    },
  });

  try {
    await storageService.deleteFile(oldAvatar);
  } catch (error) {
    console.error(
      "Failed to delete avatar from storage:",
      error
    );
  }
};
