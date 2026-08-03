import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(100, 'Password cannot exceed 100 characters.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/\d/, 'Password must include a number.')

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    email: z.email('Enter a valid email address.'),
    name: z.string().min(1, 'Enter your name.'),
    password: passwordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.email('Enter a valid email address.'),
})

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
    password: passwordSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
