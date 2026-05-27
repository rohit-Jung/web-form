import { TRPCError } from "@trpc/server"
import { authUserOutputSchema } from "@workspace/services/auth/schemas"
import { z } from "../../schema"
import { userService } from "../../services"
import { protectedProcedure, router } from "../../trpc"

const TAGS = ["User"]

export const userRouter = router({
  updateProfile: protectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/user/profile",
        tags: TAGS,
        summary: "Update user profile",
      },
    })
    .input(
      z.object({
        fullName: z.string().min(1).max(80).optional(),
        profileImageUrl: z.string().url().nullable().optional(),
      })
    )
    .output(authUserOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await userService.updateProfile(ctx.user.id, input)
      if (!user) throw new TRPCError({ code: "NOT_FOUND" })
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl ?? null,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      }
    }),
})
