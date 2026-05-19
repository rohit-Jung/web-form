import { useQuery } from "@tanstack/react-query"
import { getHealthStatusQueryOptions } from "./api"
import { useTRPC } from "@/providers";

export const useHealthStatus = () => {
  const trpc = useTRPC()
  return useQuery(getHealthStatusQueryOptions(trpc))
}
