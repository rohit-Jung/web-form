import { z } from "zod"
import { formVisibilitySchema } from "./output"

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  visibility: formVisibilitySchema.default("unlisted"),
  theme: z.string().max(50).default("minimal"),
  primaryColor: z.string().max(20).nullable().optional(),
  accentColor: z.string().max(20).nullable().optional(),
})

export const startLiveSchema = z.object({
  id: z.string().uuid(),
  durationMinutes: z.number().int().min(1).max(1440),
})

export const updateFormSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  published: z.boolean().optional(),
  visibility: formVisibilitySchema.optional(),
  theme: z.string().max(50).optional(),
  primaryColor: z.string().max(20).nullable().optional(),
  accentColor: z.string().max(20).nullable().optional(),
  responseLimit: z.number().int().positive().nullable().optional(),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormInput = z.infer<typeof updateFormSchema>
export type StartLiveInput = z.infer<typeof startLiveSchema>
