import { z } from "zod"
import { fieldOutputSchema } from "../../field/schemas/output"

const d2s = (v: unknown) => (v instanceof Date ? v.toISOString() : (v ?? null))

export const formVisibilitySchema = z.enum(["public", "unlisted"])

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string().nullable(),
  published: z.boolean(),
  visibility: formVisibilitySchema,
  liveUntil: z.preprocess(d2s, z.string().nullable()),
  theme: z.string().default("minimal"),
  primaryColor: z.string().nullable(),
  accentColor: z.string().nullable(),
  responseLimit: z.number().int().positive().nullable(),
  createdAt: z.preprocess(d2s, z.string().nullable()),
  updatedAt: z.preprocess(d2s, z.string().nullable()),
})

export const formWithFieldsOutputSchema = formOutputSchema.extend({
  fields: z.array(fieldOutputSchema),
})

export type FormVisibility = z.infer<typeof formVisibilitySchema>
export type FormOutput = z.infer<typeof formOutputSchema>
export type FormWithFieldsOutput = z.infer<typeof formWithFieldsOutputSchema>
