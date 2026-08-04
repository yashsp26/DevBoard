import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as projectService from "../services/project.service.js";

export const createProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.createProject(
        req.user.id,
        req.validatedData
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Project created successfully.",
        project
      )
    );
  }
);

export const getProjects = asyncHandler(
  async (req, res) => {
    const projects =
      await projectService.getProjects(
        req.user.id,
        req.query
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Projects fetched successfully.",
        projects
      )
    );
  }
);

export const getProjectById =
  asyncHandler(async (req, res) => {
    const project =
      await projectService.getProjectById(
        req.user.id,
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Project fetched successfully.",
        project
      )
    );
  });

export const updateProject =
  asyncHandler(async (req, res) => {
    const project =
      await projectService.updateProject(
        req.user.id,
        req.params.id,
        req.validatedData
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Project updated successfully.",
        project
      )
    );
  });

export const deleteProject =
  asyncHandler(async (req, res) => {
    await projectService.deleteProject(
      req.user.id,
      req.params.id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Project deleted successfully."
      )
    );
  });

export const toggleFavorite =
  asyncHandler(async (req, res) => {
    const project =
      await projectService.toggleFavorite(
        req.user.id,
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        project.isFavorite
          ? "Project added to favorites."
          : "Project removed from favorites.",
        project
      )
    );
  });

export const archiveProject =
  asyncHandler(async (req, res) => {
    const project =
      await projectService.archiveProject(
        req.user.id,
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Project archived successfully.",
        project
      )
    );
  });

export const unarchiveProject =
  asyncHandler(async (req, res) => {
    const project =
      await projectService.unarchiveProject(
        req.user.id,
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Project unarchived successfully.",
        project
      )
    );
  });