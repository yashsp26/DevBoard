import { z } from "zod";

const taskStatus = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
];

const taskPriority = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(
        150,
        "Title cannot exceed 150 characters."
      ),

    description: z
      .string()
      .trim()
      .max(
        5000,
        "Description cannot exceed 5000 characters."
      )
      .optional(),

    priority: z
      .enum(taskPriority)
      .default("MEDIUM"),

    dueDate: z
      .string()
      .date()
      .optional(),

    assigneeId: z
      .cuid("Invalid assignee id.")
      .optional(),

    labelIds: z
      .array(z.cuid())
      .default([]),
  }),

  params: z.object({
    projectId: z.cuid("Invalid project id."),
  }),

  query: z.object({}),
});

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1)
        .max(150)
        .optional(),

      description: z
        .string()
        .trim()
        .max(5000)
        .optional(),

      priority: z
        .enum(taskPriority)
        .optional(),

      dueDate: z
        .string()
        .date()
        .nullable()
        .optional(),

      assigneeId: z
        .cuid()
        .nullable()
        .optional(),

      labelIds: z
        .array(z.cuid())
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      "At least one field is required."
    ),

  params: z.object({
    id: z.cuid("Invalid task id."),
  }),

  query: z.object({}),
});

export const taskIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: z.cuid("Invalid task id."),
  }),

  query: z.object({}),
});

export const updateTaskStatusSchema =
  z.object({
    body: z.object({
      status: z.enum(taskStatus),
    }),

    params: z.object({
      id: z.cuid("Invalid task id."),
    }),

    query: z.object({}),
  });

export const getTasksSchema = z.object({
  body: z.object({}),

  params: z.object({
    projectId: z.cuid("Invalid project id."),
  }),

  query: z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .optional(),

    search: z.string().optional(),

    status: z
      .enum(taskStatus)
      .optional(),

    priority: z
      .enum(taskPriority)
      .optional(),

    assigneeId: z
      .cuid()
      .optional(),

    labelId: z
      .cuid()
      .optional(),

    sort: z
      .enum([
        "createdAt",
        "updatedAt",
        "dueDate",
        "priority",
      ])
      .optional(),

    order: z
      .enum(["asc", "desc"])
      .optional(),
  }),
}); 