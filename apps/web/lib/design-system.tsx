import type { CSSProperties, ReactNode } from "react"

export const colors = {
  spiderRed: "#CC0000",
  marvelBlue: "#003366",
  comicYellow: "#FFD700",
  inkBlack: "#0a0a0a",
  panelWhite: "#fffff4",
  webGray: "#f5f5f0",
  mangaOrange: "#FF6B35",
  deepVoid: "#1a1a1a",
  starkCream: "#f5f0e8",
  starkGold: "#c8a45a",
} as const

export const fonts = {
  comic: {
    fontFamily: "var(--font-bangers)",
    letterSpacing: "0.05em",
  } as CSSProperties,
  body: {
    fontFamily: "var(--font-comic)",
    letterSpacing: "0.02em",
    lineHeight: 1.7,
  } as CSSProperties,
  sans: {
    fontFamily: "var(--font-sans)",
  } as CSSProperties,
}

export const shadows = {
  sm: "4px 4px 0 #0a0a0a",
  md: "6px 6px 0 #0a0a0a",
  lg: "8px 8px 0 #0a0a0a",
  xl: "12px 12px 0 #0a0a0a",
  white: "6px 6px 0 rgba(255,255,255,0.4)",
  red: "6px 6px 0 #6b0000",
} as const

export const borders = {
  comic: "4px solid #0a0a0a",
  comicSm: "3px solid #0a0a0a",
  comicLg: "5px solid #0a0a0a",
  white: "4px solid #ffffff",
} as const

