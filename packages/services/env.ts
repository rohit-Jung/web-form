import { z } from "zod"

const envSchema = z.object({
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("WebForm <noreply@webform.dev>"),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const result = envSchema.safeParse(env)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export const env = createEnv(process.env)
