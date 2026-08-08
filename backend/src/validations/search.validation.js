import { z } from "zod";

const searchTypes = [
  "all",
  "projects",
  "tasks",
  "notes",
  "snippets",
  "labels",
];

export const searchSchema = z.object({
  query: z.object({
    q: z
      .string()
      .trim()
      .min(1, "Search query is required.")
      .max(100, "Search query must not exceed 100 characters."),

    type: z
      .enum(searchTypes)
      .default("all"),
  }),
});