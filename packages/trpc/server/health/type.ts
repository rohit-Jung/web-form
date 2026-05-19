import z from "zod"

export const zUndefinedModel = z.undefined().describe("Undefined")

export const healthOutputModel = z.object({
  message: z.string().describe("Server Message"),
})
