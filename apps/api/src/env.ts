import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BASE_URL: z.string().default("http://localhost:8080"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  DOCS_SECRET: z.string().min(1),
  COOKIE_DOMAIN: z.string().optional(),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const result = envSchema.safeParse(env)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export const env = createEnv(process.env)
