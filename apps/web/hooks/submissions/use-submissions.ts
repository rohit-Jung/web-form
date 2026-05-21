"use client"

import { useTRPC } from "@/providers"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export function useSubmissions(formId: string) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.submission.getByFormId.queryOptions({ formId }, { retry: false })
  )
  return { submissions: data ?? [], isLoading }
}

export function useFormAnalytics(formId: string) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.submission.getAnalytics.queryOptions({ formId }, { retry: false })
  )
  return { analytics: data ?? null, isLoading }
}

export function useSubmitForm() {
  const trpc = useTRPC()
  return useMutation(
    trpc.submission.submit.mutationOptions({
      onError: () => toast.error("Failed to submit form. Please try again."),
    })
  )
}
