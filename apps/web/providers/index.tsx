"use client"

import { trpcClient } from "@/trpc/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { AppRouter } from "@workspace/trpc/client"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window == "undefined") {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const trpcContext = createTRPCContext<AppRouter>()

const { TRPCProvider } = trpcContext
export function TanstackQueryClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export const { useTRPC, useTRPCClient } = trpcContext
