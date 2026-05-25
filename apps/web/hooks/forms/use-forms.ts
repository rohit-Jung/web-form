"use client"

import { useTRPC } from "@/providers"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useForms() {
  const trpc = useTRPC()
  const { data: forms, isLoading } = useQuery(trpc.form.getAll.queryOptions())
  return { forms: forms ?? [], isLoading }
}

export function useForm(id: string) {
  const trpc = useTRPC()
  const { data: form, isLoading } = useQuery(
    trpc.form.getById.queryOptions({ id })
  )
  return { form, isLoading }
}

export function useCreateForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form created")
      },
      onError: () => toast.error("Failed to create form"),
    })
  )
}

export function useUpdateForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.update.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.id }),
        })
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
      },
      onError: () => toast.error("Failed to update form"),
    })
  )
}

export function useDeleteForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form deleted")
      },
      onError: () => toast.error("Failed to delete form"),
    })
  )
}

export function usePublishForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.publish.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.id }),
        })
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form published")
      },
      onError: () => toast.error("Failed to publish form"),
    })
  )
}

export function useUnpublishForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.unpublish.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.id }),
        })
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form unpublished")
      },
      onError: () => toast.error("Failed to unpublish form"),
    })
  )
}

export function useStartLive() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.startLive.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.id }),
        })
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form is now LIVE!")
      },
      onError: (e) => toast.error(e.message ?? "Failed to start live session"),
    })
  )
}

export function useDashboardStats() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.form.getDashboardStats.queryOptions(undefined, { retry: false })
  )
  return {
    stats: data ?? null,
    isLoading,
  }
}

export function useCloneForm() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.clone.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Form cloned!")
      },
      onError: () => toast.error("Failed to clone form"),
    })
  )
}

export function useStopLive() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.form.stopLive.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getById.queryKey({ id: data.id }),
        })
        void queryClient.invalidateQueries({
          queryKey: trpc.form.getAll.queryKey(),
        })
        toast.success("Live session ended")
      },
      onError: () => toast.error("Failed to stop live session"),
    })
  )
}
