"use client"

import { useState, useEffect } from "react"
import { Plus, X, Trash2 } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { fonts, shadows } from "@/lib/design-system"
import { useUpdateField, useDeleteField } from "@/hooks/forms/use-fields"
import type {
  FieldOutput,
  FieldType,
} from "@workspace/services/field/schemas/output"

const CF = fonts.comic

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Short Text",
  textarea: "Long Text",
  email: "Email",
  number: "Number",
  date: "Date",
  select: "Dropdown (single)",
  multiselect: "Multi Select",
  radio: "Radio",
  checkbox: "Checkbox",
  file: "File Upload",
}

const CHOICE_TYPES: FieldType[] = ["select", "multiselect", "radio", "checkbox"]

interface FieldDraft {
  label: string
  type: FieldType
  required: boolean
  placeholder: string
  helpText: string
  options: string[]
}

function draftKey(fieldId: string) {
  return `field-draft-${fieldId}`
}

function loadDraft(fieldId: string, field: FieldOutput): FieldDraft {
  try {
    const raw = localStorage.getItem(draftKey(fieldId))
    if (raw) return JSON.parse(raw) as FieldDraft
  } catch {}
  return {
    label: field.label,
    type: field.type,
    required: field.required,
    placeholder: field.placeholder ?? "",
    helpText: field.helpText ?? "",
    options: field.options ?? [],
  }
}

interface Props {
  field: FieldOutput
  formId: string
  onDelete: () => void
}

export function FieldConfigPanel({ field, formId, onDelete }: Props) {
  const updateField = useUpdateField()
  const deleteField = useDeleteField(formId)

  const initial = loadDraft(field.id, field)

  const [label, setLabel] = useState(initial.label)
  const [type, setType] = useState<FieldType>(initial.type)
  const [required, setRequired] = useState(initial.required)
  const [placeholder, setPlaceholder] = useState(initial.placeholder)
  const [helpText, setHelpText] = useState(initial.helpText)
  const [options, setOptions] = useState<string[]>(initial.options)
  const [newOption, setNewOption] = useState("")

  // Reset local state when switching to a different field
  useEffect(() => {
    const draft = loadDraft(field.id, field)
    setLabel(draft.label)
    setType(draft.type)
    setRequired(draft.required)
    setPlaceholder(draft.placeholder)
    setHelpText(draft.helpText)
    setOptions(draft.options)
    setNewOption("")
  }, [field.id])

  // Persist draft to localStorage on every change
  useEffect(() => {
    const draft: FieldDraft = { label, type, required, placeholder, helpText, options }
    localStorage.setItem(draftKey(field.id), JSON.stringify(draft))
  }, [field.id, label, type, required, placeholder, helpText, options])

  const isDirty =
    label !== field.label ||
    type !== field.type ||
    required !== field.required ||
    placeholder !== (field.placeholder ?? "") ||
    helpText !== (field.helpText ?? "") ||
    JSON.stringify(options) !== JSON.stringify(field.options ?? [])

  const save = () => {
    updateField.mutate(
      {
        id: field.id,
        label: label.trim() || field.label,
        type,
        required,
        placeholder: placeholder || null,
        helpText: helpText || null,
        options: CHOICE_TYPES.includes(type) ? options.filter(Boolean) : null,
      },
      {
        onSuccess: () => localStorage.removeItem(draftKey(field.id)),
      }
    )
  }

  const handleAddOption = () => {
    const trimmed = newOption.trim()
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed])
      setNewOption("")
    }
  }

  const handleDeleteField = () => {
    if (confirm(`Delete "${field.label}"? This cannot be undone.`)) {
      localStorage.removeItem(draftKey(field.id))
      deleteField.mutate({ id: field.id })
      onDelete()
    }
  }

  const inputCls =
    "border-2 border-black dark:border-white/20 rounded-none focus-visible:ring-0 focus-visible:border-[#CC0000] dark:bg-zinc-900 dark:text-white dark:placeholder:text-white/30 text-sm"
  const labelCls =
    "text-xs text-black/60 dark:text-white/50 uppercase tracking-wider"

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b-4 border-black bg-[#f5f5f0] px-4 py-3 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span style={CF} className="text-base text-black dark:text-white">
            FIELD SETTINGS
          </span>
          {isDirty && (
            <span className="text-[10px] text-black/40 dark:text-white/30" style={CF}>
              unsaved
            </span>
          )}
        </div>
        <button
          onClick={handleDeleteField}
          className="p-1 text-black/40 transition-colors hover:text-[#CC0000] dark:text-white/30 dark:hover:text-[#CC0000]"
          title="Delete field"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4">
        <div className="space-y-1.5">
          <Label style={CF} className={labelCls}>
            Label
          </Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <Label style={CF} className={labelCls}>
            Field Type
          </Label>
          <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
            <SelectTrigger className="h-9 rounded-none border-2 border-black text-sm focus:ring-0 dark:border-white/20 dark:bg-zinc-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-black dark:border-white/20 dark:bg-zinc-900">
              {(Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]).map(
                ([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="text-sm dark:text-white dark:focus:bg-white/10"
                  >
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <Label style={CF} className={labelCls}>
            Required
          </Label>
          <Switch checked={required} onCheckedChange={setRequired} />
        </div>

        <div className="space-y-1.5">
          <Label style={CF} className={labelCls}>
            Placeholder
          </Label>
          <Input
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            className={inputCls}
            placeholder="e.g. Enter your answer"
          />
        </div>

        <div className="space-y-1.5">
          <Label style={CF} className={labelCls}>
            Help Text
          </Label>
          <Textarea
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            className={`${inputCls} min-h-[60px] resize-none`}
            placeholder="Optional helper text below the field"
          />
        </div>

        {CHOICE_TYPES.includes(type) && (
          <div className="space-y-2">
            <Label style={CF} className={labelCls}>
              Options
            </Label>
            <div className="space-y-1.5">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options]
                      next[i] = e.target.value
                      setOptions(next)
                    }}
                    className={`${inputCls} h-8 flex-1`}
                  />
                  <button
                    onClick={() =>
                      setOptions(options.filter((_, j) => j !== i))
                    }
                    className="text-black/40 transition-colors hover:text-[#CC0000] dark:text-white/30 dark:hover:text-[#CC0000]"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className={`${inputCls} h-8 flex-1 focus-visible:border-[#003366]`}
                  placeholder="Add option..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                />
                <button
                  onClick={handleAddOption}
                  className="text-[#003366] transition-colors hover:text-[#001f4d] dark:text-[#5b9bd5] dark:hover:text-white"
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t-4 border-black p-3 dark:border-white/10">
        <Button
          onClick={save}
          disabled={updateField.isPending || !isDirty}
          className="h-9 w-full rounded-none border-2 border-black bg-[#CC0000] text-white hover:bg-[#aa0000] disabled:opacity-40"
          style={{ boxShadow: shadows.sm }}
        >
          <span style={CF} className="text-sm">
            {updateField.isPending ? "SAVING..." : "SAVE FIELD"}
          </span>
        </Button>
      </div>
    </div>
  )
}
