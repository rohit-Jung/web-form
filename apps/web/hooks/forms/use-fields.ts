"use client"

import { useTRPC } from "@/providers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateField() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.field.create.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.formId }),
        })
        toast.success("Field added")
      },
      onError: () => toast.error("Failed to add field"),
    })
  )
}

export function useUpdateField() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.field.update.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.formId }),
        })
        toast.success("Field saved")
      },
      onError: () => toast.error("Failed to update field"),
    })
  )
}

export function useDeleteField(formId: string) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.field.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: formId }),
        })
        toast.success("Field removed")
      },
      onError: () => toast.error("Failed to delete field"),
    })
  )
}

export function useReorderFields() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.field.reorder.mutationOptions({
      onSuccess: (_, vars) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: vars.formId }),
        })
      },
      onError: () => toast.error("Failed to reorder fields"),
    })
  )
}
