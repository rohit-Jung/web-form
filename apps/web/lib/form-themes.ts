import type { CSSProperties } from "react"

export type FormThemeId =
  | "minimal"
  | "formal"
  | "spider-man"
  | "iron-man"
  | "avengers"
  | "midnight"
  | "ocean"

export interface FormThemeConfig {
  id: FormThemeId
  name: string
  description: string
  pageBg: string
  pagePattern?: CSSProperties
  containerBorder: string
  containerShadow: string
  containerRadius: string
  headerBg: string
  headerText: string
  headerPattern?: CSSProperties
  bodyBg: string
  labelColor: string
  inputBg: string
  inputBorder: string
  inputFocusBorder: string
  inputText: string
  inputRadius: string
  primaryBg: string
  primaryText: string
  primaryHover: string
  primaryShadow: string
  accentColor: string
  errorColor: string
  headingFontFamily: string
  bodyFontFamily: string
  headingLetterSpacing: string
  swatchColors: [string, string, string]
}

const halftone = (
  color = "rgba(0,0,0,0.15)",
  size = "20px"
): CSSProperties => ({
  backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
  backgroundSize: `${size} ${size}`,
})

const techGrid = (color = "rgba(255,215,0,0.08)"): CSSProperties => ({
  backgroundImage: `
    linear-gradient(${color} 1px, transparent 1px),
    linear-gradient(90deg, ${color} 1px, transparent 1px)
  `,
  backgroundSize: "24px 24px",
})

const crosshatch = (color = "rgba(0,0,0,0.04)"): CSSProperties => ({
  backgroundImage: `
    repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%),
    repeating-linear-gradient(-45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%)
  `,
  backgroundSize: "10px 10px",
})

