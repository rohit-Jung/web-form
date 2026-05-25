"use client"

import { useState, useEffect, useCallback, useRef, use } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Globe,
  FileText,
  Radio,
  StopCircle,
  Palette,
} from "lucide-react"
import {
  useForm,
  useUpdateForm,
  usePublishForm,
  useUnpublishForm,
  useStartLive,
  useStopLive,
} from "@/hooks/forms/use-forms"
import { useCreateField, useReorderFields } from "@/hooks/forms/use-fields"
import { TipTapDescription } from "@/components/editor/tiptap-description"
import { FieldConfigPanel } from "@/components/editor/field-config-panel"
import { PreviewDialog } from "@/components/editor/preview-dialog"
import { colors, fonts, shadows } from "@/lib/design-system"
import { THEME_LIST, getTheme, resolveTheme } from "@/lib/form-themes"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import { toast } from "sonner"
import type {
  FieldOutput,
  FieldType,
} from "@workspace/services/field/schemas/output"

const CF = fonts.comic
const CB = fonts.body

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Short Text", icon: "T" },
  { type: "textarea", label: "Long Text", icon: "¶" },
  { type: "email", label: "Email", icon: "@" },
  { type: "number", label: "Number", icon: "#" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "select", label: "Dropdown", icon: "▽" },
  { type: "multiselect", label: "Multi Select", icon: "☑" },
  { type: "radio", label: "Radio", icon: "◎" },
  { type: "checkbox", label: "Checkbox", icon: "□" },
]

