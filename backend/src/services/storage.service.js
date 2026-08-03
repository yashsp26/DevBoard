import crypto from "crypto";
import path from "path";

import supabase from "../lib/supabase.js";
import ApiError from "../utils/ApiError.js";

const BUCKET = process.env.SUPABASE_BUCKET;

export const generateAvatarUploadUrl = async (
  userId,
  fileName
) => {
  console.log("userId:", userId);
  console.log("fileName:", fileName);

  const extension = path.extname(fileName);

  const objectPath = `avatars/${userId}/${crypto.randomUUID()}${extension}`;

  console.log("Bucket:", BUCKET);
  console.log("Object path:", objectPath);
  console.log("Supabase URL:", process.env.SUPABASE_URL);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(objectPath);

  if (error) {
    console.error("Supabase storage error:", error);
    throw new ApiError(500, error.message);
  }

  return {
    path: objectPath,
    uploadUrl: data.signedUrl,
  };
};

export const createSignedUrl = async (
  objectPath,
  expiresIn = 3600
) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(objectPath, expiresIn);

  if (error) {
    throw new ApiError(
      500,
      "Failed to generate signed URL."
    );
  }

  return data.signedUrl;
};

export const deleteFile = async (objectPath) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([objectPath]);

  if (error) {
    throw new ApiError(
      500,
      "Failed to delete file."
    );
  }
};
