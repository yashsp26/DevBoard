import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as noteService from "../services/note.service.js";

export const createNote = asyncHandler(async (req, res) => {
  const note = await noteService.createNote(
    req.user.id,
    req.validatedData
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Note created successfully.",
      note
    )
  );
});

export const getNotes = asyncHandler(async (req, res) => {
  const result = await noteService.getNotes(
    req.user.id,
    req.validatedQuery
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notes fetched successfully.",
      result
    )
  );
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(
    req.user.id,
    req.validatedParams.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Note fetched successfully.",
      note
    )
  );
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(
    req.user.id,
    req.validatedParams.id,
    req.validatedData
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Note updated successfully.",
      note
    )
  );
});

export const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(
    req.user.id,
    req.validatedParams.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Note deleted successfully."
    )
  );
});