function FieldItem({
  field,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  field: FieldOutput
  isSelected: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-2 border-2 px-3 py-2.5 transition-all ${
        isSelected
          ? "border-[#CC0000] bg-[#fffde7] dark:bg-yellow-950/40"
          : "border-black bg-white hover:border-black/60 dark:border-white/20 dark:bg-zinc-800 dark:hover:border-white/40"
      }`}
      style={
        isSelected
          ? { boxShadow: "3px 3px 0 #CC0000" }
          : { boxShadow: "2px 2px 0 rgba(0,0,0,0.15)" }
      }
      onClick={onSelect}
    >
      <div className="flex flex-col gap-0.5 text-black/40 dark:text-white/30">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMoveUp()
          }}
          disabled={isFirst}
          className="transition-colors hover:text-[#CC0000] disabled:opacity-20"
        >
          <ChevronUp size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMoveDown()
          }}
          disabled={isLast}
          className="transition-colors hover:text-[#CC0000] disabled:opacity-20"
        >
          <ChevronDown size={12} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            style={CB}
            className="truncate text-sm font-medium text-black dark:text-white"
          >
            {field.label}
          </span>
          {field.required && <span className="text-xs text-[#CC0000]">*</span>}
        </div>
        <span
          style={CB}
          className="text-xs text-black/40 capitalize dark:text-white/40"
        >
          {field.type}
        </span>
      </div>
    </div>
  )
}

export default function FormEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { form, isLoading } = useForm(id)
  const updateForm = useUpdateForm()
  const publishForm = usePublishForm()
  const unpublishForm = useUnpublishForm()
  const startLive = useStartLive()
  const stopLive = useStopLive()
  const createField = useCreateField()
  const reorderFields = useReorderFields()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [fields, setFields] = useState<FieldOutput[]>([])
  const [titleSaving, setTitleSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState("minimal")
  const [primaryColor, setPrimaryColor] = useState<string>("")
  const [accentColor, setAccentColor] = useState<string>("")
  const [responseLimit, setResponseLimit] = useState<string>("")
  const descSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const themeSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const limitSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (form) {
      setTitle(form.title)
      setDescription(form.description ?? "")
      setFields(form.fields)
      setActiveTheme(form.theme ?? "minimal")
      setPrimaryColor(form.primaryColor ?? "")
      setAccentColor(form.accentColor ?? "")
      setResponseLimit(form.responseLimit ? String(form.responseLimit) : "")
    }
  }, [form])

  useEffect(() => {
    if (form?.fields) {
      setFields(form.fields)
    }
  }, [form?.fields])

  const saveTitle = useCallback(async () => {
    if (!form || title.trim() === form.title) return
    setTitleSaving(true)
    try {
      await updateForm.mutateAsync({ id, title: title.trim() })
    } finally {
      setTitleSaving(false)
    }
  }, [form, id, title, updateForm])

  const saveDescription = useCallback(
    (html: string) => {
      setDescription(html)
      if (descSaveTimer.current) clearTimeout(descSaveTimer.current)
      descSaveTimer.current = setTimeout(() => {
        updateForm.mutate({ id, description: html })
      }, 800)
    },
    [id, updateForm]
  )

  const saveTheme = useCallback(
    (theme: string, primary: string, accent: string) => {
      if (themeSaveTimer.current) clearTimeout(themeSaveTimer.current)
      themeSaveTimer.current = setTimeout(() => {
        updateForm.mutate({
          id,
          theme,
          primaryColor: primary || null,
          accentColor: accent || null,
        })
      }, 400)
    },
    [id, updateForm]
  )

  const handleThemeChange = (themeId: string) => {
    const t = getTheme(themeId)
    setActiveTheme(themeId)
    const newPrimary = primaryColor || t.primaryBg
    const newAccent = accentColor || t.accentColor
    setPrimaryColor(newPrimary)
    setAccentColor(newAccent)
    saveTheme(themeId, newPrimary, newAccent)
  }

  const handleColorChange = (type: "primary" | "accent", value: string) => {
    if (type === "primary") {
      setPrimaryColor(value)
      saveTheme(activeTheme, value, accentColor)
    } else {
      setAccentColor(value)
      saveTheme(activeTheme, primaryColor, value)
    }
  }

  const handleResponseLimitChange = (value: string) => {
    setResponseLimit(value)
    if (limitSaveTimer.current) clearTimeout(limitSaveTimer.current)
    limitSaveTimer.current = setTimeout(() => {
      const parsed = value ? parseInt(value, 10) : null
      if (parsed !== null && (isNaN(parsed) || parsed < 1)) return
      updateForm.mutate({ id, responseLimit: parsed })
    }, 600)
  }

  const handleResetColors = () => {
    const t = getTheme(activeTheme)
    setPrimaryColor(t.primaryBg)
    setAccentColor(t.accentColor)
    saveTheme(activeTheme, t.primaryBg, t.accentColor)
  }

  const handleAddField = async (type: FieldType) => {
    const nextOrder = fields.length
    await createField.mutateAsync({
      formId: id,
      type,
      label: `Question ${nextOrder + 1}`,
      required: false,
      order: nextOrder,
    })
  }

  const handleMoveField = async (fieldId: string, direction: "up" | "down") => {
    const idx = fields.findIndex((f) => f.id === fieldId)
    if (idx === -1) return
    const next = [...fields]
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[idx], next[swapIdx]] = [next[swapIdx]!, next[idx]!]
    setFields(next)
    await reorderFields.mutateAsync({
      formId: id,
      orderedIds: next.map((f) => f.id),
    })
  }

  const handlePublishToggle = () => {
    if (!form) return
    if (form.published) {
      unpublishForm.mutate({ id })
    } else {
      if (fields.length === 0) {
        toast.error("Add at least one field before publishing")
        return
      }
      publishForm.mutate({ id })
    }
  }

  const formUrl =
    form?.slug && typeof window !== "undefined"
      ? `${window.location.origin}/f/${form.slug}`
      : null

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64 rounded-none border-2 border-black bg-black/5" />
        <Skeleton className="h-4 w-48 bg-black/5" />
        <Skeleton className="h-[500px] rounded-none border-4 border-black bg-black/5" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-6">
        <p style={CF} className="text-2xl text-black">
          FORM NOT FOUND
        </p>
      </div>
    )
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null

  return (
    <div className="flex h-screen flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b-4 border-black bg-[#f5f5f0] px-4 py-3 dark:border-white/10 dark:bg-zinc-900">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-black transition-colors hover:text-[#CC0000] dark:text-white dark:hover:text-[#CC0000]"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            className="h-auto rounded-none border-0 border-b-2 border-black bg-transparent px-0 py-0.5 text-lg text-black focus-visible:border-[#CC0000] focus-visible:ring-0 dark:border-white/30 dark:text-white"
            style={CF}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`rounded-none border-2 text-[10px] tracking-wider uppercase ${
              form.published
                ? "border-black bg-[#CC0000] text-white"
                : "border-black bg-[#f5f5f0] text-black dark:border-white/30 dark:bg-zinc-800 dark:text-white/70"
            }`}
          >
            {form.published ? "LIVE" : "DRAFT"}
          </Badge>

          {form.published && form.slug ? (
            <a
              href={`/f/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 rounded-none border-2 border-black px-3 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              >
                <Eye size={12} />
                <span style={CF} className="text-xs">
                  PREVIEW
                </span>
              </Button>
            </a>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 rounded-none border-2 border-black px-3 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye size={12} />
              <span style={CF} className="text-xs">
                PREVIEW
              </span>
            </Button>
          )}

          {form.published &&
            (() => {
              const isLive =
                form.liveUntil && new Date(form.liveUntil) > new Date()
              if (isLive) {
                return (
                  <Button
                    size="sm"
                    onClick={() => stopLive.mutate({ id })}
                    disabled={stopLive.isPending}
                    className="h-8 animate-pulse gap-1 rounded-none border-2 border-black px-3"
                    style={{ backgroundColor: "#CC0000", color: "#fff" }}
                  >
                    <StopCircle size={11} />
                    <span style={CF} className="text-xs">
                      STOP LIVE
                    </span>
                  </Button>
                )
              }
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 gap-1 rounded-none border-2 border-black px-3"
                      style={{ backgroundColor: "#003366", color: "#fff" }}
                      disabled={startLive.isPending}
                    >
                      <Radio size={11} />
                      <span style={CF} className="text-xs">
                        GO LIVE
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 rounded-none border-2 border-black">
                    {[5, 10, 15, 30, 60].map((min) => (
                      <DropdownMenuItem
                        key={min}
                        onClick={() =>
                          startLive.mutate({ id, durationMinutes: min })
                        }
                        className="cursor-pointer"
                      >
                        <span style={CB} className="text-sm">
                          {min} minutes
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })()}

          <Button
            size="sm"
            onClick={handlePublishToggle}
            disabled={publishForm.isPending || unpublishForm.isPending}
            className={`h-8 rounded-none border-2 border-black px-4 dark:border-white/30 ${
              form.published
                ? "bg-[#f5f5f0] text-black hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                : "bg-[#CC0000] text-white hover:bg-[#aa0000]"
            }`}
            style={{ boxShadow: "2px 2px 0 #0a0a0a" }}
          >
            <span style={CF} className="text-xs">
              {form.published ? "UNPUBLISH" : "PUBLISH"}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 bg-white dark:bg-zinc-950">
        <div className="flex w-72 shrink-0 flex-col border-r-4 border-black bg-[#fffff4] dark:border-white/10 dark:bg-zinc-900">
          <div className="border-b-4 border-black p-4 dark:border-white/10">
            <label
              style={CF}
              className="mb-1 block text-xs tracking-wider text-black/50 uppercase dark:text-white/40"
            >
              DESCRIPTION
            </label>
            <TipTapDescription value={description} onChange={saveDescription} />
          </div>

          <div className="border-b-4 border-black dark:border-white/10">
            <button
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setThemeOpen((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Palette
                  size={13}
                  className="text-black/50 dark:text-white/40"
                />
                <span
                  style={CF}
                  className="text-xs tracking-wider text-black/50 uppercase dark:text-white/40"
                >
                  THEME
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  style={CB}
                  className="text-[10px] text-black/40 capitalize dark:text-white/30"
                >
                  {activeTheme}
                </span>
                <ChevronRight
                  size={13}
                  className="text-black/40 transition-transform dark:text-white/30"
                  style={{
                    transform: themeOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </button>

            {themeOpen && (
              <div className="space-y-4 px-3 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {THEME_LIST.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`flex flex-col gap-1.5 border-2 p-2 text-left transition-all hover:-translate-y-0.5 ${
                        activeTheme === t.id
                          ? "border-[#CC0000] bg-[#fff8f8] dark:bg-[#CC0000]/10"
                          : "border-zinc-300 bg-transparent dark:border-white/10"
                      }`}
                      style={
                        activeTheme === t.id
                          ? { boxShadow: "2px 2px 0 #CC0000" }
                          : undefined
                      }
                    >
                      <div className="flex gap-1">
                        {t.swatchColors.map((c, i) => (
                          <div
                            key={i}
                            className="h-4 w-4 shrink-0 border border-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span
                        style={CF}
                        className="text-[10px] leading-none text-black dark:text-white"
                      >
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <span
                    style={CF}
                    className="block text-[10px] tracking-wider text-black/50 uppercase dark:text-white/40"
                  >
                    CUSTOM COLORS
                  </span>
                  <div className="flex items-center gap-2">
                    <label
                      style={CB}
                      className="w-14 shrink-0 text-xs text-black/60 dark:text-white/50"
                    >
                      Primary
                    </label>
                    <input
                      type="color"
                      value={primaryColor || getTheme(activeTheme).primaryBg}
                      onChange={(e) =>
                        handleColorChange("primary", e.target.value)
                      }
                      className="h-8 w-8 cursor-pointer border-2 border-black p-0.5"
                    />
                    <span
                      style={CB}
                      className="font-mono text-xs text-black/40 dark:text-white/30"
                    >
                      {primaryColor || getTheme(activeTheme).primaryBg}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      style={CB}
                      className="w-14 shrink-0 text-xs text-black/60 dark:text-white/50"
                    >
                      Accent
                    </label>
                    <input
                      type="color"
                      value={accentColor || getTheme(activeTheme).accentColor}
                      onChange={(e) =>
                        handleColorChange("accent", e.target.value)
                      }
                      className="h-8 w-8 cursor-pointer border-2 border-black p-0.5"
                    />
                    <span
                      style={CB}
                      className="font-mono text-xs text-black/40 dark:text-white/30"
                    >
                      {accentColor || getTheme(activeTheme).accentColor}
                    </span>
                  </div>
                  <button
                    onClick={handleResetColors}
                    style={CF}
                    className="text-[10px] tracking-wider text-black/40 uppercase transition-colors hover:text-[#CC0000] dark:text-white/30"
                  >
                    RESET TO THEME DEFAULTS
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-b-4 border-black px-3 py-2 dark:border-white/10">
            <label style={CF} className="mb-1.5 block text-[10px] tracking-wider text-black/50 uppercase dark:text-white/40">
              RESPONSE LIMIT
            </label>
            <input
              type="number"
              min="1"
              value={responseLimit}
              onChange={(e) => handleResponseLimitChange(e.target.value)}
              placeholder="Unlimited"
              style={CB}
              className="h-7 w-full rounded-none border-2 border-black/20 bg-transparent px-2 text-xs text-black placeholder:text-black/30 focus:border-[#CC0000] focus:outline-none dark:border-white/10 dark:text-white dark:placeholder:text-white/20"
            />
            {responseLimit && (
              <button
                onClick={() => handleResponseLimitChange("")}
                style={CF}
                className="mt-1 text-[9px] tracking-wider text-black/30 uppercase transition-colors hover:text-[#CC0000] dark:text-white/20"
              >
                REMOVE LIMIT
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-auto p-3">
            <div className="mb-2 flex items-center justify-between">
              <span
                style={CF}
                className="text-xs tracking-wider text-black/50 uppercase dark:text-white/40"
              >
                FIELDS ({fields.length})
              </span>
            </div>

            {fields.length === 0 && (
              <p
                style={CB}
                className="py-4 text-center text-xs text-black/40 dark:text-white/30"
              >
                No fields yet. Add your first question below.
              </p>
            )}

            {fields.map((field, i) => (
              <FieldItem
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
                onSelect={() => setSelectedFieldId(field.id)}
                onMoveUp={() => handleMoveField(field.id, "up")}
                onMoveDown={() => handleMoveField(field.id, "down")}
                isFirst={i === 0}
                isLast={i === fields.length - 1}
              />
            ))}
          </div>

          <div className="border-t-4 border-black p-3 dark:border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-9 w-full gap-2 rounded-none border-2 border-black bg-[#003366] text-white hover:bg-[#002244]"
                  style={{ boxShadow: shadows.sm }}
                  disabled={createField.isPending}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span style={CF} className="text-sm">
                    ADD FIELD
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-none border-2 border-black dark:border-white/20 dark:bg-zinc-900">
                {FIELD_TYPES.map((ft) => (
                  <DropdownMenuItem
                    key={ft.type}
                    onClick={() => handleAddField(ft.type)}
                    className="cursor-pointer gap-2 dark:text-white dark:focus:bg-white/10"
                  >
                    <span className="w-5 text-center font-mono text-xs">
                      {ft.icon}
                    </span>
                    <span style={CB} className="text-sm">
                      {ft.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-zinc-950">
          {selectedField ? (
            <FieldConfigPanel
              key={selectedField.id}
              field={selectedField}
              formId={id}
              onDelete={() => setSelectedFieldId(null)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="max-w-sm border-4 border-dashed border-black p-12 dark:border-white/20">
                <p
                  style={CF}
                  className="mb-2 text-2xl text-black/25 dark:text-white/25"
                >
                  SELECT A FIELD
                </p>
                <p
                  style={CB}
                  className="text-sm text-black/30 dark:text-white/30"
                >
                  Click a field on the left to configure it, or add a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        description={description}
        fields={fields}
        theme={resolveTheme(activeTheme, primaryColor, accentColor)}
      />

      {form.published && form.slug && (
        <div className="flex items-center gap-3 border-t-4 border-black bg-[#fffde7] px-4 py-2 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-1.5">
            {form.visibility === "public" ? (
              <Globe size={13} className="text-[#003366] dark:text-[#5b9bd5]" />
            ) : (
              <FileText
                size={13}
                className="text-black/50 dark:text-white/40"
              />
            )}
            <span
              style={CB}
              className="text-xs text-black/50 dark:text-white/40"
            >
              {form.visibility === "public" ? "Public" : "Unlisted"} form
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="h-4 bg-black/20 dark:bg-white/10"
          />
          <span
            style={CB}
            className="flex-1 truncate text-xs text-black/50 dark:text-white/40"
          >
            {formUrl}
          </span>
          <button
            onClick={() => {
              if (formUrl) {
                void navigator.clipboard.writeText(formUrl)
                toast.success("Link copied!")
              }
            }}
            style={CF}
            className="shrink-0 text-xs text-[#003366] hover:underline dark:text-[#5b9bd5]"
          >
            COPY LINK
          </button>
        </div>
      )}
    </div>
  )
}
