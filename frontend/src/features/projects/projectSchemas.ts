import { z } from 'zod'

export const projectColors = [
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#6366F1',
] as const

export const projectSchema = z.object({
  color: z.union([z.literal(''), z.enum(projectColors)]),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters.'),
  name: z.string().trim().min(2, 'Project name must be at least 2 characters.').max(100, 'Project name cannot exceed 100 characters.'),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
