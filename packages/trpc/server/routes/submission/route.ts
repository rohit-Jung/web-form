import { TRPCError } from "@trpc/server"
import { submitFormSchema } from "@workspace/services/submission/schemas/input"
import {
  analyticsOutputSchema,
  submissionOutputSchema,
  submitSuccessOutputSchema,
} from "@workspace/services/submission/schemas/output"
import { z } from "../../schema"
import { submissionService } from "../../services"
import { protectedProcedure, publicProcedure, router } from "../../trpc"

const TAGS = ["Submissions"]

export const submissionRouter = router({
  submit: publicProcedure
    .meta({ openapi: { method: "POST", path: "/submissions", tags: TAGS, summary: "Submit a form response (public)" } })
    .input(submitFormSchema)
    .output(submitSuccessOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const submission = await submissionService.submit(input)
        return { submissionId: submission.id, message: "Response submitted successfully" }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Submission failed"
        if (msg === "Form not found") throw new TRPCError({ code: "NOT_FOUND", message: msg })
        if (msg === "Form is not accepting responses")
          throw new TRPCError({ code: "FORBIDDEN", message: msg })
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
    }),

  getByFormId: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/submissions/{formId}", tags: TAGS, summary: "List all submissions for a form" } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(z.array(submissionOutputSchema))
    .query(async ({ input, ctx }) => {
      try {
        return await submissionService.getByFormId(input.formId, ctx.user.id)
      } catch {
        throw new TRPCError({ code: "FORBIDDEN" })
      }
    }),

  getAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/submissions/{formId}/analytics", tags: TAGS, summary: "Get analytics for a form" } })
    .input(z.object({ formId: z.string().uuid() }))
    .output(analyticsOutputSchema)
    .query(async ({ input, ctx }) => {
      try {
        return await submissionService.getAnalytics(input.formId, ctx.user.id)
      } catch {
        throw new TRPCError({ code: "FORBIDDEN" })
      }
    }),
})