export const patterns = {
  halftone: (color = "rgba(0,0,0,0.15)", size = "20px"): CSSProperties => ({
    backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
    backgroundSize: `${size} ${size}`,
  }),
  halftoneLight: (size = "20px"): CSSProperties => ({
    backgroundImage:
      "radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)",
    backgroundSize: `${size} ${size}`,
  }),
  crosshatch: (): CSSProperties => ({
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 0, transparent 50%), " +
      "repeating-linear-gradient(-45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 0, transparent 50%)",
    backgroundSize: "10px 10px",
  }),
  impactFrame: (): CSSProperties => ({
    background:
      "repeating-conic-gradient(rgba(0,0,0,0.06) 0deg 6deg, transparent 6deg 12deg)",
  }),
  blueprint: (color = "rgba(204,0,0,0.07)", size = "40px"): CSSProperties => ({
    backgroundImage: [
      `repeating-linear-gradient(45deg, ${color} 0, ${color} 0.5px, transparent 0, transparent 50%)`,
      `repeating-linear-gradient(-45deg, ${color} 0, ${color} 0.5px, transparent 0, transparent 50%)`,
    ].join(", "),
    backgroundSize: `${size} ${size}`,
  }),
  starkGrid: (color = "rgba(0,51,102,0.07)", size = "60px"): CSSProperties => ({
    backgroundImage: [
      `linear-gradient(${color} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    ].join(", "),
    backgroundSize: `${size} ${size}`,
  }),
} as const

export const burstPaths = {
  star10:
    "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
  star8:
    "polygon(50% 0%,63% 38%,100% 38%,72% 60%,82% 100%,50% 76%,18% 100%,28% 60%,0% 38%,37% 38%)",
  impact:
    "polygon(50% 0%,54% 42%,100% 28%,64% 52%,100% 72%,54% 58%,50% 100%,46% 58%,0% 72%,36% 52%,0% 28%,46% 42%)",
} as const

export const anim = {
  panelSlam: "animate-panel-slam",
  burstFloat: "animate-burst-float",
  webSway: "animate-web-sway",
  speechPop: "animate-speech-pop",
  stampDrop: "animate-stamp-drop",
  impactShake: "animate-impact-shake",
  inkReveal: "animate-ink-reveal",
  scrollReveal: "animate-scroll-reveal",
  scrollRevealD1: "animate-scroll-reveal-d1",
  scrollRevealD2: "animate-scroll-reveal-d2",
  pulse: "animate-comic-pulse",
  heroSlide: "animate-hero-slide",
  counterUp: "animate-count-up",
} as const

export function SpiderWeb({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <line
        x1="0"
        y1="0"
        x2="200"
        y2="0"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="200"
        y2="57"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="200"
        y2="120"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="120"
        y2="200"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="57"
        y2="200"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="200"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M 38,0 Q 19,19 0,38"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 76,0 Q 38,38 0,76"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 114,0 Q 57,57 0,114"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 152,0 Q 76,76 0,152"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 200,0 Q 100,100 0,200"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

export function SpeedLines({
  className,
  style,
  count = 40,
  cx = 50,
  cy = 50,
}: {
  className?: string
  style?: CSSProperties
  count?: number
  cx?: number
  cy?: number
}) {
  const lines = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI
    const r1 = 18
    const r2 = 100
    const x1 = cx + r1 * Math.cos(angle)
    const y1 = cy + r1 * Math.sin(angle)
    const x2 = cx + r2 * Math.cos(angle)
    const y2 = cy + r2 * Math.sin(angle)
    const thick = i % 4 === 0 ? 0.8 : 0.3
    return { x1, y1, x2, y2, thick }
  })

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="currentColor"
          strokeWidth={l.thick}
          opacity="0.6"
        />
      ))}
    </svg>
  )
}

export function ActionBurst({
  word,
  bg = colors.comicYellow,
  textColor = colors.inkBlack,
  size = "w-20 h-20",
  textSize = "text-base",
  path = burstPaths.star10,
  className = "",
}: {
  word: string
  bg?: string
  textColor?: string
  size?: string
  textSize?: string
  path?: string
  className?: string
}) {
  return (
    <div
      className={`${size} flex items-center justify-center ${className}`}
      style={{ backgroundColor: bg, clipPath: path }}
    >
      <span
        style={{ ...fonts.comic, color: textColor }}
        className={`${textSize} text-center leading-none font-bold`}
      >
        {word}
      </span>
    </div>
  )
}

export function SpeechBubble({
  children,
  tail = "bottom-left",
  tailColor = colors.inkBlack,
  className = "",
}: {
  children: ReactNode
  tail?: "left" | "right" | "bottom-left" | "bottom-right" | "none"
  tailColor?: string
  className?: string
}) {
  const tailMap: Record<string, CSSProperties> = {
    "bottom-left": {
      position: "absolute",
      bottom: -21,
      left: 28,
      width: 0,
      height: 0,
      borderLeft: "12px solid transparent",
      borderRight: "12px solid transparent",
      borderTop: `22px solid ${tailColor}`,
    },
    "bottom-right": {
      position: "absolute",
      bottom: -21,
      right: 28,
      width: 0,
      height: 0,
      borderLeft: "12px solid transparent",
      borderRight: "12px solid transparent",
      borderTop: `22px solid ${tailColor}`,
    },
    left: {
      position: "absolute",
      top: "40%",
      left: -21,
      width: 0,
      height: 0,
      borderTop: "12px solid transparent",
      borderBottom: "12px solid transparent",
      borderRight: `22px solid ${tailColor}`,
    },
    right: {
      position: "absolute",
      top: "40%",
      right: -21,
      width: 0,
      height: 0,
      borderTop: "12px solid transparent",
      borderBottom: "12px solid transparent",
      borderLeft: `22px solid ${tailColor}`,
    },
    none: {},
  }

  return (
    <div
      className={`relative border-4 border-black bg-white p-6 ${className}`}
      style={{ boxShadow: shadows.lg }}
    >
      {children}
      {tail !== "none" && <div style={tailMap[tail]} />}
    </div>
  )
}

export function ThoughtBubble({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="rounded-[40%] border-4 border-black bg-white p-5"
        style={{ boxShadow: shadows.md }}
      >
        {children}
      </div>
      <div className="absolute -bottom-3 left-8 h-3 w-3 rounded-full border-[3px] border-black bg-white" />
      <div className="absolute -bottom-6 left-4 h-2 w-2 rounded-full border-[3px] border-black bg-white" />
    </div>
  )
}

export function ComicPanel({
  children,
  rotate = "0deg",
  shadowSize = "lg",
  className = "",
  style,
}: {
  children: ReactNode
  rotate?: string
  shadowSize?: keyof typeof shadows
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`border-4 border-black bg-white ${className}`}
      style={{
        boxShadow: shadows[shadowSize],
        transform: rotate !== "0deg" ? `rotate(${rotate})` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SectionDivider({
  text = "MEANWHILE...",
  bg = colors.inkBlack,
}: {
  text?: string
  bg?: string
}) {
  return (
    <div
      className="relative flex items-center justify-center gap-4 overflow-hidden border-y-4 border-black py-4"
      style={{ backgroundColor: bg }}
    >
      <span className="text-4xl text-white/20 select-none">
        ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦
      </span>
      <span
        className="absolute z-10 border-[3px] border-[#FFD700] bg-[#0a0a0a] px-6 py-1 text-2xl text-[#FFD700]"
        style={fonts.comic}
      >
        {text}
      </span>
    </div>
  )
}

export function ComicIssueTag({
  issue = "#001",
  title = "THE AMAZING WEBFORM",
  price = "12¢",
  month = "MAY 2024",
}: {
  issue?: string
  title?: string
  price?: string
  month?: string
}) {
  return (
    <div
      className="flex items-center justify-center gap-3 border-b-4 border-black bg-[#CC0000] px-6 py-1 text-sm text-white/90"
      style={{
        ...fonts.comic,
        ...patterns.halftone("rgba(0,0,0,0.1)", "14px"),
      }}
    >
      <span>ISSUE {issue}</span>
      <span className="text-white/40">✦</span>
      <span>{title}</span>
      <span className="text-white/40">✦</span>
      <span>{price}</span>
      <span className="text-white/40">✦</span>
      <span>{month}</span>
    </div>
  )
}

export function StanLeeStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex h-24 w-24 flex-col items-center justify-center rounded-full border-[4px] border-[#CC0000] text-center ${anim.stampDrop} ${className}`}
      style={{
        boxShadow: "0 0 0 3px #CC0000, 0 0 0 6px #fff, 0 0 0 9px #CC0000",
        transform: "rotate(12deg)",
      }}
    >
      <span
        style={{
          ...fonts.comic,
          color: "#CC0000",
          fontSize: 9,
          letterSpacing: 2,
        }}
      >
        STAN LEE
      </span>
      <span
        style={{
          ...fonts.comic,
          color: "#CC0000",
          fontSize: 9,
          letterSpacing: 2,
        }}
      >
        APPROVED
      </span>
      <span
        style={{ ...fonts.comic, color: "#CC0000", fontSize: 8, opacity: 0.7 }}
      >
        ✦ EXCELSIOR ✦
      </span>
    </div>
  )
}

