import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as userService from "../services/user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully.",
      profile
    )
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(
    req.user.id,
    req.validatedData
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile updated successfully.",
      profile
    )
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } =
    req.validatedData;

  await userService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password changed successfully."
    )
  );
});

export const deleteProfile = asyncHandler(async (req, res) => {
  await userService.deleteProfile(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Account deleted successfully."
    )
  );
});