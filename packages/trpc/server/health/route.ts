import { publicProcedure, router } from "../trpc"
import { healthOutputModel, zUndefinedModel } from "./type"

export const healthRouter = router({
  getStatus: publicProcedure
    .input(zUndefinedModel)
    .output(healthOutputModel)
    .query(function (opts) {
      return {
        message: "Server is up and running",
      }
    }),
})