export function HalftoneSection({
  children,
  bg = colors.spiderRed,
  dotColor = "rgba(0,0,0,0.18)",
  dotSize = "20px",
  className = "",
  style,
}: {
  children: ReactNode
  bg?: string
  dotColor?: string
  dotSize?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <section
      className={className}
      style={{
        backgroundColor: bg,
        ...patterns.halftone(dotColor, dotSize),
        ...style,
      }}
    >
      {children}
    </section>
  )
}

export function BlueprintOverlay({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g stroke="currentColor" fill="none">
        <line x1="0" y1="120" x2="200" y2="0" strokeWidth="0.5" opacity="0.5" />
        <line x1="0" y1="300" x2="380" y2="0" strokeWidth="0.5" opacity="0.5" />
        <line
          x1="60"
          y1="500"
          x2="580"
          y2="0"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="260"
          y1="500"
          x2="800"
          y2="50"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="520"
          y1="500"
          x2="800"
          y2="290"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="196"
          y1="247"
          x2="204"
          y2="253"
          strokeWidth="1"
          opacity="0.55"
        />
        <line
          x1="204"
          y1="247"
          x2="196"
          y2="253"
          strokeWidth="1"
          opacity="0.55"
        />
        <circle cx="200" cy="250" r="5" strokeWidth="0.6" opacity="0.4" />
        <line
          x1="396"
          y1="148"
          x2="404"
          y2="154"
          strokeWidth="1"
          opacity="0.55"
        />
        <line
          x1="404"
          y1="148"
          x2="396"
          y2="154"
          strokeWidth="1"
          opacity="0.55"
        />
        <circle cx="400" cy="151" r="5" strokeWidth="0.6" opacity="0.4" />
        <rect
          x="28"
          y="56"
          width="54"
          height="14"
          strokeWidth="0.6"
          opacity="0.45"
        />
        <rect
          x="678"
          y="376"
          width="62"
          height="14"
          strokeWidth="0.6"
          opacity="0.45"
        />
        <rect
          x="338"
          y="16"
          width="46"
          height="14"
          strokeWidth="0.6"
          opacity="0.45"
        />
        <path
          d="M 0 380 L 60 380 L 90 350 L 220 350 L 250 380 L 380 380"
          strokeWidth="0.5"
          opacity="0.38"
        />
        <path
          d="M 430 120 L 480 120 L 510 90 L 620 90 L 650 120 L 800 120"
          strokeWidth="0.5"
          opacity="0.38"
        />
        <line
          x1="720"
          y1="60"
          x2="720"
          y2="440"
          strokeWidth="0.5"
          opacity="0.35"
        />
        <line
          x1="712"
          y1="60"
          x2="728"
          y2="60"
          strokeWidth="0.9"
          opacity="0.45"
        />
        <line
          x1="712"
          y1="440"
          x2="728"
          y2="440"
          strokeWidth="0.9"
          opacity="0.45"
        />
        <line
          x1="712"
          y1="250"
          x2="728"
          y2="250"
          strokeWidth="0.5"
          opacity="0.35"
        />
        <circle cx="90" cy="350" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="220" cy="350" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="510" cy="90" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="620" cy="90" r="2.5" fill="currentColor" opacity="0.4" />
      </g>
      <g fill="currentColor" fontFamily="monospace" opacity="0.4">
        <text x="31" y="67" fontSize="7">
          TYPE-03
        </text>
        <text x="342" y="27" fontSize="7">
          SEC.A-1
        </text>
        <text x="682" y="387" fontSize="7">
          REF 14.2
        </text>
        <text x="724" y="254" fontSize="7">
          →
        </text>
      </g>
    </svg>
  )
}

