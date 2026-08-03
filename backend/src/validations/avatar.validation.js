import { z } from "zod";

export const generateUploadUrlSchema = z.object({
  body: z.object({
    fileName: z
      .string()
      .trim()
      .min(1, "File name is required."),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const updateAvatarSchema = z.object({
  body: z.object({
    path: z
      .string()
      .trim()
      .min(1, "Avatar path is required."),
  }),

  params: z.object({}),
  query: z.object({}),
});