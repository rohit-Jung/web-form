import Image from "next/image"
import Link from "next/link"
import gwenImg from "@/assets/spider-man-gwen.jpg"
import {
  ActionBurst,
  anim,
  CircuitLines,
  colors,
  ComicButton,
  fonts,
  HalftoneSection,
  patterns,
  SpeedLines,
  SpiderWeb,
} from "@/lib/design-system"

const CF = fonts.comic
const CB = fonts.body

export function CTASection() {
  return (
    <HalftoneSection
      bg={colors.spiderRed}
      className="relative overflow-hidden py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={patterns.impactFrame()}
      />
      <SpiderWeb
        className={`absolute top-0 left-0 h-52 w-52 text-white ${anim.webSway}`}
        style={{ animationDelay: "2s" }}
      />
      <SpiderWeb
        className={`absolute right-0 bottom-0 h-72 w-72 rotate-180 text-white ${anim.webSway}`}
      />

      <CircuitLines
        className="pointer-events-none absolute top-6 left-0 w-full text-white"
        style={{ opacity: 0.13, height: "50px" }}
      />

      <div
        className="absolute bottom-0 left-0 hidden h-full overflow-hidden xl:block"
        style={{ width: 320 }}
      >
        <div className="relative h-full w-full">
          <Image
            src={gwenImg}
            alt="Gwen Stacy"
            fill
            className="object-cover"
            sizes="320px"
            style={{ objectPosition: "15% center" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
            style={patterns.halftone("rgba(0,0,0,1)", "8px")}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #CC0000 0%, transparent 5%, transparent 50%, #CC0000 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #CC0000 0%, transparent 25%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #CC0000 0%, transparent 15%)",
            }}
          />
        </div>
      </div>

      <div
        className="absolute right-0 bottom-0 hidden h-full overflow-hidden xl:block"
        style={{ width: 320 }}
      >
        <div className="relative h-full w-full">
          <Image
            src={gwenImg}
            alt="Spider-Man"
            fill
            className="object-cover"
            sizes="320px"
            style={{ objectPosition: "65% center" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
            style={patterns.halftone("rgba(0,0,0,1)", "6px")}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, #CC0000 0%, transparent 25%, transparent 50%, #CC0000 90%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #CC0000 0%, transparent 25%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #CC0000 0%, transparent 15%)",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <SpeedLines
          className="pointer-events-none absolute inset-0 h-full w-full text-white"
          count={32}
          cx={50}
          cy={50}
        />

        <div
          style={CF}
          className={`relative z-10 mb-3 text-lg tracking-widest text-white/65 ${anim.scrollReveal}`}
        >
          — STAN LEE WOULD&apos;VE USED THIS —
        </div>

        <h2
          className={`relative z-10 mb-5 ${anim.scrollReveal}`}
          style={{
            ...CF,
            animationDelay: "0.15s",
            fontSize: "clamp(2rem, 5.5vw, 4.2rem)",
            lineHeight: 1.05,
            color: "#fff",
            textShadow: "4px 4px 0 #000",
          }}
        >
          WITH GREAT FORMS
          <br />
          <span style={{ color: colors.comicYellow }}>COMES GREAT DATA.</span>
        </h2>

        <p
          style={{ ...CB, animationDelay: "0.3s" }}
          className={`relative z-10 mx-auto mb-8 max-w-md text-base leading-relaxed text-white/80 ${anim.scrollReveal}`}
        >
          Join thousands of heroes already collecting better data with WebForm.
        </p>

        <div
          className={`relative z-10 ${anim.scrollReveal}`}
          style={{ animationDelay: "0.45s" }}
        >
          <Link href="/login">
            <ComicButton variant="yellow" size="lg" className={anim.pulse}>
              START YOUR ORIGIN STORY →
            </ComicButton>
          </Link>
        </div>

        <div
          className={`absolute top-6 right-12 hidden lg:block ${anim.burstFloat}`}
        >
          <ActionBurst word="KAPOW!" size="w-20 h-20" textSize="text-sm" />
        </div>
        <div
          className={`absolute bottom-8 left-12 hidden lg:block ${anim.burstFloat}`}
          style={{ animationDelay: "1.1s" }}
        >
          <ActionBurst word="WHAM!" size="w-16 h-16" textSize="text-xs" />
        </div>
      </div>
    </HalftoneSection>
  )
}
