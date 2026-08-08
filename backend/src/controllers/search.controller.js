import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as searchService from "../services/search.service.js";

export const search = asyncHandler(async (req, res) => {
  const { q, type } = req.query;

  const results = await searchService.search({
    userId: req.user.id,
    query: q,
    type,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Search results fetched successfully.",
      results,
    ),
  );
});