import { z } from "zod"

const d2s = (v: unknown) => (v instanceof Date ? v.toISOString() : (v ?? null))

export const answerOutputSchema = z.object({
  id: z.string().uuid(),
  submissionId: z.string().uuid(),
  fieldId: z.string().uuid(),
  value: z.string().nullable(),
})

export const submissionOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  respondentEmail: z.string().nullable(),
  submittedAt: z.preprocess(d2s, z.string().nullable()),
  answers: z.array(answerOutputSchema),
})

export const fieldBreakdownSchema = z.object({
  fieldId: z.string().uuid(),
  fieldLabel: z.string(),
  fieldType: z.string(),
  responsesCount: z.number(),
  valueCounts: z.record(z.string(), z.number()).nullable(),
})

export const dailyCountSchema = z.object({
  date: z.string(),
  count: z.number(),
})

export const analyticsOutputSchema = z.object({
  totalSubmissions: z.number(),
  submissionsLast30Days: z.number(),
  dailySubmissions: z.array(dailyCountSchema),
  fieldBreakdowns: z.array(fieldBreakdownSchema),
})

export const submitSuccessOutputSchema = z.object({
  submissionId: z.string().uuid(),
  message: z.string(),
})

export type AnswerOutput = z.infer<typeof answerOutputSchema>
export type SubmissionOutput = z.infer<typeof submissionOutputSchema>
export type AnalyticsOutput = z.infer<typeof analyticsOutputSchema>
export type DailyCount = z.infer<typeof dailyCountSchema>
export type SubmitSuccessOutput = z.infer<typeof submitSuccessOutputSchema>
