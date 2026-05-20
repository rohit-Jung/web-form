import { z } from "zod"

export const fieldValidationsSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().min(1).optional(),
    pattern: z.string().optional(),
  })
  .nullable()

export type FieldValidations = z.infer<typeof fieldValidationsSchema>
