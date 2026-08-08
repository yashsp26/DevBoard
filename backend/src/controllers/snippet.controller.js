import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as snippetService from "../services/snippet.service.js";

export const createSnippet = asyncHandler(async (req, res) => {
  const snippet = await snippetService.createSnippet(
    req.user.id,
    req.validatedData,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Snippet created successfully.", snippet));
});

export const getSnippets = asyncHandler(async (req, res) => {
  const snippets = await snippetService.getSnippets(
    req.user.id,
    req.validatedQuery,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Snippets fetched successfully.", snippets));
});

export const getSnippet = asyncHandler(async (req, res) => {
  const snippet = await snippetService.getSnippet(req.params.id, req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Snippet fetched successfully.", snippet));
});

export const updateSnippet = asyncHandler(async (req, res) => {
  const snippet = await snippetService.updateSnippet(
    req.params.id,
    req.user.id,
    req.validatedData,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Snippet updated successfully.", snippet));
});

export const deleteSnippet = asyncHandler(async (req, res) => {
  await snippetService.deleteSnippet(req.params.id, req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Snippet deleted successfully."));
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const snippet = await snippetService.toggleFavorite(
    req.params.id,
    req.user.id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Snippet favorite status updated.", snippet));
});
