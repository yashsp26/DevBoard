import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as labelService from "../services/label.service.js";

export const createLabel = asyncHandler(
  async (req, res) => {
    const label =
      await labelService.createLabel(
        req.user.id,
        req.validatedParams.projectId,
        req.validatedData
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Label created successfully.",
        label
      )
    );
  }
);

export const getLabels = asyncHandler(
  async (req, res) => {
    const labels =
      await labelService.getLabels(
        req.user.id,
        req.validatedParams.projectId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Labels fetched successfully.",
        labels
      )
    );
  }
);

export const updateLabel = asyncHandler(
  async (req, res) => {
    const label =
      await labelService.updateLabel(
        req.user.id,
        req.validatedParams.id,
        req.validatedData
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Label updated successfully.",
        label
      )
    );
  }
);

export const deleteLabel = asyncHandler(
  async (req, res) => {
    await labelService.deleteLabel(
      req.user.id,
      req.validatedParams.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Label deleted successfully."
      )
    );
  }
);