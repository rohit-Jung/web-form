import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "../server/"

export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>

export type { AppRouter } from "../server/"
export * from "@trpc/client"
