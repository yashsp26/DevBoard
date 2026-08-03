import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as avatarService from "../services/avatar.service.js";

export const generateUploadUrl = asyncHandler(
  async (req, res) => {
    const { fileName } = req.validatedData;

    const data =
      await avatarService.generateUploadUrl(
        req.user.id,
        fileName
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Upload URL generated successfully.",
        data
      )
    );
  }
);

export const updateAvatar = asyncHandler(
  async (req, res) => {
    const { path } = req.validatedData;

    const avatar =
      await avatarService.updateAvatar(
        req.user.id,
        path
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Avatar updated successfully.",
        avatar
      )
    );
  }
);

export const getAvatar = asyncHandler(
  async (req, res) => {
    const avatar =
      await avatarService.getAvatar(
        req.user.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Avatar fetched successfully.",
        avatar
      )
    );
  }
);

export const deleteAvatar = asyncHandler(
  async (req, res) => {
    await avatarService.deleteAvatar(
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Avatar deleted successfully."
      )
    );
  }
);