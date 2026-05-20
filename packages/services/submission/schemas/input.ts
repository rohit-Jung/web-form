import { z } from "zod"

export const submitAnswerSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string().nullable(),
})

export const submitFormSchema = z.object({
  formId: z.string().uuid(),
  respondentEmail: z.string().email("Invalid email address").optional(),
  answers: z.array(submitAnswerSchema).min(1, "At least one answer required"),
})

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>
export type SubmitFormInput = z.infer<typeof submitFormSchema>
