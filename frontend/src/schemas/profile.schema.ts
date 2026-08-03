import { z } from 'zod'

const optionalUrl = (message: string) => z.union([z.literal(''), z.url(message)])

/** Matches the backend's profile edit validation: social fields are URLs, not handles. */
export const profileEditSchema = z.object({
  bio: z.string().max(250, 'Bio cannot exceed 250 characters.'),
  github: optionalUrl('Enter a valid GitHub URL.'),
  linkedin: optionalUrl('Enter a valid LinkedIn URL.'),
  location: z.string().max(100, 'Location cannot exceed 100 characters.'),
  website: optionalUrl('Enter a valid website URL.'),
})

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>
