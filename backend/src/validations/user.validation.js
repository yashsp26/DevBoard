import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters.")
        .optional(),

      bio: z
        .string()
        .trim()
        .max(250, "Bio cannot exceed 250 characters.")
        .optional(),

      location: z
        .string()
        .trim()
        .max(100, "Location cannot exceed 100 characters.")
        .optional(),

      website: z
        .string()
        .trim()
        .url("Please enter a valid website URL.")
        .optional()
        .or(z.literal("")),

      github: z
        .string()
        .trim()
        .url("Please enter a valid GitHub URL.")
        .optional()
        .or(z.literal("")),

      linkedin: z
        .string()
        .trim()
        .url("Please enter a valid LinkedIn URL.")
        .optional()
        .or(z.literal("")),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required.",
    }),

  params: z.object({}),
  query: z.object({}),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter and one number."
      ),
  }),

  params: z.object({}),
  query: z.object({}),
});