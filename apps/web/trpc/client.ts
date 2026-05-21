import { createTRPCClient } from "@trpc/client"
import type { AppRouter } from "@workspace/trpc/client"
import { createTRPCHttpLink } from "./create-client"

export const trpcClient = createTRPCClient<AppRouter>({
  links: [createTRPCHttpLink()],
})
