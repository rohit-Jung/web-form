import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { UseQueryOptions } from "@tanstack/react-query"
import type { AppRouter } from "@workspace/trpc/client"

type TRPC = TRPCOptionsProxy<AppRouter>

export const getHealthStatusQueryOptions = (
  trpc: TRPC
): UseQueryOptions<any, any, any> => {
  return trpc.health.getStatus.queryOptions() as UseQueryOptions<any, any, any>
}
