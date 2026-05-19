import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { AppRouter } from "@workspace/trpc/client"

type TRPC = TRPCOptionsProxy<AppRouter>

export const getHealthStatusQueryOptions = (trpc: TRPC) => {
  return trpc.health.getStatus.queryOptions()
}
