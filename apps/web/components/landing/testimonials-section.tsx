import Image from "next/image"
import updownImg from "@/assets/spiderman-updown.jpg"
import {
  ActionBurst,
  anim,
  colors,
  fonts,
  patterns,
  SpeechBubble,
} from "@/lib/design-system"
import { PanelNumber } from "./panel-number"

const CF = fonts.comic
const CB = fonts.body

const testimonials = [
  {
    quote:
      "I went from zero forms to hero forms in under 5 minutes. WebForm is my secret weapon.",
    name: "PETER P.",
    role: "Freelance Photographer, Queens NY",
    color: colors.spiderRed,
    panelN: "p.7",
    animDelay: "0s",
  },
  {
    quote:
      "Finally a form builder that doesn't feel like a villain designed the UX. Clean, fast, powerful.",
    name: "TONY S.",
    role: "Startup Founder, Malibu CA",
    color: colors.marvelBlue,
    panelN: "p.8",
    animDelay: "0.15s",
  },
  {
    quote:
      "We collect 10,000 responses a month. WebForm handles it without breaking a sweat.",
    name: "NATASHA R.",
    role: "Marketing Lead, S.H.I.E.L.D.",
    color: colors.deepVoid,
    panelN: "p.9",
    animDelay: "0.3s",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-14">
      <div
        className="pointer-events-none absolute inset-0"
        style={patterns.starkGrid("rgba(0,0,0,0.035)")}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className={`mb-10 text-center ${anim.scrollReveal}`}>
          <h2
            style={{ ...CF, textShadow: `4px 4px 0 ${colors.comicYellow}` }}
            className="text-5xl text-black"
          >
            WHAT THE HEROES SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative ${anim.scrollReveal}`}
              style={{ animationDelay: t.animDelay }}
            >
              <div className="relative">
                <PanelNumber n={t.panelN} />
                <SpeechBubble tail="bottom-left" tailColor={t.color}>
                  <p
                    style={CB}
                    className="mb-2 text-sm leading-relaxed text-gray-800 italic"
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </SpeechBubble>
              </div>
              <div className="mt-7 ml-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-black text-base text-white"
                  style={{ ...CF, backgroundColor: t.color }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div style={CF} className="text-base">
                    {t.name}
                  </div>
                  <div style={CB} className="text-xs text-gray-400">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 xl:block">
          <div
            className="overflow-hidden border-4 border-black"
            style={{ boxShadow: "6px 6px 0 #000", transform: "rotate(2deg)" }}
          >
            <div className="relative h-[160px] w-[130px]">
              <Image
                src={updownImg}
                alt="Spider-Man upside down"
                fill
                className="object-cover object-center"
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
                AMAZING!
              </span>
            </div>
          </div>
          <div
            className={`absolute -top-4 -left-5 ${anim.burstFloat}`}
            style={{ animationDelay: "2s" }}
          >
            <ActionBurst
              word="NANI?!"
              bg={colors.mangaOrange}
              size="w-14 h-14"
              textSize="text-[9px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
