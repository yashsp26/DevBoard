import { z } from "zod";

const cuid = z.string().cuid();

const filePathSchema = z
  .string()
  .trim()
  .min(1, "File path is required for project snippets.")
  .max(512, "File path cannot exceed 512 characters.")
  .superRefine((value, ctx) => {
    if (value.includes("\0")) {
      ctx.addIssue({ code: "custom", message: "File path cannot contain null bytes." });
    }

    if (value.startsWith("/") || value.includes(":")) {
      ctx.addIssue({ code: "custom", message: "File path must be relative to the project root." });
    }

    if (value.includes("\\")) {
      ctx.addIssue({ code: "custom", message: "File path must use forward slashes." });
    }

    if (value.split("/").some((segment) => segment === "..")) {
      ctx.addIssue({ code: "custom", message: "File path cannot contain ../" });
    }
  });

export const createSnippetSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters.")
      .max(120, "Title cannot exceed 120 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional()
      .nullable(),

    language: z.string().trim().min(1, "Language is required.").max(50),

    code: z.string().trim().min(1, "Code cannot be empty."),

    projectId: cuid.optional().nullable(),

    filePath: filePathSchema.optional().nullable(),
  }).superRefine((data, ctx) => {
    if (data.projectId && !data.filePath) {
      ctx.addIssue({
        code: "custom",
        path: ["filePath"],
        message: "File path is required for project snippets.",
      });
    }
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateSnippetSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(120).optional(),

    description: z.string().trim().max(500).nullable().optional(),

    language: z.string().trim().min(1).max(50).optional(),

    code: z.string().trim().min(1).optional(),

    projectId: cuid.nullable().optional(),

    filePath: filePathSchema.nullable().optional(),
  }),

  params: z.object({
    id: cuid,
  }),

  query: z.object({}),
});

export const snippetIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: cuid,
  }),

  query: z.object({}),
});

export const toggleFavoriteSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: cuid,
  }),

  query: z.object({}),
});

export const getSnippetsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(12),

    search: z.string().trim().optional(),

    projectId: cuid.optional(),

    language: z.string().trim().optional(),

    favorite: z.enum(["true", "false"]).optional(),

    sort: z
      .enum(["createdAt", "updatedAt", "title", "language"])
      .default("updatedAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});
