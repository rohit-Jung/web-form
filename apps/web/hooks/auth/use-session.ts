"use client"

import { useTRPC } from "@/providers"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useSession() {
  const trpc = useTRPC()
  const queryOptions = trpc.auth.me.queryOptions(undefined, { retry: false })
  const { data: user, isLoading, error } = useQuery(queryOptions)

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    error,
  }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Logout failed")
    },
    onSuccess: () => {
      queryClient.clear()
      window.location.href = "/login"
    },
  })
}
