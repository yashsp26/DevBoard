import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(150, "Title cannot exceed 150 characters."),

    content: z
      .string()
      .trim()
      .min(1, "Content is required.")
      .max(50000, "Content cannot exceed 50000 characters."),

    projectId: z.cuid("Invalid project id.").nullable().optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateNoteSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).max(150).optional(),

      content: z.string().trim().min(1).max(50000).optional(),

      projectId: z.cuid().nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required.",
    ),

  params: z.object({
    id: z.cuid("Invalid note id."),
  }),

  query: z.object({}),
});

export const noteIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.cuid("Invalid note id."),
  }),

  query: z.object({}),
});

export const getNotesSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),

    projectId: z.cuid().optional(),

    search: z.string().trim().optional(),

    sort: z.enum(["createdAt", "updatedAt", "title"]).optional(),

    order: z.enum(["asc", "desc"]).optional(),
  }),
});
