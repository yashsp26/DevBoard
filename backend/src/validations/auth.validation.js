import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password cannot exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter and one number."
      ),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .toLowerCase(),

    password: z.string().min(1, "Password is required."),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .toLowerCase(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string()
      .trim()
      .min(1, "Reset token is required."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password cannot exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter and one number."
      ),
  }),

  params: z.object({}),
  query: z.object({}),
});