"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  BarChart2,
  Link2,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  ExternalLink,
  Copy,
  QrCode,
  Download,
} from "lucide-react"
import QRCodeSVG from "react-qr-code"
import {
  useForms,
  useCreateForm,
  useDeleteForm,
  usePublishForm,
  useUnpublishForm,
  useCloneForm,
} from "@/hooks/forms/use-forms"
import { colors, fonts, shadows, ActionBurst } from "@/lib/design-system"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"
import type { FormOutput } from "@workspace/services/form/schemas/output"

const CF = fonts.comic
const CB = fonts.body

function CreateFormDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [visibility, setVisibility] = useState<"unlisted" | "public">(
    "unlisted"
  )
  const createForm = useCreateForm()
  const router = useRouter()

  const handleCreate = async () => {
    if (!title.trim()) return
    const form = await createForm.mutateAsync({
      title: title.trim(),
      visibility,
    })
    onClose()
    router.push(`/dashboard/forms/${form.id}/edit`)
  }

  return (
    <DialogContent
      className="max-w-md overflow-hidden rounded-none border-4 border-black bg-white p-0 dark:border-white/20 dark:bg-zinc-900"
      style={{ boxShadow: shadows.lg }}
    >
      <div
        className="border-b-4 border-black px-5 py-4 dark:border-white/20"
        style={{ backgroundColor: colors.spiderRed }}
      >
        <DialogTitle style={CF} className="text-2xl text-white">
          CREATE NEW FORM
        </DialogTitle>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-1.5">
          <label
            style={CF}
            className="block text-xs tracking-wider text-black/60 uppercase dark:text-white/60"
          >
            FORM TITLE
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Spider-Man Fan Survey"
            style={CB}
            className="rounded-none border-2 border-black focus-visible:border-[#CC0000] focus-visible:ring-0 dark:border-white/20 dark:bg-zinc-800 dark:text-white dark:placeholder:text-white/30"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label
            style={CF}
            className="block text-xs tracking-wider text-black/60 uppercase dark:text-white/60"
          >
            VISIBILITY
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["unlisted", "public"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className="flex flex-col items-start gap-1 border-2 p-3 text-left transition-all"
                style={
                  visibility === v
                    ? {
                        borderColor: "#CC0000",
                        backgroundColor: "#fff8f8",
                        boxShadow: "2px 2px 0 #CC0000",
                      }
                    : { borderColor: "#0a0a0a" }
                }
              >
                <div className="flex items-center gap-1.5">
                  {v === "public" ? (
                    <Globe
                      size={13}
                      style={{
                        color: visibility === v ? "#CC0000" : undefined,
                      }}
                    />
                  ) : (
                    <FileText
                      size={13}
                      style={{
                        color: visibility === v ? "#CC0000" : undefined,
                      }}
                    />
                  )}
                  <span style={CF} className="text-sm">
                    {v === "public" ? "PUBLIC" : "UNLISTED"}
                  </span>
                </div>
                <span
                  style={CB}
                  className="text-[10px] leading-tight text-black/50 dark:text-white/50"
                >
                  {v === "public"
                    ? "Shows in Explore page"
                    : "Only via direct link"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || createForm.isPending}
            className="flex-1 rounded-none border-2 border-black bg-[#CC0000] text-white hover:bg-[#aa0000]"
            style={{ ...CF, boxShadow: shadows.sm }}
          >
            {createForm.isPending ? "CREATING..." : "CREATE FORM"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none border-2 border-black dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            style={CF}
          >
            CANCEL
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function QRDialog({
  form,
  onClose,
}: {
  form: FormOutput
  onClose: () => void
}) {
  const url = `${window.location.origin}/f/${form.slug}`
  const svgRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const svg = svgRef.current?.querySelector("svg")
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: "image/svg+xml" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${form.title.replace(/\s+/g, "_")}_qr.svg`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <DialogContent
      className="max-w-sm overflow-hidden rounded-none border-4 border-black bg-white p-0 dark:border-white/20 dark:bg-zinc-900"
      style={{ boxShadow: shadows.lg }}
    >
      <div
        className="border-b-4 border-black px-5 py-4 dark:border-white/20"
        style={{ backgroundColor: colors.spiderRed }}
      >
        <DialogTitle style={CF} className="text-2xl text-white">
          QR CODE
        </DialogTitle>
        <p style={CB} className="mt-0.5 truncate text-xs text-white/70">
          {url}
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 p-6">
        <div
          ref={svgRef}
          className="border-4 border-black bg-white p-3"
          style={{ boxShadow: shadows.md }}
        >
          <QRCodeSVG value={url} size={200} />
        </div>

        <div className="flex w-full gap-2">
          <Button
            onClick={handleDownload}
            className="h-9 flex-1 gap-1.5 rounded-none border-2 border-black bg-[#CC0000] text-white hover:bg-[#aa0000]"
            style={CF}
          >
            <Download size={13} />
            DOWNLOAD SVG
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(url)
              toast.success("Link copied!")
            }}
            className="h-9 gap-1.5 rounded-none border-2 border-black px-3 dark:border-white/40 dark:text-white"
            style={CF}
          >
            <Link2 size={13} />
            COPY
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function FormCard({ form }: { form: FormOutput }) {
  const deleteForm = useDeleteForm()
  const publishForm = usePublishForm()
  const unpublishForm = useUnpublishForm()
  const cloneForm = useCloneForm()
  const [qrOpen, setQrOpen] = useState(false)

  const handleCopyLink = () => {
    if (form.slug) {
      const url = `${window.location.origin}/f/${form.slug}`
      void navigator.clipboard.writeText(url)
      toast.success("Link copied!")
    }
  }

  const handleDelete = () => {
    if (confirm(`Delete "${form.title}"? This cannot be undone.`)) {
      deleteForm.mutate({ id: form.id })
    }
  }

  return (
    <>
      <div
        className="group flex flex-col border-4 border-black bg-white transition-transform hover:-translate-y-0.5 dark:border-white/20 dark:bg-zinc-800 dark:[box-shadow:6px_6px_0_rgba(255,255,255,0.08)]"
        style={{ boxShadow: shadows.md }}
      >
        <div
          className="h-1.5 w-full"
          style={{
            backgroundColor: form.published ? colors.spiderRed : "#d1d5db",
          }}
        />

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              className={`rounded-none border-2 px-2 py-0.5 text-[10px] tracking-wider uppercase ${
                form.published
                  ? "border-black bg-[#CC0000] text-white"
                  : "border-zinc-400 bg-zinc-100 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
              }`}
            >
              {form.published ? "LIVE" : "DRAFT"}
            </Badge>
            {form.published && (
              <Badge
                className={`gap-0.5 rounded-none border-2 border-black px-2 py-0.5 text-[10px] tracking-wider text-black uppercase dark:border-white/30 dark:text-white ${
                  form.visibility === "public"
                    ? "bg-blue-100 dark:bg-blue-950/60"
                    : "bg-yellow-100 dark:bg-yellow-950/60"
                }`}
              >
                {form.visibility === "public" ? (
                  <>
                    <Globe size={8} className="mr-0.5 inline" />
                    PUBLIC
                  </>
                ) : (
                  <>
                    <FileText size={8} className="mr-0.5 inline" />
                    UNLISTED
                  </>
                )}
              </Badge>
            )}
            {form.responseLimit && (
              <Badge className="rounded-none border-2 border-orange-400 bg-orange-50 px-2 py-0.5 text-[10px] tracking-wider text-orange-700 uppercase dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                MAX {form.responseLimit}
              </Badge>
            )}
          </div>

          <div className="flex-1">
            <h3
              style={CF}
              className="line-clamp-2 text-xl leading-tight text-black transition-colors group-hover:text-[#CC0000] dark:text-white"
            >
              {form.title}
            </h3>
            <p
              style={CB}
              className="mt-1 text-xs text-black/40 dark:text-white/40"
            >
              Created{" "}
              {form.createdAt
                ? new Date(form.createdAt).toLocaleDateString()
                : "recently"}
            </p>
          </div>

          <div className="border-t-2 border-black/10 dark:border-white/10" />

          <div className="flex flex-wrap items-center gap-1.5">
            <Link href={`/dashboard/forms/${form.id}/edit`}>
              <Button
                size="sm"
                className="h-8 gap-1 rounded-none border-2 border-black bg-black px-3 text-white hover:bg-black/80 dark:border-zinc-300 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                <Pencil size={11} />
                <span style={CF} className="text-xs">
                  EDIT
                </span>
              </Button>
            </Link>

            <Link href={`/dashboard/forms/${form.id}/responses`}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 rounded-none border-2 border-black px-3 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
              >
                <BarChart2 size={11} />
                <span style={CF} className="text-xs">
                  ANALYTICS
                </span>
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 rounded-none border-2 border-black px-2.5 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
              onClick={() => cloneForm.mutate({ id: form.id })}
              disabled={cloneForm.isPending}
              title="Clone form"
            >
              <Copy size={11} />
              <span style={CF} className="text-xs">
                CLONE
              </span>
            </Button>

            {form.published && form.slug && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 rounded-none border-2 border-black px-2.5 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
                  onClick={handleCopyLink}
                >
                  <Link2 size={11} />
                  <span style={CF} className="text-xs">
                    COPY
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 rounded-none border-2 border-black px-0 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
                  onClick={() => setQrOpen(true)}
                  title="Show QR code"
                >
                  <QrCode size={11} />
                </Button>
                <a
                  href={`/f/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 rounded-none border-2 border-black px-2.5 dark:border-white/40 dark:text-white dark:hover:bg-white/10"
                  >
                    <ExternalLink size={11} />
                    <span style={CF} className="text-xs">
                      OPEN
                    </span>
                  </Button>
                </a>
              </>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              {form.published ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 rounded-none border-2 border-black/30 px-2.5 text-black/50 hover:border-black dark:border-white/20 dark:text-white/50 dark:hover:border-white/40"
                  onClick={() => unpublishForm.mutate({ id: form.id })}
                  disabled={unpublishForm.isPending}
                >
                  <EyeOff size={11} />
                  <span style={CF} className="text-xs">
                    UNPUBLISH
                  </span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-8 gap-1 rounded-none border-2 border-black bg-[#003366] px-2.5 text-white hover:bg-[#002244]"
                  onClick={() => publishForm.mutate({ id: form.id })}
                  disabled={publishForm.isPending}
                >
                  <Eye size={11} />
                  <span style={CF} className="text-xs">
                    PUBLISH
                  </span>
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 rounded-none border-2 border-[#CC0000]/30 p-0 text-[#CC0000]/60 hover:border-[#CC0000] hover:bg-[#CC0000]/5"
                onClick={handleDelete}
                disabled={deleteForm.isPending}
              >
                <Trash2 size={11} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {form.published && form.slug && (
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <QRDialog form={form} onClose={() => setQrOpen(false)} />
        </Dialog>
      )}
    </>
  )
}

export default function FormsListPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { forms, isLoading } = useForms()

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            style={{
              ...CF,
              color: colors.spiderRed,
              textShadow: `3px 3px 0 ${colors.marvelBlue}`,
            }}
            className="text-4xl"
          >
            MY FORMS
          </h1>
          <p
            style={CB}
            className="mt-1 text-sm text-black/50 dark:text-white/50"
          >
            {forms.length} form{forms.length !== 1 ? "s" : ""} in your
            collection
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="h-11 shrink-0 gap-2 rounded-none border-4 border-black bg-[#CC0000] px-5 text-white hover:bg-[#aa0000]"
          style={{ boxShadow: shadows.md, ...CF }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span style={CF} className="text-sm">
            NEW FORM
          </span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-52 rounded-none border-4 border-black bg-black/5"
            />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="border-4 border-dashed border-black bg-white p-16 text-center dark:border-white/20 dark:bg-zinc-800/50">
          <div className="mb-4 flex justify-center">
            <ActionBurst word="EMPTY!" size="w-20 h-20" textSize="text-xs" />
          </div>
          <h2 style={CF} className="mb-2 text-3xl text-black dark:text-white">
            NO FORMS YET
          </h2>
          <p
            style={CB}
            className="mb-6 text-sm text-black/50 dark:text-white/50"
          >
            Create your first form and start collecting responses.
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-11 rounded-none border-4 border-black bg-[#CC0000] px-6 text-white hover:bg-[#aa0000]"
            style={{ boxShadow: shadows.md }}
          >
            <Plus size={16} strokeWidth={2.5} className="mr-2" />
            <span style={CF} className="text-base">
              CREATE YOUR FIRST FORM
            </span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <CreateFormDialog onClose={() => setCreateOpen(false)} />
      </Dialog>
    </div>
  )
}
