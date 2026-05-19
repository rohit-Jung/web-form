import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().describe("PostgreSQL connection URL"),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const result = envSchema.safeParse(env)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export const env = createEnv(process.env)
