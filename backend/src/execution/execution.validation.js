import { z } from "zod";

export const runCodeSchema = z.object({
  body: z.object({
    language: z
      .string()
      .trim()
      .min(1, "Language is required."),

    framework: z
      .string()
      .trim()
      .optional(),

    entryPoint: z
      .string()
      .trim()
      .min(1, "Entry point is required.")
      .default("index.js"),

    files: z
      .array(
        z.object({
          path: z
            .string()
            .trim()
            .min(1, "File path is required."),

          content: z
            .string(),
        })
      )
      .min(1, "At least one file is required.")
      .max(1, "Only one file is supported in the current version."),

    stdin: z
      .string()
      .optional()
      .default(""),

    timeoutMs: z
      .number()
      .int()
      .min(1000, "Minimum timeout is 1 second.")
      .max(30000, "Maximum timeout is 30 seconds.")
      .optional()
      .default(10000),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const runProjectSchema = z.object({
  body: z.object({
    entryPoint: z.string().trim().min(1, "Entry point cannot be empty.").optional(),
    stdin: z.string().optional().default(""),
    timeoutMs: z
      .number()
      .int()
      .min(1000, "Minimum timeout is 1 second.")
      .max(30000, "Maximum timeout is 30 seconds.")
      .optional()
      .default(10000),
  }),
  params: z.object({
    projectId: z.string().cuid(),
  }),
  query: z.object({}),
});
