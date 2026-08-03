import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as authService from "../services/auth.service.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth",
  maxAge:
    Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 7) *
    24 *
    60 *
    60 *
    1000,
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(
    req.validatedData
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully.",
      user
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } =
    await authService.loginUser(req.validatedData);

  res.cookie(
    "refreshToken",
    refreshToken,
    REFRESH_COOKIE_OPTIONS
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Login successful.",
      {
        accessToken,
        user,
      }
    )
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const { accessToken } =
    await authService.refreshUserToken(refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Token refreshed successfully.",
      {
        accessToken,
      }
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logoutUser(refreshToken);

  res.clearCookie(
    "refreshToken",
    REFRESH_COOKIE_OPTIONS
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Logged out successfully."
    )
  );
});

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await authService.getCurrentUser(
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Current user fetched successfully.",
        user
      )
    );
  }
);

export const forgotPassword = asyncHandler(
  async (req, res) => {
    await authService.forgotPassword(
      req.validatedData.email
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "If an account with that email exists, a password reset link has been sent."
      )
    );
  }
);

export const resetPassword = asyncHandler(
  async (req, res) => {
    await authService.resetPassword(
      req.validatedData
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Password reset successfully."
      )
    );
  }
);