import { Hammer, Share2, BarChart2, type LucideIcon } from "lucide-react"
import {
  anim,
  AnnotationCorner,
  CircuitLines,
  colors,
  fonts,
  patterns,
  ThoughtBubble,
} from "@/lib/design-system"
import { PanelNumber } from "./panel-number"

const CF = fonts.comic
const CB = fonts.body

const steps: {
  num: string
  title: string
  desc: string
  bg: string
  Icon: LucideIcon
  panelN: string
}[] = [
  {
    num: "01",
    title: "CREATE",
    Icon: Hammer,
    bg: colors.spiderRed,
    panelN: "p.4",
    desc: "Choose a template or start blank. Drag fields like you're spinning a web.",
  },
  {
    num: "02",
    title: "SHARE",
    Icon: Share2,
    bg: colors.marvelBlue,
    panelN: "p.5",
    desc: "Send the link. Embed it. QR it. Your form, everywhere it needs to be.",
  },
  {
    num: "03",
    title: "COLLECT",
    Icon: BarChart2,
    bg: colors.deepVoid,
    panelN: "p.6",
    desc: "Watch responses pour in. Export. Analyze. You're the hero now.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-14"
      style={{
        backgroundColor: colors.starkCream,
        ...patterns.blueprint("rgba(0,51,102,0.07)"),
      }}
    >
      <CircuitLines
        className="pointer-events-none absolute top-0 left-0 w-full text-[#003366]"
        style={{ opacity: 0.28, height: "50px" }}
      />

      <div className="mx-auto max-w-6xl px-5">
        <div className={`mb-10 text-center ${anim.scrollReveal}`}>
          <h2
            style={{
              ...CF,
              color: colors.marvelBlue,
              textShadow: `4px 4px 0 ${colors.spiderRed}`,
            }}
            className="text-5xl"
          >
            THE ORIGIN STORY
          </h2>
          <p style={CB} className="mt-2 text-sm text-black/50">
            Three panels. Three steps. One superpower.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 overflow-hidden border-4 border-black md:grid-cols-3 ${anim.scrollReveal}`}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-6"
              style={{
                backgroundColor: step.bg,
                ...patterns.halftoneLight("16px"),
                borderRight: i < 2 ? "4px solid #000" : undefined,
              }}
            >
              <PanelNumber n={step.panelN} />
              <AnnotationCorner
                label={`S-0${i + 1}`}
                flip
                className="absolute right-2 bottom-2 h-8 w-8 text-white/20"
                style={{ transform: "rotate(180deg)" }}
              />
              <div
                style={CF}
                className="mb-2 text-6xl leading-none text-white/20"
              >
                {step.num}
              </div>
              <step.Icon size={36} className="mb-3 text-white/80" />
              <div style={CF} className="mb-2 text-3xl text-white">
                {step.title}
              </div>
              <p style={CB} className="text-sm leading-relaxed text-white/75">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-8 flex justify-center ${anim.scrollReveal}`}>
          <ThoughtBubble className="max-w-xs text-center">
            <p
              style={CB}
              className="text-sm leading-relaxed text-gray-700 italic"
            >
              &ldquo;Wait... is building forms really this easy?&rdquo;
            </p>
            <p
              style={{ ...CF, color: colors.spiderRed }}
              className="mt-2 text-xs"
            >
              — EVERY NEW USER, PROBABLY
            </p>
          </ThoughtBubble>
        </div>
      </div>
    </section>
  )
}
