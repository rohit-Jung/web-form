import { z } from "zod"
import { fieldValidationsSchema } from "./validation"

const d2s = (v: unknown) => (v instanceof Date ? v.toISOString() : (v ?? null))

export const fieldTypeSchema = z.enum([
  "text",
  "textarea",
  "email",
  "number",
  "date",
  "select",
  "multiselect",
  "radio",
  "checkbox",
  "file",
])

export const fieldOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string(),
  placeholder: z.string().nullable(),
  helpText: z.string().nullable(),
  required: z.boolean(),
  order: z.number(),
  options: z.array(z.string()).nullable(),
  validations: fieldValidationsSchema,
  createdAt: z.preprocess(d2s, z.string().nullable()),
  updatedAt: z.preprocess(d2s, z.string().nullable()),
})

export type FieldType = z.infer<typeof fieldTypeSchema>
export type FieldOutput = z.infer<typeof fieldOutputSchema>