export function AnnotationCorner({
  className = "",
  style,
  label = "01",
  flip = false,
}: {
  className?: string
  style?: CSSProperties
  label?: string
  flip?: boolean
}) {
  return (
    <svg
      className={`h-14 w-14 ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M 52 4 L 4 4 L 4 52" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="4"
        y1="4"
        x2="18"
        y2="4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <line
        x1="4"
        y1="4"
        x2="4"
        y2="18"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <text
        x="8"
        y="28"
        fontSize="9"
        fontFamily="monospace"
        fill="currentColor"
        opacity="0.85"
      >
        {label}
      </text>
    </svg>
  )
}

export function CircuitLines({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 800 60"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g stroke="currentColor" fill="none" strokeWidth="1">
        <path
          d="M 0 30 L 60 30 L 80 12 L 200 12 L 220 30 L 380 30 L 400 48 L 500 48 L 520 30 L 680 30 L 700 12 L 800 12"
          opacity="0.5"
        />
        <path d="M 80 12 L 80 4" opacity="0.35" strokeDasharray="3 2" />
        <path d="M 400 48 L 400 56" opacity="0.35" strokeDasharray="3 2" />
        <path d="M 700 12 L 700 4" opacity="0.35" strokeDasharray="3 2" />
        <circle cx="80" cy="12" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="200" cy="12" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="220" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="380" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="400" cy="48" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="500" cy="48" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="520" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="680" cy="30" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="700" cy="12" r="3" fill="currentColor" opacity="0.5" />
      </g>
      <g fill="currentColor" fontFamily="monospace" opacity="0.4" fontSize="6">
        <text x="82" y="10">
          VCC
        </text>
        <text x="402" y="58">
          GND
        </text>
        <text x="702" y="10">
          OUT
        </text>
      </g>
    </svg>
  )
}

export function ComicButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "yellow"
  size?: "sm" | "md" | "lg"
  className?: string
  onClick?: () => void
}) {
  const variants = {
    primary: { bg: colors.spiderRed, text: "#fff", shadow: shadows.md },
    secondary: { bg: colors.marvelBlue, text: "#fff", shadow: shadows.md },
    ghost: { bg: "transparent", text: "#fff", shadow: "none" },
    yellow: {
      bg: colors.comicYellow,
      text: colors.inkBlack,
      shadow: shadows.md,
    },
  }
  const sizes = {
    sm: "px-4 py-2 text-lg",
    md: "px-6 py-3 text-2xl",
    lg: "px-10 py-5 text-3xl",
  }
  const v = variants[variant]

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer border-4 border-black transition-all duration-100 hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:scale-95 ${sizes[size]} ${className}`}
      style={{
        ...fonts.comic,
        backgroundColor: v.bg,
        color: v.text,
        boxShadow: v.shadow,
      }}
    >
      {children}
    </button>
  )
}
