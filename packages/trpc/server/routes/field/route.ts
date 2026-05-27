import { TRPCError } from "@trpc/server"
import {
  createFieldSchema,
  updateFieldSchema,
  reorderFieldsSchema,
} from "@workspace/services/field/schemas/input"
import { fieldOutputSchema } from "@workspace/services/field/schemas/output"
import { z, zUndefinedModel } from "../../schema"
import { fieldService, formService } from "../../services"
import { protectedProcedure, router } from "../../trpc"

const TAGS = ["Form Fields"]

export const fieldRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/fields",
        tags: TAGS,
        summary: "Add a field to a form",
      },
    })
    .input(createFieldSchema)
    .output(fieldOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.getById(input.formId)
      if (!form)
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" })
      if (form.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" })
      return fieldService.create(input)
    }),

  update: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/fields/{id}",
        tags: TAGS,
        summary: "Update a field",
      },
    })
    .input(updateFieldSchema)
    .output(fieldOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const field = await fieldService.getById(input.id)
      if (!field) throw new TRPCError({ code: "NOT_FOUND" })
      const form = await formService.getById(field.formId)
      if (!form || form.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN" })
      const updated = await fieldService.update(input)
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" })
      return updated
    }),

  delete: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/fields/{id}",
        tags: TAGS,
        summary: "Delete a field",
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(zUndefinedModel)
    .mutation(async ({ input, ctx }) => {
      await fieldService.delete(input.id, ctx.user.id)
    }),

  reorder: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/fields/reorder",
        tags: TAGS,
        summary: "Reorder fields within a form",
      },
    })
    .input(reorderFieldsSchema)
    .output(zUndefinedModel)
    .mutation(async ({ input, ctx }) => {
      await fieldService.reorder(input, ctx.user.id)
    }),
})
