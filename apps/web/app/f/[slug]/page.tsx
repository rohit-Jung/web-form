"use client"

import { useState, use } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/providers"
import { useSubmitForm } from "@/hooks/submissions/use-submissions"
import { SpiderWeb } from "@/lib/design-system"
import { resolveTheme, type FormThemeConfig } from "@/lib/form-themes"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { TipTapDescription } from "@/components/editor/tiptap-description"
import type {
  FieldOutput,
  FieldType,
} from "@workspace/services/field/schemas/output"

function FieldRenderer({
  field,
  value,
  onChange,
  error,
  theme,
}: {
  field: FieldOutput
  value: string
  onChange: (v: string) => void
  error?: string
  theme: FormThemeConfig
}) {
  const inputStyle = {
    backgroundColor: theme.inputBg,
    borderColor: error ? theme.errorColor : theme.inputBorder,
    borderWidth: "2px",
    borderStyle: "solid" as const,
    borderRadius: theme.inputRadius,
    color: theme.inputText,
    fontFamily: theme.bodyFontFamily,
  }

  const focusClass = "focus-visible:ring-0 focus-visible:outline-none"

  const renderInput = () => {
    switch (field.type as FieldType) {
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Enter your answer"}
            className={`${focusClass} min-h-[100px] w-full resize-none text-sm`}
            style={inputStyle}
          />
        )

      case "email":
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "your@email.com"}
            className={`${focusClass} w-full text-sm`}
            style={inputStyle}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Enter a number"}
            className={`${focusClass} w-full text-sm`}
            style={inputStyle}
          />
        )

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${focusClass} w-full text-sm`}
            style={inputStyle}
          />
        )

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${focusClass} h-10 w-full appearance-none px-3 text-sm`}
            style={inputStyle}
          >
            <option value="">Select an option...</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {(field.options ?? []).map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2"
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors"
                  style={{
                    border: `2px solid ${value === opt ? theme.primaryBg : theme.inputBorder}`,
                    backgroundColor:
                      value === opt ? theme.primaryBg : "transparent",
                  }}
                >
                  {value === opt && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <span
                  className="text-sm"
                  style={{
                    color: theme.inputText,
                    fontFamily: theme.bodyFontFamily,
                  }}
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
      case "multiselect": {
        const selected = value
          ? value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
        const toggle = (opt: string) => {
          const next = selected.includes(opt)
            ? selected.filter((s) => s !== opt)
            : [...selected, opt]
          onChange(next.join(", "))
        }
        return (
          <div className="space-y-2">
            {(field.options ?? []).map((opt) => {
              const checked = selected.includes(opt)
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors"
                    style={{
                      border: `2px solid ${checked ? theme.primaryBg : theme.inputBorder}`,
                      borderRadius: theme.inputRadius === "0px" ? "0" : "4px",
                      backgroundColor: checked
                        ? theme.primaryBg
                        : "transparent",
                    }}
                    onClick={() => toggle(opt)}
                  >
                    {checked && (
                      <span className="text-xs leading-none text-white">✓</span>
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: theme.inputText,
                      fontFamily: theme.bodyFontFamily,
                    }}
                  >
                    {opt}
                  </span>
                </label>
              )
            })}
          </div>
        )
      }

      default:
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? "Enter your answer"}
            className={`${focusClass} w-full text-sm`}
            style={inputStyle}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5">
      <Label
        style={{
          color: theme.labelColor,
          fontFamily: theme.headingFontFamily,
          letterSpacing: theme.headingLetterSpacing,
        }}
        className="text-sm"
      >
        {field.label}
        {field.required && (
          <span style={{ color: theme.errorColor }} className="ml-1">
            *
          </span>
        )}
      </Label>
      {field.helpText && (
        <p
          className="text-xs"
          style={{
            color: theme.labelColor,
            opacity: 0.6,
            fontFamily: theme.bodyFontFamily,
          }}
        >
          {field.helpText}
        </p>
      )}
      {renderInput()}
      {error && (
        <p
          className="text-xs"
          style={{ color: theme.errorColor, fontFamily: theme.bodyFontFamily }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const trpc = useTRPC()
  const submitForm = useSubmitForm()

  const {
    data: form,
    isLoading,
    error,
  } = useQuery({
    ...trpc.form.getBySlug.queryOptions({ slug }),
    retry: false,
  })

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [respondentEmail, setRespondentEmail] = useState("")

  const theme = resolveTheme(form?.theme, form?.primaryColor, form?.accentColor)

  const handleChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form) return false
    for (const field of form.fields) {
      if (field.required && !answers[field.id]?.trim()) {
        newErrors[field.id] = "This field is required"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form || !validate()) return

    const answersList = Object.entries(answers)
      .filter(([, v]) => v.trim())
      .map(([fieldId, value]) => ({ fieldId, value }))

    try {
      await submitForm.mutateAsync({
        formId: form.id,
        respondentEmail: respondentEmail || undefined,
        answers: answersList,
      })
      router.push(`/f/${slug}/success`)
    } catch (err: any) {
      const msg = err?.message ?? ""
      if (msg.includes("response limit")) {
        setErrors({
          _form:
            "This form has reached its response limit and is no longer accepting submissions.",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div
          className="border-4 border-black bg-white p-8"
          style={{ boxShadow: "8px 8px 0 #0a0a0a" }}
        >
          <p
            className="animate-pulse text-2xl text-black"
            style={{
              fontFamily: "var(--font-bangers)",
              letterSpacing: "0.05em",
            }}
          >
            LOADING FORM...
          </p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div
          className="max-w-md border-4 border-black bg-white p-8 text-center"
          style={{ boxShadow: "8px 8px 0 #0a0a0a" }}
        >
          <SpiderWeb className="mx-auto mb-4 h-16 w-16 text-[#CC0000]" />
          <h1
            className="mb-2 text-3xl text-black"
            style={{
              fontFamily: "var(--font-bangers)",
              letterSpacing: "0.05em",
            }}
          >
            FORM NOT FOUND
          </h1>
          <p
            className="text-sm text-black/60"
            style={{ fontFamily: "var(--font-comic)" }}
          >
            This form doesn&apos;t exist, has been unpublished, or the link is
            invalid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: theme.pageBg, ...(theme.pagePattern ?? {}) }}
    >
      <div className="mx-auto mb-6 max-w-xl">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 transition-colors"
          style={{ color: theme.labelColor, opacity: 0.5 }}
        >
          <SpiderWeb className="h-4 w-4" />
          <span
            className="text-sm"
            style={{
              fontFamily: "var(--font-bangers)",
              letterSpacing: "0.05em",
            }}
          >
            WEBFORM
          </span>
        </a>
      </div>

      <div className="mx-auto max-w-xl">
        <div
          style={{
            border: theme.containerBorder,
            boxShadow: theme.containerShadow,
            borderRadius: theme.containerRadius,
            overflow: "hidden",
          }}
        >
          <div
            className="p-6"
            style={{
              backgroundColor: theme.headerBg,
              ...(theme.headerPattern ?? {}),
            }}
          >
            <h1
              className="mb-2 text-3xl"
              style={{
                fontFamily: theme.headingFontFamily,
                letterSpacing: theme.headingLetterSpacing,
                color: theme.headerText,
                textShadow:
                  theme.id === "spider-man"
                    ? "3px 3px 0 rgba(0,0,0,0.3)"
                    : "none",
              }}
            >
              {form.title}
            </h1>
            {form.description &&
              form.description.replace(/<[^>]+>/g, "").trim() && (
                <div style={{ color: theme.headerText, opacity: 0.8 }}>
                  <TipTapDescription
                    value={form.description}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
              )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
            style={{ backgroundColor: theme.bodyBg }}
          >
            {form.fields.length === 0 ? (
              <p
                className="py-8 text-center text-sm"
                style={{
                  color: theme.labelColor,
                  opacity: 0.5,
                  fontFamily: theme.bodyFontFamily,
                }}
              >
                This form has no fields.
              </p>
            ) : (
              <>
                {form.fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={answers[field.id] ?? ""}
                    onChange={(v) => handleChange(field.id, v)}
                    error={errors[field.id]}
                    theme={theme}
                  />
                ))}

                <div
                  className="space-y-1.5 pt-2"
                  style={{ borderTop: `1px solid ${theme.inputBorder}` }}
                >
                  <Label
                    className="text-xs tracking-wider uppercase"
                    style={{
                      color: theme.labelColor,
                      opacity: 0.6,
                      fontFamily: theme.headingFontFamily,
                    }}
                  >
                    Your Email (optional — to receive a copy)
                  </Label>
                  <Input
                    type="email"
                    value={respondentEmail}
                    onChange={(e) => setRespondentEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full text-sm focus-visible:ring-0"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.inputBorder,
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderRadius: theme.inputRadius,
                      color: theme.inputText,
                      fontFamily: theme.bodyFontFamily,
                    }}
                  />
                </div>

                {errors._form && (
                  <p
                    className="rounded px-3 py-2 text-sm"
                    style={{
                      backgroundColor: `${theme.errorColor}15`,
                      color: theme.errorColor,
                      fontFamily: theme.bodyFontFamily,
                    }}
                  >
                    {errors._form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitForm.isPending || !!errors._form}
                  className="h-12 w-full text-base transition-all disabled:opacity-60"
                  style={{
                    backgroundColor: theme.primaryBg,
                    color: theme.primaryText,
                    fontFamily: theme.headingFontFamily,
                    letterSpacing: theme.headingLetterSpacing,
                    borderRadius: theme.containerRadius,
                    boxShadow: theme.primaryShadow,
                    border:
                      theme.id === "spider-man" ? "3px solid #0a0a0a" : "none",
                    fontSize: theme.headingFontFamily.includes("bangers")
                      ? "1.2rem"
                      : "1rem",
                  }}
                  onMouseEnter={(e) => {
                    ;(
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = theme.primaryHover
                  }}
                  onMouseLeave={(e) => {
                    ;(
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = theme.primaryBg
                  }}
                >
                  {submitForm.isPending ? "SUBMITTING..." : "SUBMIT RESPONSE →"}
                </button>
              </>
            )}
          </form>
        </div>

        <p
          className="mt-4 text-center text-xs"
          style={{
            color: theme.labelColor,
            opacity: 0.4,
            fontFamily: theme.bodyFontFamily,
          }}
        >
          Powered by{" "}
          <a
            href="/"
            className="transition-colors"
            style={{ color: theme.accentColor }}
          >
            WebForm
          </a>
        </p>
      </div>
    </div>
  )
}
