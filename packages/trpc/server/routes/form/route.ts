import { TRPCError } from "@trpc/server"
import { createFormSchema, updateFormSchema, startLiveSchema } from "@workspace/services/form/schemas/input"
import { formOutputSchema, formWithFieldsOutputSchema } from "@workspace/services/form/schemas/output"
import { z, zUndefinedModel } from "../../schema"
import { formService } from "../../services"
import { protectedProcedure, publicProcedure, router } from "../../trpc"

const TAGS = ["Forms"]

export const formRouter = router({
  create: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms", tags: TAGS, summary: "Create a new form" } })
    .input(createFormSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return formService.create({ ...input, userId: ctx.user.id })
    }),

  getAll: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms", tags: TAGS, summary: "List all forms for the authenticated user" } })
    .input(z.undefined())
    .output(z.array(formOutputSchema))
    .query(async ({ ctx }) => {
      return formService.getAll(ctx.user.id)
    }),

  getById: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms/{id}", tags: TAGS, summary: "Get form by ID (with fields)" } })
    .input(z.object({ id: z.string().uuid() }))
    .output(formWithFieldsOutputSchema)
    .query(async ({ input, ctx }) => {
      const form = await formService.getByIdWithFields(input.id)
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      if (form.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })
      return form
    }),

  getBySlug: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/slug/{slug}", tags: TAGS, summary: "Get published form by slug (public)" } })
    .input(z.object({ slug: z.string() }))
    .output(formWithFieldsOutputSchema)
    .query(async ({ input }) => {
      const form = await formService.getBySlugWithFields(input.slug)
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      if (!form.published) throw new TRPCError({ code: "NOT_FOUND", message: "Form not available" })
      return form
    }),

  getPublic: publicProcedure
    .meta({ openapi: { method: "GET", path: "/forms/explore", tags: TAGS, summary: "List public forms for explore page" } })
    .input(z.undefined())
    .output(z.array(formOutputSchema))
    .query(async () => {
      return formService.getPublicForms()
    }),

  update: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: "/forms/{id}", tags: TAGS, summary: "Update form metadata" } })
    .input(updateFormSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await formService.getById(input.id)
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" })
      if (existing.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })
      const form = await formService.update(input)
      if (!form) throw new TRPCError({ code: "NOT_FOUND" })
      return form
    }),

  publish: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms/{id}/publish", tags: TAGS, summary: "Publish a form" } })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.publish(input.id, ctx.user.id)
      if (!form) throw new TRPCError({ code: "NOT_FOUND" })
      return form
    }),

  unpublish: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms/{id}/unpublish", tags: TAGS, summary: "Unpublish a form" } })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.unpublish(input.id, ctx.user.id)
      if (!form) throw new TRPCError({ code: "NOT_FOUND" })
      return form
    }),

  delete: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/forms/{id}", tags: TAGS, summary: "Delete a form" } })
    .input(z.object({ id: z.string().uuid() }))
    .output(zUndefinedModel)
    .mutation(async ({ input, ctx }) => {
      const existing = await formService.getById(input.id)
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" })
      if (existing.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })
      await formService.delete(input.id, ctx.user.id)
    }),

  startLive: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/forms/{id}/live", tags: TAGS, summary: "Start a live session for a form" } })
    .input(startLiveSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const existing = await formService.getById(input.id)
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" })
      if (existing.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" })
      if (!existing.published) throw new TRPCError({ code: "BAD_REQUEST", message: "Publish the form before going live" })
      const form = await formService.startLive(input, ctx.user.id)
      if (!form) throw new TRPCError({ code: "NOT_FOUND" })
      return form
    }),

  stopLive: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/forms/{id}/live", tags: TAGS, summary: "Stop a live session" } })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.stopLive(input.id, ctx.user.id)
      if (!form) throw new TRPCError({ code: "NOT_FOUND" })
      return form
    }),

  getDashboardStats: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/forms/dashboard-stats", tags: TAGS, summary: "Get aggregate stats for dashboard" } })
    .input(z.undefined())
    .output(z.object({
      totalForms: z.number(),
      publishedForms: z.number(),
      draftForms: z.number(),
      liveForms: z.number(),
      totalResponses: z.number(),
      recentForms: z.array(z.object({
        id: z.string(),
        title: z.string(),
        published: z.boolean(),
        createdAt: z.string().nullable(),
        responseCount: z.number(),
      })),
    }))
    .query(async ({ ctx }) => {
      return formService.getDashboardStats(ctx.user.id)
    }),
})
