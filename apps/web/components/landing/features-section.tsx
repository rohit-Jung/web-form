import Image from "next/image"
import { GripVertical, Zap, Share2, type LucideIcon } from "lucide-react"
import standingImg from "@/assets/spider-standing.jpg"
import {
  ActionBurst,
  anim,
  AnnotationCorner,
  BlueprintOverlay,
  CircuitLines,
  colors,
  fonts,
  patterns,
  shadows,
  StanLeeStamp,
} from "@/lib/design-system"
import { PanelNumber } from "./panel-number"

const CF = fonts.comic
const CB = fonts.body

const features: {
  burst: string
  Icon: LucideIcon
  title: string
  desc: string
  color: string
  rotate: string
  panelN: string
  delay: string
  label: string
}[] = [
  {
    burst: "POW!",
    Icon: GripVertical,
    title: "DRAG & DROP BUILDER",
    desc: "Build forms faster than a webslinger. Drag fields, drop logic, done. No code — ever.",
    color: colors.spiderRed,
    rotate: "-2deg",
    panelN: "p.1",
    delay: "0s",
    label: "F-01",
  },
  {
    burst: "ZAP!",
    Icon: Zap,
    title: "REAL-TIME RESPONSES",
    desc: "Watch responses land live. No refresh. No waiting. Data at the speed of light.",
    color: colors.marvelBlue,
    rotate: "1.5deg",
    panelN: "p.2",
    delay: "0.1s",
    label: "F-02",
  },
  {
    burst: "THWIP!",
    Icon: Share2,
    title: "SHARE ANYWHERE",
    desc: "Shoot your form across every corner of the web. Link, embed, QR — your call.",
    color: colors.spiderRed,
    rotate: "-1deg",
    panelN: "p.3",
    delay: "0.2s",
    label: "F-03",
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-14"
      style={{ backgroundColor: colors.starkCream }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={patterns.blueprint()}
      />
      <BlueprintOverlay
        className="pointer-events-none absolute inset-0 h-full w-full text-[#003366]"
        style={{ opacity: 0.18 }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className={`mb-10 text-center ${anim.scrollReveal}`}>
          <h2
            style={{ ...CF, textShadow: `4px 4px 0 ${colors.spiderRed}` }}
            className="text-5xl text-black"
          >
            YOUR SUPERPOWERS
          </h2>
          <p style={CB} className="mt-2 text-sm text-black/50">
            Every hero needs the right tools. Here are yours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className={`relative border-4 border-black bg-white p-5 ${anim.scrollReveal}`}
              style={{
                boxShadow: shadows.lg,
                transform: `rotate(${f.rotate})`,
                animationDelay: f.delay,
              }}
            >
              <PanelNumber n={f.panelN} />
              <AnnotationCorner
                label={f.label}
                flip
                className="absolute right-2 bottom-2 h-8 w-8 text-black/20"
                style={{ transform: "rotate(180deg)" }}
              />
              <div
                className={`absolute -top-5 -right-4 ${anim.burstFloat}`}
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <ActionBurst
                  word={f.burst}
                  size="w-14 h-14"
                  textSize="text-[10px]"
                />
              </div>
              <f.Icon size={36} className="mb-3" style={{ color: f.color }} />
              <div style={{ ...CF, color: f.color }} className="mb-2 text-2xl">
                {f.title}
              </div>
              <p style={CB} className="text-sm leading-relaxed text-gray-700">
                {f.desc}
              </p>
              <div
                className="mt-4 h-[3px] w-12"
                style={{ backgroundColor: f.color }}
              />
            </div>
          ))}
        </div>

        <div className={`mt-8 flex justify-end ${anim.scrollReveal}`}>
          <StanLeeStamp />
        </div>

        <div className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 xl:block">
          <div
            className="overflow-hidden border-4 border-black"
            style={{ boxShadow: "6px 6px 0 #000", transform: "rotate(-2deg)" }}
          >
            <div className="relative h-[180px] w-[130px]">
              <Image
                src={standingImg}
                alt="Spider-Man standing"
                fill
                className="object-cover object-top"
                sizes="130px"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                style={patterns.halftone("rgba(0,0,0,1)", "5px")}
              />
            </div>
            <div className="border-t-2 border-black bg-[#CC0000] px-2 py-0.5">
              <span
                style={CF}
                className="text-[8px] tracking-widest text-white"
              >
                POWER UP!
              </span>
            </div>
          </div>
          <div
            className={`absolute -top-4 -left-5 ${anim.burstFloat}`}
            style={{ animationDelay: "0.8s" }}
          >
            <ActionBurst
              word="POW!"
              bg={colors.marvelBlue}
              textColor="#fff"
              size="w-14 h-14"
              textSize="text-[9px]"
            />
          </div>
        </div>
      </div>

      <CircuitLines
        className="pointer-events-none absolute bottom-0 left-0 w-full text-[#CC0000]"
        style={{ opacity: 0.22, height: "50px" }}
      />
    </section>
  )
}
