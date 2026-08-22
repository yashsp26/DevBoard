import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/password.js";

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const updateProfile = async (userId, profileData) => {
  const { name, bio, location, website, github, linkedin } = profileData;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name !== undefined && { name }),
      },
    });

    const profile = await tx.profile.update({
      where: {
        userId,
      },
      data: {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && {
          location,
        }),
        ...(website !== undefined && {
          website,
        }),
        ...(github !== undefined && {
          github,
        }),
        ...(linkedin !== undefined && {
          linkedin,
        }),
      },
    });

    return tx.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });
  });

  return updatedUser;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const passwordMatches = await comparePassword(currentPassword, user.password);

  if (!passwordMatches) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    }),

    prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    }),
  ]);
};

export const deleteProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