export const THEMES: Record<FormThemeId, FormThemeConfig> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean and distraction-free",
    pageBg: "#f9fafb",
    containerBorder: "1px solid #e5e7eb",
    containerShadow: "0 1px 3px rgba(0,0,0,0.1)",
    containerRadius: "8px",
    headerBg: "#ffffff",
    headerText: "#111827",
    bodyBg: "#ffffff",
    labelColor: "#374151",
    inputBg: "#ffffff",
    inputBorder: "#d1d5db",
    inputFocusBorder: "#6b7280",
    inputText: "#111827",
    inputRadius: "6px",
    primaryBg: "#111827",
    primaryText: "#ffffff",
    primaryHover: "#374151",
    primaryShadow: "none",
    accentColor: "#6b7280",
    errorColor: "#dc2626",
    headingFontFamily: "var(--font-sans)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "normal",
    swatchColors: ["#f9fafb", "#111827", "#6b7280"],
  },

  formal: {
    id: "formal",
    name: "Formal",
    description: "Professional and business-ready",
    pageBg: "#f0f4f8",
    pagePattern: crosshatch("rgba(0,0,51,0.03)"),
    containerBorder: "2px solid #1e3a5f",
    containerShadow: "0 4px 12px rgba(0,0,0,0.12)",
    containerRadius: "0px",
    headerBg: "#1e3a5f",
    headerText: "#ffffff",
    bodyBg: "#ffffff",
    labelColor: "#1e3a5f",
    inputBg: "#ffffff",
    inputBorder: "#9fb3c8",
    inputFocusBorder: "#1e3a5f",
    inputText: "#1a202c",
    inputRadius: "0px",
    primaryBg: "#1e3a5f",
    primaryText: "#ffffff",
    primaryHover: "#152d4a",
    primaryShadow: "none",
    accentColor: "#c8a951",
    errorColor: "#c53030",
    headingFontFamily: "var(--font-sans)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "0.05em",
    swatchColors: ["#1e3a5f", "#c8a951", "#f0f4f8"],
  },

  "spider-man": {
    id: "spider-man",
    name: "Spider-Man",
    description: "Your friendly neighbourhood form",
    pageBg: "#fffff4",
    pagePattern: halftone("rgba(0,0,0,0.06)", "20px"),
    containerBorder: "4px solid #0a0a0a",
    containerShadow: "8px 8px 0 #0a0a0a",
    containerRadius: "0px",
    headerBg: "#CC0000",
    headerText: "#ffffff",
    headerPattern: halftone("rgba(0,0,0,0.15)", "14px"),
    bodyBg: "#ffffff",
    labelColor: "#0a0a0a",
    inputBg: "#ffffff",
    inputBorder: "#0a0a0a",
    inputFocusBorder: "#003366",
    inputText: "#0a0a0a",
    inputRadius: "0px",
    primaryBg: "#CC0000",
    primaryText: "#ffffff",
    primaryHover: "#aa0000",
    primaryShadow: "4px 4px 0 #0a0a0a",
    accentColor: "#003366",
    errorColor: "#CC0000",
    headingFontFamily: "var(--font-bangers)",
    bodyFontFamily: "var(--font-comic)",
    headingLetterSpacing: "0.05em",
    swatchColors: ["#CC0000", "#003366", "#FFD700"],
  },

  "iron-man": {
    id: "iron-man",
    name: "Iron Man",
    description: "Genius, billionaire, form builder",
    pageBg: "#1a1a1a",
    pagePattern: techGrid("rgba(255,193,7,0.06)"),
    containerBorder: "2px solid #FFD700",
    containerShadow: "0 0 20px rgba(255,193,7,0.15), 4px 4px 0 #000",
    containerRadius: "4px",
    headerBg: "#CC0000",
    headerText: "#FFD700",
    headerPattern: techGrid("rgba(255,215,0,0.1)"),
    bodyBg: "#242424",
    labelColor: "#FFD700",
    inputBg: "#1a1a1a",
    inputBorder: "#444",
    inputFocusBorder: "#FFD700",
    inputText: "#f5f5f5",
    inputRadius: "2px",
    primaryBg: "#FFD700",
    primaryText: "#1a1a1a",
    primaryHover: "#e6c200",
    primaryShadow: "0 0 12px rgba(255,193,7,0.4)",
    accentColor: "#CC0000",
    errorColor: "#ff4444",
    headingFontFamily: "var(--font-bangers)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "0.08em",
    swatchColors: ["#1a1a1a", "#FFD700", "#CC0000"],
  },

  avengers: {
    id: "avengers",
    name: "Avengers",
    description: "Assemble your responses",
    pageBg: "#0d1117",
    pagePattern: {
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(0,51,102,0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(204,0,0,0.2) 0%, transparent 50%)
      `,
    },
    containerBorder: "3px solid #1e40af",
    containerShadow: "0 0 30px rgba(30,64,175,0.3), 6px 6px 0 #000",
    containerRadius: "2px",
    headerBg: "#0f172a",
    headerText: "#e2e8f0",
    headerPattern: {
      backgroundImage: `
        linear-gradient(rgba(30,64,175,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30,64,175,0.15) 1px, transparent 1px)
      `,
      backgroundSize: "30px 30px",
    },
    bodyBg: "#161b27",
    labelColor: "#94a3b8",
    inputBg: "#0f172a",
    inputBorder: "#334155",
    inputFocusBorder: "#3b82f6",
    inputText: "#e2e8f0",
    inputRadius: "2px",
    primaryBg: "#1d4ed8",
    primaryText: "#ffffff",
    primaryHover: "#1e40af",
    primaryShadow: "0 0 16px rgba(29,78,216,0.5)",
    accentColor: "#fbbf24",
    errorColor: "#ef4444",
    headingFontFamily: "var(--font-bangers)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "0.1em",
    swatchColors: ["#0d1117", "#1d4ed8", "#fbbf24"],
  },

  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Dark, sleek, mysterious",
    pageBg: "#09090b",
    containerBorder: "1px solid #27272a",
    containerShadow: "0 4px 24px rgba(0,0,0,0.6)",
    containerRadius: "12px",
    headerBg: "#18181b",
    headerText: "#fafafa",
    bodyBg: "#18181b",
    labelColor: "#a1a1aa",
    inputBg: "#09090b",
    inputBorder: "#3f3f46",
    inputFocusBorder: "#a78bfa",
    inputText: "#fafafa",
    inputRadius: "8px",
    primaryBg: "#7c3aed",
    primaryText: "#ffffff",
    primaryHover: "#6d28d9",
    primaryShadow: "0 0 20px rgba(124,58,237,0.4)",
    accentColor: "#a78bfa",
    errorColor: "#f87171",
    headingFontFamily: "var(--font-sans)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "normal",
    swatchColors: ["#09090b", "#7c3aed", "#a78bfa"],
  },

  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Calm and refreshing",
    pageBg: "#ecfeff",
    containerBorder: "2px solid #0891b2",
    containerShadow: "0 4px 16px rgba(8,145,178,0.15)",
    containerRadius: "12px",
    headerBg: "#0891b2",
    headerText: "#ffffff",
    bodyBg: "#ffffff",
    labelColor: "#164e63",
    inputBg: "#f0fdfe",
    inputBorder: "#a5f3fc",
    inputFocusBorder: "#0891b2",
    inputText: "#164e63",
    inputRadius: "8px",
    primaryBg: "#0891b2",
    primaryText: "#ffffff",
    primaryHover: "#0e7490",
    primaryShadow: "0 2px 8px rgba(8,145,178,0.3)",
    accentColor: "#06b6d4",
    errorColor: "#dc2626",
    headingFontFamily: "var(--font-sans)",
    bodyFontFamily: "var(--font-sans)",
    headingLetterSpacing: "normal",
    swatchColors: ["#0891b2", "#ecfeff", "#06b6d4"],
  },
}

export const THEME_LIST = Object.values(THEMES)

export function getTheme(id: string | null | undefined): FormThemeConfig {
  return THEMES[(id as FormThemeId) ?? "minimal"] ?? THEMES.minimal
}

export function resolveTheme(
  themeId: string | null | undefined,
  primaryColor: string | null | undefined,
  accentColor: string | null | undefined
): FormThemeConfig {
  const base = getTheme(themeId)
  return {
    ...base,
    primaryBg: primaryColor ?? base.primaryBg,
    accentColor: accentColor ?? base.accentColor,
    inputFocusBorder: primaryColor ?? base.inputFocusBorder,
  }
}
