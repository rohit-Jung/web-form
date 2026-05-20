import { authUserOutputSchema, supportedProviderSchema } from "@workspace/services/auth/schemas"
import { z } from "../../schema"
import { authService } from "../../services"
import { protectedProcedure, publicProcedure, router } from "../../trpc"

const TAGS = ["Authentication"]

export const authRouter = router({
  getSupportedProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: "/auth/providers", tags: TAGS, summary: "List supported OAuth providers" } })
    .input(z.undefined())
    .output(z.array(supportedProviderSchema))
    .query(() => authService.getSupportedProviders()),

  me: publicProcedure
    .meta({ openapi: { method: "GET", path: "/auth/me", tags: TAGS, summary: "Get current authenticated user" } })
    .input(z.undefined())
    .output(authUserOutputSchema.nullable())
    .query(({ ctx }) => ctx.user ?? null),
})
