import { CreateExpressContextOptions } from "@trpc/server/adapters/express"

export function createContext({
  req,
  res,
  info,
}: CreateExpressContextOptions): CreateExpressContextOptions {
  return { req, res, info }
}

export type CreateContext = Awaited<ReturnType<typeof createContext>>
