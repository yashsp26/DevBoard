import { z } from 'zod'
import { profileEditSchema, type ProfileEditFormValues } from '../../schemas/profile.schema'

export const updateProfileSchema = profileEditSchema
export type UpdateProfileFormValues = ProfileEditFormValues

const newPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[a-z]/, 'Password must include a lowercase letter.')
  .regex(/[A-Z]/, 'Password must include an uppercase letter.')
  .regex(/\d/, 'Password must include a number.')

export const changePasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: newPasswordSchema,
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
