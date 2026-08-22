import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { hashToken } from "../utils/token.js";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const generateTokens = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const tokenHash = hashToken(refreshToken);

  // Remove expired tokens
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyStoredRefreshToken = async (refreshToken) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new ApiError(401, "Refresh token expired");
  }

  return payload;
};

export const revokeRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: {
      tokenHash,
    },
  });
};

export const revokeAllUserTokens = async (userId) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};

export const rotateRefreshToken = async (refreshToken) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new ApiError(401, "Refresh token expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Remove the old refresh token
  await prisma.refreshToken.delete({
    where: {
      id: storedToken.id,
    },
  });

  // Generate and store a fresh pair
  return await generateTokens(user);
};
