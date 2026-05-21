"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { TipTapDescription } from "./tiptap-description"
import { type FormThemeConfig } from "@/lib/form-themes"
import type {
  FieldOutput,
  FieldType,
} from "@workspace/services/field/schemas/output"

function FieldRenderer({
  field,
  theme,
}: {
  field: FieldOutput
  theme: FormThemeConfig
}) {
  const [value, setValue] = useState("")

  const inputStyle = {
    backgroundColor: theme.inputBg,
    borderColor: theme.inputBorder,
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
            onChange={(e) => setValue(e.target.value)}
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
            onChange={(e) => setValue(e.target.value)}
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
            onChange={(e) => setValue(e.target.value)}
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
            onChange={(e) => setValue(e.target.value)}
            className={`${focusClass} w-full text-sm`}
            style={inputStyle}
          />
        )
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
                  onChange={(e) => setValue(e.target.value)}
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
          setValue(next.join(", "))
        }
        return (
          <div className="space-y-2">
            {(field.options ?? []).map((opt) => {
              const checked = selected.includes(opt)
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => toggle(opt)}
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
            onChange={(e) => setValue(e.target.value)}
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
    </div>
  )
}

interface PreviewDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  fields: FieldOutput[]
  theme: FormThemeConfig
}

export function PreviewDialog({
  open,
  onClose,
  title,
  description,
  fields,
  theme,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-xl overflow-auto p-0"
        style={{
          border: theme.containerBorder,
          boxShadow: theme.containerShadow,
          borderRadius: theme.containerRadius,
        }}
      >
        <DialogTitle className="sr-only">Form Preview</DialogTitle>

        <div
          className="flex items-center justify-end px-3 py-1.5"
          style={{ backgroundColor: theme.headerBg, opacity: 0.85 }}
        >
          <span
            style={{
              color: theme.headerText,
              fontFamily: theme.bodyFontFamily,
              fontSize: "10px",
              letterSpacing: "0.1em",
              opacity: 0.6,
            }}
          >
            PREVIEW — NOT SUBMITTABLE
          </span>
        </div>

        <div
          className="p-6"
          style={{
            backgroundColor: theme.headerBg,
            ...(theme.headerPattern ?? {}),
          }}
        >
          <h2
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
            {title}
          </h2>
          {description && description !== "<p></p>" && (
            <div style={{ color: theme.headerText, opacity: 0.8 }}>
              <TipTapDescription
                value={description}
                onChange={() => {}}
                readOnly
              />
            </div>
          )}
        </div>

        <div
          className="space-y-6 p-6"
          style={{ backgroundColor: theme.bodyBg }}
        >
          {fields.length === 0 ? (
            <p
              className="py-8 text-center text-sm"
              style={{
                color: theme.labelColor,
                opacity: 0.5,
                fontFamily: theme.bodyFontFamily,
              }}
            >
              No fields yet.
            </p>
          ) : (
            <>
              {fields.map((field) => (
                <FieldRenderer key={field.id} field={field} theme={theme} />
              ))}
              <button
                type="button"
                disabled
                className="h-12 w-full cursor-not-allowed text-base opacity-50"
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
              >
                SUBMIT RESPONSE (preview only)
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
