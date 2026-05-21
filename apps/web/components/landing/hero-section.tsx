import Image from "next/image"
import Link from "next/link"
import { Zap } from "lucide-react"
import swingingImg from "@/assets/babe-spider-swinging.jpg"
import {
  ActionBurst,
  anim,
  AnnotationCorner,
  colors,
  ComicButton,
  fonts,
  patterns,
  shadows,
  SpeedLines,
  SpiderWeb,
} from "@/lib/design-system"
import { PanelNumber } from "./panel-number"

const CF = fonts.comic
const CB = fonts.body

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: colors.spiderRed,
          ...patterns.halftone("rgba(0,0,0,0.16)", "18px"),
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[46%]"
        style={{
          backgroundColor: colors.marvelBlue,
          clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)",
          ...patterns.halftoneLight("18px"),
        }}
      />
      <SpeedLines
        className="absolute inset-0 h-full w-full text-black opacity-[0.05]"
        count={55}
        cx={36}
        cy={50}
      />
      <SpiderWeb
        className={`absolute top-0 left-0 h-52 w-52 text-white ${anim.webSway}`}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          <div>
            <div
              className={`mb-5 inline-flex items-center gap-1.5 border-[3px] border-black bg-[#FFD700] px-3 py-1 ${anim.heroSlide}`}
              style={{ boxShadow: shadows.sm, transform: "rotate(-2deg)" }}
            >
              <Zap size={14} className="text-black" />
              <span style={CF} className="text-lg text-black">
                THE AMAZING FORM BUILDER
              </span>
            </div>

            <h1
              className={`mb-5 ${anim.heroSlide}`}
              style={{
                ...CF,
                animationDelay: "0.15s",
                fontSize: "clamp(2.2rem, 5.5vw, 4.8rem)",
                lineHeight: 0.98,
                color: "#fff",
                textShadow: "4px 4px 0 #000, -1px -1px 0 #000",
                WebkitTextStroke: "1.5px black",
              }}
            >
              YOUR FORMS
              <br />
              <span
                style={{
                  color: colors.comicYellow,
                  textShadow: "4px 4px 0 #000",
                }}
              >
                JUST GOT
                <br />
                SUPERPOWERS!
              </span>
            </h1>

            <p
              className={`mb-8 max-w-md border-l-4 border-[#FFD700] pl-4 text-base leading-relaxed text-white ${anim.heroSlide}`}
              style={{
                ...CB,
                animationDelay: "0.3s",
                textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
              }}
            >
              Build powerful forms that capture data at the speed of a
              webslinger. No code. No villains. Just results.
            </p>

            <div
              className={`flex flex-wrap gap-3 ${anim.heroSlide}`}
              style={{ animationDelay: "0.5s" }}
            >
              <Link href="/login">
                <ComicButton variant="yellow" size="md" className={anim.pulse}>
                  ASSEMBLE YOUR FORM
                </ComicButton>
              </Link>
              <Link href="/pricing">
                <ComicButton variant="ghost" size="md">
                  SEE PRICING
                </ComicButton>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 opacity-35" style={CF}>
              <span className="text-[10px] tracking-widest text-white">
                READ THIS WAY
              </span>
              <span className="text-[10px] text-white">→</span>
            </div>
          </div>

          <div className="relative hidden items-end justify-center lg:flex">
            <SpiderWeb
              className={`absolute top-0 right-0 h-52 w-52 text-white ${anim.webSway}`}
            />
            <SpiderWeb
              className={`absolute bottom-0 left-0 h-44 w-44 text-white ${anim.webSway}`}
              style={{ transform: "rotate(180deg)", animationDelay: "3s" }}
            />

            <div
              className="relative z-10 overflow-visible border-4 border-black"
              style={{ boxShadow: "8px 8px 0 #000" }}
            >
              <div
                className="absolute -top-[18px] left-1/2 z-20 -translate-x-1/2 border-[2px] border-black bg-[#FFD700] px-4 py-0.5 whitespace-nowrap"
                style={CF}
              >
                <span className="text-xs tracking-widest text-black">
                  THE DAILY BUGLE
                </span>
              </div>

              <AnnotationCorner
                label="T-03"
                className="absolute -top-1 -left-1 z-20 h-10 w-10 text-[#FFD700]"
                style={{ opacity: 0.6 }}
              />
              <AnnotationCorner
                label="T-03"
                flip
                className="absolute -top-1 -right-1 z-20 h-10 w-10 text-[#FFD700]"
                style={{ opacity: 0.6 }}
              />

              <PanelNumber n="p.0" />

              <div className="relative h-[480px] w-[360px] overflow-hidden">
                <Image
                  src={swingingImg}
                  alt="Spider-Man swinging"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="360px"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
                  style={patterns.halftone("rgba(0,0,0,1)", "6px")}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
                  }}
                />
              </div>

              <div className="absolute right-0 -bottom-[14px] left-0 z-20 flex justify-center">
                <span
                  className="border-[2px] border-black bg-[#CC0000] px-3 py-0.5 text-[9px] tracking-[0.2em] text-white uppercase"
                  style={CF}
                >
                  AMAZING FANTASY #15 INSPIRED
                </span>
              </div>
            </div>

            <div className={`absolute -top-6 -right-6 z-30 ${anim.burstFloat}`}>
              <ActionBurst
                word="THWIP!"
                size="w-16 h-16"
                textSize="text-[10px]"
              />
            </div>
            <div
              className={`absolute top-8 -left-8 z-30 ${anim.burstFloat}`}
              style={{ animationDelay: "1.4s" }}
            >
              <ActionBurst word="ZAP!" size="w-14 h-14" textSize="text-xs" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 bottom-3 left-0 flex justify-center"
        style={CF}
      >
        <span className="text-[10px] tracking-widest text-white/25">
          CONTINUED ON PAGE 2 →
        </span>
      </div>
    </section>
  )
}
