import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as taskService from "../services/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(
    req.user.id,
    req.validatedParams.projectId,
    req.validatedData
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Task created successfully.",
      task
    )
  );
});

export const getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(
    req.user.id,
    req.validatedParams.projectId,
    req.validatedQuery
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Tasks fetched successfully.",
      result
    )
  );
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    req.user.id,
    req.validatedParams.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Task fetched successfully.",
      task
    )
  );
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    req.user.id,
    req.validatedParams.id,
    req.validatedData
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Task updated successfully.",
      task
    )
  );
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateTaskStatus(
    req.user.id,
    req.validatedParams.id,
    req.validatedData.status
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Task status updated successfully.",
      task
    )
  );
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(
    req.user.id,
    req.validatedParams.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Task deleted successfully."
    )
  );
});