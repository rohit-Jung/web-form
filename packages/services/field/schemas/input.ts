import { z } from "zod"
import { fieldTypeSchema } from "./output"
import { fieldValidationsSchema } from "./validation"

export const createFieldSchema = z.object({
  formId: z.string().uuid(),
  type: fieldTypeSchema,
  label: z.string().min(1, "Label is required").max(255),
  placeholder: z.string().max(255).optional(),
  helpText: z.string().max(500).optional(),
  required: z.boolean().default(false),
  order: z.number().int().min(0),
  options: z
    .array(z.string().min(1))
    .min(1, "At least one option required")
    .optional(),
  validations: fieldValidationsSchema.optional(),
})

export const updateFieldSchema = z.object({
  id: z.string().uuid(),
  type: fieldTypeSchema.optional(),
  label: z.string().min(1).max(255).optional(),
  placeholder: z.string().max(255).nullable().optional(),
  helpText: z.string().max(500).nullable().optional(),
  required: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  options: z.array(z.string().min(1)).nullable().optional(),
  validations: fieldValidationsSchema.optional(),
})

export const reorderFieldsSchema = z.object({
  formId: z.string().uuid(),
  orderedIds: z.array(z.string().uuid()).min(1),
})

export type CreateFieldInput = z.infer<typeof createFieldSchema>
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>
export type ReorderFieldsInput = z.infer<typeof reorderFieldsSchema>
