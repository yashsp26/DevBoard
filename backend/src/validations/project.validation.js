import { z } from "zod";

const projectColors = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#6366F1",
];

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters.")
      .max(100, "Project name cannot exceed 100 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional()
      .nullable(),

    color: z
      .string()
      .trim()
      .refine(
        (value) => projectColors.includes(value),
        "Invalid project color."
      )
      .optional()
      .nullable(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Project name must be at least 2 characters.")
        .max(100, "Project name cannot exceed 100 characters.")
        .optional(),

      description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .nullable()
        .optional(),

      color: z
        .string()
        .trim()
        .refine(
          (value) => projectColors.includes(value),
          "Invalid project color."
        )
        .nullable()
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required."
    ),

  params: z.object({
    id: z.cuid("Invalid project id."),
  }),

  query: z.object({}),
});

export const listProjectsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),

    search: z.string().trim().optional(),

    status: z
      .enum(["ACTIVE", "ARCHIVED"])
      .optional(),

    favorite: z
      .enum(["true", "false"])
      .optional(),

    sort: z
      .enum([
        "name",
        "createdAt",
        "updatedAt",
      ])
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .optional(),
  }),
});

export const projectIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.cuid("Invalid project id."),
  }),

  query: z.object({}),
});