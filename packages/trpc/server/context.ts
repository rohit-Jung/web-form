import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"
import { authService } from "./services"

export async function createContext({ req }: CreateExpressContextOptions) {
  const sessionToken = req.cookies?.session_token as string | undefined

  const user = sessionToken
    ? await authService.validateSession(sessionToken)
    : null

  return { user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
