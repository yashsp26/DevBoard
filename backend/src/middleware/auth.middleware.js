import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  next();
});

export default authMiddleware;