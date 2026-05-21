import Image from "next/image"
import Link from "next/link"
import {
  GripVertical,
  Zap,
  Share2,
  Hammer,
  BarChart2,
  type LucideIcon,
} from "lucide-react"
import swingingImg from "@/assets/babe-spider-swinging.jpg"
import standingImg from "@/assets/spider-standing.jpg"
import updownImg from "@/assets/spiderman-updown.jpg"
import gwenImg from "@/assets/spider-man-gwen.jpg"
import {
  ActionBurst,
  anim,
  AnnotationCorner,
  BlueprintOverlay,
  CircuitLines,
  colors,
  ComicButton,
  ComicIssueTag,
  fonts,
  HalftoneSection,
  patterns,
  SectionDivider,
  shadows,
  SpeechBubble,
  SpeedLines,
  SpiderWeb,
  StanLeeStamp,
  ThoughtBubble,
} from "@/lib/design-system"

const CF = fonts.comic
const CB = fonts.body

function PanelNumber({ n }: { n: string }) {
  return (
    <span
      className="absolute top-2 left-3 text-xs text-black/25 select-none"
      style={CF}
    >
      {n}
    </span>
  )
}

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

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: colors.starkCream }}
    >
      <ComicIssueTag
        issue="#001"
        title="THE AMAZING WEBFORM"
        price="12¢"
        month="MAY 2024"
      />

      <nav
        className="sticky top-0 z-50 border-b-4 border-black"
        style={{
          backgroundColor: colors.starkCream,
          boxShadow: "0 4px 0 #0a0a0a",
        }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SpiderWeb className="h-6 w-6 text-[#CC0000]" />
            <span style={CF} className="text-2xl text-black">
              WEB<span className="text-[#CC0000]">FORM</span>
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "/pricing" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={CF}
                className="text-base text-black transition-colors hover:text-[#CC0000]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/login">
            <ComicButton variant="primary" size="sm">
              START FOR FREE
            </ComicButton>
          </Link>
        </div>
      </nav>

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
                  <ComicButton
                    variant="yellow"
                    size="md"
                    className={anim.pulse}
                  >
                    ASSEMBLE YOUR FORM
                  </ComicButton>
                </Link>
                <Link href="/pricing">
                  <ComicButton variant="ghost" size="md">
                    SEE PRICING
                  </ComicButton>
                </Link>
              </div>

              <div
                className="mt-6 flex items-center gap-2 opacity-35"
                style={CF}
              >
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

              <div
                className={`absolute -top-6 -right-6 z-30 ${anim.burstFloat}`}
              >
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

      <div
        className="border-y-4 border-black py-4"
        style={{ backgroundColor: colors.comicYellow }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap justify-around gap-3 px-5">
          {[
            { num: "10K+", label: "FORMS CREATED" },
            { num: "1M+", label: "RESPONSES COLLECTED" },
            { num: "99.9%", label: "UPTIME" },
            { num: "500+", label: "HAPPY HEROES" },
          ].map((s) => (
            <div key={s.label} className={`text-center ${anim.scrollReveal}`}>
              <div
                style={{ ...CF, textShadow: "3px 3px 0 rgba(0,0,0,0.12)" }}
                className="text-4xl text-black"
              >
                {s.num}
              </div>
              <div
                style={CF}
                className="text-[10px] tracking-widest text-black/60"
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider text="✦  MEANWHILE, SOMEWHERE IN CYBERSPACE...  ✦" />

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
                <div
                  style={{ ...CF, color: f.color }}
                  className="mb-2 text-2xl"
                >
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
              style={{
                boxShadow: "6px 6px 0 #000",
                transform: "rotate(-2deg)",
              }}
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

      <SectionDivider
        text="✦  LATER, AT WEBFORM HEADQUARTERS...  ✦"
        bg={colors.marvelBlue}
      />

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

      <SectionDivider text="✦  AND THE CROWD GOES WILD...  ✦" />

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
            {[
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
            ].map((t, i) => (
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

      <SectionDivider text="✦  THE FINAL CHAPTER...  ✦" bg={colors.spiderRed} />

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
            Join thousands of heroes already collecting better data with
            WebForm.
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

      <footer
        className="border-t-4 border-black py-8"
        style={{ backgroundColor: colors.deepVoid }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 md:flex-row">
          <div className="flex items-center gap-2">
            <SpiderWeb className="h-5 w-5 text-[#CC0000]" />
            <span style={CF} className="text-xl text-white">
              WEB<span className="text-[#CC0000]">FORM</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              style={CF}
              className="border-b border-white/20 pb-1 text-[10px] tracking-[0.3em] text-white/30"
            >
              TO BE CONTINUED...
            </span>
            <span style={CF} className="text-[10px] text-white/20">
              © 2024 WEBFORM • ALL RIGHTS RESERVED • EXCELSIOR!
            </span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                style={CF}
                className="text-sm text-white/40 transition-colors hover:text-[#CC0000]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div
          className="mt-6 border-t-2 border-white/10 pt-3 text-center"
          style={CF}
        >
          <span className="text-[9px] tracking-widest text-white/[0.12]">
            AMAZING WEBFORM VOL.1 ISSUE #001 • PRINTED IN THE DIGITAL UNIVERSE •
            MARVEL-INSPIRED
          </span>
        </div>
      </footer>
    </div>
  )
}
