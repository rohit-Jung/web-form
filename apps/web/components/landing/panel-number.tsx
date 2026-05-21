import { fonts } from "@/lib/design-system"

const CF = fonts.comic

export function PanelNumber({ n }: { n: string }) {
  return (
    <span
      className="absolute top-2 left-3 text-xs text-black/25 select-none"
      style={CF}
    >
      {n}
    </span>
  )
}
