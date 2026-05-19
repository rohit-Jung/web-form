import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).optional(),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const result = envSchema.safeParse(env)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export const env = createEnv(process.env)
