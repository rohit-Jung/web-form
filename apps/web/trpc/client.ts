import { createTRPCClient, httpLink } from "@trpc/client"
import type { AppRouter } from "@workspace/trpc/client"

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:8080/trpc",
    }),
  ],
})

