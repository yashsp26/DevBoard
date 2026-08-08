import { z } from "zod";

const cuid = z.string().cuid();

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
