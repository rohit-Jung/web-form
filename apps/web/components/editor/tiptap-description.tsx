"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import { colors } from "@/lib/design-system"

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function TipTapDescription({
  value,
  onChange,
  placeholder = "Add a form description (optional)...",
  readOnly = false,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `outline-none text-sm leading-relaxed${readOnly ? "" : " min-h-[80px]"}`,
      },
    },
  })

  useEffect(() => {
    if (editor && !editor.isFocused && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false)
    }
  }, [value, editor])

  return (
    <div
      className={
        readOnly
          ? ""
          : "border-2 border-black bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-900"
      }
      onClick={() => !readOnly && editor?.commands.focus()}
    >
      <EditorContent editor={editor} className="dark:text-white" />
      {!readOnly && (
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: ${colors.inkBlack}40;
            pointer-events: none;
            height: 0;
          }
          .dark .ProseMirror p.is-editor-empty:first-child::before {
            color: rgba(240,240,236,0.3);
          }
          .dark .ProseMirror {
            color: #f0f0ec;
          }
        `}</style>
      )}
    </div>
  )
}
