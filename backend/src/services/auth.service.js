import prisma from "../config/prisma.js";

import ApiError from "../utils/ApiError.js";

import { comparePassword, hashPassword } from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { generateResetToken, hashToken } from "../utils/token.js";

import {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
} from "./email.service.js";

const REFRESH_TOKEN_EXPIRY_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRY_DAYS || 7,
);

const PASSWORD_RESET_EXPIRY_MINUTES = Number(
  process.env.PASSWORD_RESET_EXPIRY_MINUTES || 30,
);

const getPasswordResetExpiry = () => {
  const expiresAt = new Date();

  expiresAt.setMinutes(expiresAt.getMinutes() + PASSWORD_RESET_EXPIRY_MINUTES);

  return expiresAt;
};

const getRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  return expiresAt;
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await tx.profile.create({
      data: {
        userId: createdUser.id,
      },
    });

    return createdUser;
  });

  try {
   await sendWelcomeEmail(user);
  } catch (error) {
  console.error("Failed to send welcome email:", error);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing.");
  }

  const payload = verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hashToken(refreshToken),
    },
    include: {
      user: true,
    },
  });

  if (!storedToken || storedToken.userId !== payload.id) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new ApiError(401, "Refresh token expired.");
  }

  await prisma.refreshToken.deleteMany({
  where: {
    expiresAt: {
      lt: new Date(),
    },
  },
});

  const accessToken = generateAccessToken({
    id: storedToken.user.id,
    role: storedToken.user.role,
  });

  return {
    accessToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash: hashToken(refreshToken),
    },
  });
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          avatar: true,
          bio: true,
          location: true,
          website: true,
          github: true,
          linkedin: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    profile: user.profile,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Never reveal whether the email exists.
   */
  if (!user) {
    return;
  }

  const token = generateResetToken();

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await tx.passwordResetToken.create({
      data: {
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: getPasswordResetExpiry(),
      },
    });
  });

  try {
    await sendForgotPasswordEmail(user, token);
  } catch (error) {
    console.error("Failed to send forgot password email:", error);
  }
};

export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!resetToken) {
    throw new ApiError(400, "Invalid or expired reset token.");
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    throw new ApiError(400, "Reset token has expired.");
  }

  // Check if the new password matches the current password
  const isSamePassword = await comparePassword(
    password,
    resetToken.user.password
  );

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password."
    );
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    });

    await tx.refreshToken.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    });
  });

  try {
    await sendPasswordChangedEmail(resetToken.user);
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }
};
