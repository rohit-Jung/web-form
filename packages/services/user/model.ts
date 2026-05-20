import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().min(1).max(80),
  profileImageUrl: z.string().url().optional(),
})

export const userOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserOutput = z.infer<typeof userOutputSchema>
