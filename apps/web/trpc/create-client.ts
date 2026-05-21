import { httpBatchStreamLink, httpLink } from "@trpc/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/trpc"

interface Opts {
  streaming?: boolean
}

export function createTRPCHttpLink(opts?: Opts) {
  const link = opts?.streaming ? httpBatchStreamLink : httpLink
  return link({
    url: API_URL,
    fetch(url, options) {
      return fetch(url, { ...options, credentials: "include" })
    },
  })
}
