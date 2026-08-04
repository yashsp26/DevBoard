import { z } from "zod";

const hexColorRegex =
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const createLabelSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Label name is required.")
      .max(50, "Label name cannot exceed 50 characters."),

    color: z
      .string()
      .regex(
        hexColorRegex,
        "Please provide a valid hex color."
      ),
  }),

  params: z.object({
    projectId: z.cuid("Invalid project id."),
  }),

  query: z.object({}),
});

export const updateLabelSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Label name is required.")
        .max(
          50,
          "Label name cannot exceed 50 characters."
        )
        .optional(),

      color: z
        .string()
        .regex(
          hexColorRegex,
          "Please provide a valid hex color."
        )
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required."
    ),

  params: z.object({
    id: z.cuid("Invalid label id."),
  }),

  query: z.object({}),
});

export const projectLabelsSchema = z.object({
  body: z.object({}),

  params: z.object({
    projectId: z.cuid("Invalid project id."),
  }),

  query: z.object({}),
});

export const labelIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.cuid("Invalid label id."),
  }),

  query: z.object({}),
});