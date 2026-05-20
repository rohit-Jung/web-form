import { publicProcedure, router } from "../../trpc"
import { z, zUndefinedModel } from "../../schema"

export const healthRouter = router({
  getStatus: publicProcedure
    .input(zUndefinedModel)
    .output(z.object({ message: z.string(), status: z.literal("healthy") }))
    .query(() => ({
      message: "Server is up and running",
      status: "healthy" as const,
    })),
})
