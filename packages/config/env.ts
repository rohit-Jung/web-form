import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.enum(["error", "debug", "info"]).default("debug"),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env)
  if (!parsedEnv.success)
    throw new Error(
      `Env Variable Error ${JSON.stringify(parsedEnv.error.format())}`
    )

  return parsedEnv.data
}

export const env = createEnv(process.env)
