import Image from "next/image"
import Link from "next/link"
import {
  Check,
  X,
  Minus,
  Zap,
  Lock,
  Sprout,
  Trophy,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import swingingImg from "@/assets/babe-spider-swinging.jpg"
import chillImg from "@/assets/spider-man-chill.jpg"
import updownImg from "@/assets/spiderman-updown.jpg"
import {
  colors,
  fonts,
  shadows,
  patterns,
  anim,
  SpiderWeb,
  SpeedLines,
  ActionBurst,
  SectionDivider,
  ComicButton,
  ComicIssueTag,
  HalftoneSection,
  ThoughtBubble,
  SpeechBubble,
  StanLeeStamp,
} from "@/lib/design-system"

const CF = fonts.comic
const CB = fonts.body

const plans = [
  {
    name: "SIDEKICK",
    price: "FREE",
    period: "",
    tagline: "For heroes just starting out",
    color: colors.deepVoid,
    highlight: false,
    burst: "GRATIS!",
    burstBg: colors.mangaOrange,
    features: [
      "Up to 3 forms",
      "100 responses / month",
      "Basic field types",
      "Public & unlisted forms",
      "Webform branding",
    ],
    cta: "START FREE",
    ctaVariant: "secondary" as const,
    panelN: "p.1",
  },
  {
    name: "HERO",
    price: "$12",
    period: "/ mo",
    tagline: "For freelancers and small teams",
    color: colors.spiderRed,
    highlight: true,
    burst: "POPULAR!",
    burstBg: colors.comicYellow,
    features: [
      "Unlimited forms",
      "5,000 responses / month",
      "All field types",
      "Custom slug URLs",
      "Remove branding",
      "Email notifications",
      "Response analytics + CSV",
    ],
    cta: "GO HERO →",
    ctaVariant: "yellow" as const,
    panelN: "p.2",
  },
  {
    name: "AVENGER",
    price: "$49",
    period: "/ mo",
    tagline: "For power users and agencies",
    color: colors.marvelBlue,
    highlight: false,
    burst: "MAX POWER!",
    burstBg: colors.spiderRed,
    features: [
      "Unlimited forms",
      "Unlimited responses",
      "All field types",
      "Custom slug URLs",
      "Remove branding",
      "Email notifications",
      "Response analytics + CSV",
      "Team workspaces + API access",
    ],
    cta: "ASSEMBLE →",
    ctaVariant: "primary" as const,
    panelN: "p.3",
  },
]

const comparisonRows: {
  feature: string
  sidekick: boolean | string | null
  hero: boolean | string | null
  avenger: boolean | string | null
}[] = [
  { feature: "Forms", sidekick: "3", hero: "Unlimited", avenger: "Unlimited" },
  {
    feature: "Responses / month",
    sidekick: "100",
    hero: "5,000",
    avenger: "Unlimited",
  },
  { feature: "Basic field types", sidekick: true, hero: true, avenger: true },
  { feature: "Advanced fields", sidekick: false, hero: true, avenger: true },
  { feature: "Custom slug URLs", sidekick: false, hero: true, avenger: true },
  { feature: "Remove branding", sidekick: false, hero: true, avenger: true },
  {
    feature: "Email notifications",
    sidekick: false,
    hero: true,
    avenger: true,
  },
  { feature: "Analytics + CSV", sidekick: false, hero: true, avenger: true },
  { feature: "Live form mode", sidekick: false, hero: true, avenger: true },
  { feature: "API access", sidekick: false, hero: false, avenger: true },
  { feature: "Team workspaces", sidekick: false, hero: false, avenger: true },
  { feature: "Conditional logic", sidekick: false, hero: false, avenger: true },
  { feature: "Priority support", sidekick: false, hero: false, avenger: true },
  { feature: "Password-protect", sidekick: false, hero: false, avenger: true },
]

const personas: {
  plan: string
  persona: string
  Icon: LucideIcon
  bg: string
  panelN: string
  desc: string
  quote: string
}[] = [
  {
    plan: "SIDEKICK",
    persona: "THE BEGINNER",
    Icon: Sprout,
    bg: colors.deepVoid,
    panelN: "p.4",
    desc: "Just getting started? You want a contact form, a survey, or collect RSVPs. Free forever. No card.",
    quote: '"I just need a form. Nothing crazy."',
  },
  {
    plan: "HERO",
    persona: "THE FREELANCER",
    Icon: Zap,
    bg: colors.spiderRed,
    panelN: "p.5",
    desc: "Running a business solo or with a small team. You need real analytics, custom links, and email notifications.",
    quote: '"I need it to look professional."',
  },
  {
    plan: "AVENGER",
    persona: "THE AGENCY",
    Icon: Trophy,
    bg: colors.marvelBlue,
    panelN: "p.6",
    desc: "Managing multiple clients, massive response volume, API access and team accounts to keep the operation running.",
    quote: '"I need the whole arsenal."',
  },
]

const faqs = [
  {
    q: "Can I change plans anytime?",
    a: "Yes — upgrade or downgrade whenever. Changes take effect immediately. Downgrading is prorated to the day.",
  },
  {
    q: "What happens if I exceed my response limit?",
    a: "We'll notify you at 80% and 100%. Your form stays live but stops accepting new responses until you upgrade or the month resets.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "HERO plan has a 14-day free trial. No credit card required. Cancel any time during the trial — no questions asked.",
  },
  {
    q: "Do you support team accounts?",
    a: "Team workspaces are available on the AVENGER plan. Each member gets their own login and you share a response quota.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit cards via Stripe. Annual billing available at 20% off — email us for invoiced billing on AVENGER.",
  },
]

function ComparisonCell({ val }: { val: boolean | string | null }) {
  if (val === null) return <Minus size={14} className="mx-auto text-black/20" />
  if (val === true)
    return (
      <Check size={14} className="mx-auto text-[#CC0000]" strokeWidth={3} />
    )
  if (val === false)
    return <X size={14} className="mx-auto text-black/20" strokeWidth={3} />
  return (
    <span style={CF} className="text-xs text-black/80">
      {val}
    </span>
  )
}

export default function PricingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: colors.panelWhite }}
    >
      <ComicIssueTag
        issue="#002"
        title="THE AMAZING WEBFORM — PRICING"
        price="FREE TO READ"
        month="MAY 2024"
      />

      <nav
        className="sticky top-0 z-50 border-b-4 border-black bg-white"
        style={{ boxShadow: "0 4px 0 #0a0a0a" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <SpiderWeb className="h-6 w-6 text-[#CC0000]" />
            <span style={CF} className="text-2xl text-black">
              WEB<span className="text-[#CC0000]">FORM</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {[
              { label: "Features", href: "/#features" },
              { label: "How It Works", href: "/#how-it-works" },
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

      <section
        className="relative flex min-h-[60vh] items-center overflow-hidden py-14"
        style={{
          backgroundColor: colors.marvelBlue,
          ...patterns.halftone("rgba(255,255,255,0.07)", "18px"),
        }}
      >
        <SpeedLines
          className="pointer-events-none absolute inset-0 h-full w-full text-white"
          count={48}
          cx={30}
          cy={50}
        />
        <SpiderWeb
          className={`absolute top-0 left-0 h-52 w-52 text-white/10 ${anim.webSway}`}
        />
        <SpiderWeb
          className={`absolute right-4 bottom-0 h-44 w-44 rotate-180 text-white/10 ${anim.webSway}`}
          style={{ animationDelay: "3s" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <div
                className={`mb-5 inline-flex items-center gap-1.5 border-[3px] border-black bg-[#FFD700] px-3 py-1 ${anim.heroSlide}`}
                style={{ boxShadow: shadows.sm, transform: "rotate(-2deg)" }}
              >
                <Zap size={14} className="text-black" />
                <span style={CF} className="text-base text-black">
                  TRANSPARENT PRICING. NO TRICKS.
                </span>
              </div>

              <h1
                className={`mb-5 ${anim.heroSlide}`}
                style={{
                  ...CF,
                  animationDelay: "0.12s",
                  fontSize: "clamp(2.2rem, 6vw, 5rem)",
                  lineHeight: 0.95,
                  color: "#fff",
                  textShadow: "4px 4px 0 #000, -1px -1px 0 #000",
                  WebkitTextStroke: "1px black",
                }}
              >
                PICK YOUR
                <br />
                <span
                  style={{
                    color: colors.comicYellow,
                    textShadow: "4px 4px 0 #000",
                  }}
                >
                  POWER LEVEL
                </span>
              </h1>

              <p
                className={`mb-8 max-w-md border-l-4 border-[#FFD700] pl-4 text-base leading-relaxed text-white/70 ${anim.heroSlide}`}
                style={{
                  ...CB,
                  animationDelay: "0.28s",
                  textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
                }}
              >
                No villainous hidden fees. No annual lock-in. Upgrade or
                downgrade anytime — cancel with a single webshot.
              </p>

              <div
                className={`flex flex-wrap gap-3 ${anim.heroSlide}`}
                style={{ animationDelay: "0.44s" }}
              >
                <a href="#plans">
                  <ComicButton
                    variant="yellow"
                    size="md"
                    className={anim.pulse}
                  >
                    SEE PLANS →
                  </ComicButton>
                </a>
                <Link href="/login">
                  <ComicButton variant="ghost" size="md">
                    START FREE
                  </ComicButton>
                </Link>
              </div>

              <div
                className={`mt-8 inline-flex items-center gap-2 border-2 border-white/30 px-4 py-2 ${anim.heroSlide}`}
                style={{ animationDelay: "0.6s" }}
              >
                <Lock size={14} className="text-white/70" />
                <span
                  style={CF}
                  className="text-sm tracking-wider text-white/70"
                >
                  14-DAY MONEY-BACK GUARANTEE
                </span>
              </div>
            </div>

            <div className="relative hidden items-end justify-center lg:flex">
              <div
                className="relative overflow-visible border-4 border-black"
                style={{ boxShadow: "8px 8px 0 #000" }}
              >
                <div
                  className="absolute -top-[18px] left-1/2 z-20 -translate-x-1/2 border-[2px] border-black bg-[#FFD700] px-4 py-0.5 whitespace-nowrap"
                  style={CF}
                >
                  <span className="text-xs tracking-widest text-black">
                    AMAZING WEBFORM #002
                  </span>
                </div>

                <div className="relative h-[380px] w-[280px] overflow-hidden">
                  <Image
                    src={swingingImg}
                    alt="Spider-Man swinging"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="280px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
                    style={patterns.halftone("rgba(0,0,0,1)", "6px")}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,51,0.6) 100%)",
                    }}
                  />
                  <div
                    className="absolute right-0 bottom-0 left-0 border-t-4 border-black p-3 text-center"
                    style={{ backgroundColor: colors.spiderRed }}
                  >
                    <span
                      style={CF}
                      className="text-base tracking-widest text-white"
                    >
                      FROM FREE · NO CREDIT CARD
                    </span>
                  </div>
                </div>

                <div className="absolute right-3 -bottom-[14px] z-20">
                  <span
                    className="border-[2px] border-black bg-[#003366] px-3 py-0.5 text-[9px] tracking-[0.2em] text-white uppercase"
                    style={CF}
                  >
                    ISSUE #002
                  </span>
                </div>
              </div>

              <div
                className={`absolute -top-6 -right-5 z-30 ${anim.burstFloat}`}
              >
                <ActionBurst
                  word="WOW!"
                  size="w-16 h-16"
                  textSize="text-[10px]"
                />
              </div>
              <div
                className={`absolute bottom-14 -left-8 z-30 ${anim.burstFloat}`}
                style={{ animationDelay: "1.2s" }}
              >
                <ActionBurst
                  word="FREE!"
                  bg={colors.mangaOrange}
                  size="w-14 h-14"
                  textSize="text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute right-0 bottom-3 left-0 flex justify-center"
          style={CF}
        >
          <span className="text-[10px] tracking-widest text-white/20">
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
            { num: "500+", label: "HEROES ENROLLED" },
            { num: "99.9%", label: "UPTIME SLA" },
            { num: "14d", label: "FREE TRIAL" },
            { num: "∞", label: "FORMS ON HERO+" },
          ].map((s) => (
            <div key={s.label} className={`text-center ${anim.scrollReveal}`}>
              <div
                style={{ ...CF, textShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}
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

      <SectionDivider text="✦  CHOOSE YOUR ORIGIN STORY  ✦" />

      <section
        id="plans"
        className="relative py-16"
        style={{ backgroundColor: colors.panelWhite }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={patterns.crosshatch()}
        />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className={`mb-12 text-center ${anim.scrollReveal}`}>
            <h2
              style={{ ...CF, textShadow: `4px 4px 0 ${colors.marvelBlue}` }}
              className="mb-2 text-5xl text-black"
            >
              THREE TIERS. ONE MISSION.
            </h2>
            <p style={CB} className="text-sm text-black/50">
              All plans include 99.9% uptime SLA.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative flex flex-col border-4 border-black bg-white ${anim.scrollReveal}`}
                style={{
                  boxShadow: plan.highlight ? shadows.xl : shadows.md,
                  transform: plan.highlight ? "translateY(-10px)" : undefined,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-[18px] left-1/2 z-10 -translate-x-1/2 border-4 border-black px-5 py-0.5 whitespace-nowrap"
                    style={{
                      backgroundColor: colors.comicYellow,
                      boxShadow: shadows.sm,
                    }}
                  >
                    <span
                      style={CF}
                      className="text-sm tracking-widest text-black"
                    >
                      ★ MOST POPULAR ★
                    </span>
                  </div>
                )}

                <div
                  className="relative border-b-4 border-black p-5"
                  style={{
                    backgroundColor: plan.color,
                    ...patterns.halftoneLight("14px"),
                  }}
                >
                  <div
                    className={`absolute -top-4 -right-4 ${anim.burstFloat}`}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <ActionBurst
                      word={plan.burst}
                      bg={plan.burstBg}
                      size="w-16 h-16"
                      textSize="text-[9px]"
                    />
                  </div>
                  <span
                    className="absolute top-2 left-3 text-[10px] text-white/25 select-none"
                    style={CF}
                  >
                    {plan.panelN}
                  </span>
                  <span style={CF} className="mb-1 block text-xl text-white">
                    {plan.name}
                  </span>
                  <div className="mb-1 flex items-end gap-1">
                    <span
                      style={{
                        ...CF,
                        fontSize: "3rem",
                        lineHeight: 1,
                        color: "#fff",
                        textShadow: "3px 3px 0 rgba(0,0,0,0.3)",
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={CB} className="mb-1.5 text-sm text-white/60">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p style={CB} className="text-xs text-white/60">
                    {plan.tagline}
                  </p>
                </div>

                <div className="flex-1 space-y-3 p-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 text-xs font-bold text-[#CC0000]">
                        ✦
                      </span>
                      <span style={CB} className="text-sm text-black/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t-4 border-black" />

                <div className="p-5">
                  <Link href="/login" className="block">
                    <ComicButton
                      variant={plan.ctaVariant}
                      size="md"
                      className="w-full justify-center"
                    >
                      {plan.cta}
                    </ComicButton>
                  </Link>
                  {plan.name === "SIDEKICK" && (
                    <p
                      style={CB}
                      className="mt-2 text-center text-[11px] text-black/40"
                    >
                      No credit card required
                    </p>
                  )}
                  {plan.name === "HERO" && (
                    <p
                      style={CB}
                      className="mt-2 text-center text-[11px] text-black/40"
                    >
                      14-day free trial included
                    </p>
                  )}
                  {plan.name === "AVENGER" && (
                    <p
                      style={CB}
                      className="mt-2 text-center text-[11px] text-black/40"
                    >
                      Annual billing saves 20%
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-10 flex justify-end ${anim.scrollReveal}`}>
            <StanLeeStamp />
          </div>
        </div>
      </section>

      <SectionDivider
        text="✦  THE FULL POWERS BREAKDOWN  ✦"
        bg={colors.marvelBlue}
      />

      <section className="relative overflow-hidden bg-white py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={patterns.crosshatch()}
        />

        <div className="relative mx-auto max-w-4xl px-5">
          <div className={`mb-10 text-center ${anim.scrollReveal}`}>
            <h2
              style={{ ...CF, textShadow: `4px 4px 0 ${colors.spiderRed}` }}
              className="text-5xl text-black"
            >
              FEATURE SHOWDOWN
            </h2>
            <p style={CB} className="mt-2 text-sm text-black/50">
              Every power, every tier — side by side.
            </p>
          </div>

          <div
            className={`overflow-hidden border-4 border-black ${anim.scrollReveal}`}
            style={{ boxShadow: shadows.lg }}
          >
            <div className="grid grid-cols-4 border-b-4 border-black">
              <div
                className="border-r-4 border-black p-4"
                style={{ backgroundColor: colors.panelWhite }}
              >
                <span style={CF} className="text-sm text-black/50">
                  FEATURE
                </span>
              </div>
              {[
                { label: "SIDEKICK", color: colors.deepVoid },
                { label: "HERO", color: colors.spiderRed },
                { label: "AVENGER", color: colors.marvelBlue },
              ].map((plan, i) => (
                <div
                  key={plan.label}
                  className={`p-4 text-center ${i < 2 ? "border-r-4 border-black" : ""}`}
                  style={{
                    backgroundColor: plan.color,
                    ...patterns.halftoneLight("12px"),
                  }}
                >
                  <span style={CF} className="text-base text-white">
                    {plan.label}
                  </span>
                  {plan.label === "HERO" && (
                    <div>
                      <span
                        style={CF}
                        className="block text-[10px] text-[#FFD700]"
                      >
                        ★ POPULAR
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b-2 border-black/10 ${i % 2 === 0 ? "bg-white" : "bg-[#fffff4]"}`}
              >
                <div className="border-r-4 border-black p-3 px-4">
                  <span style={CB} className="text-sm text-black/75">
                    {row.feature}
                  </span>
                </div>
                {[row.sidekick, row.hero, row.avenger].map((val, ci) => (
                  <div
                    key={ci}
                    className={`flex items-center justify-center p-3 ${ci < 2 ? "border-r-4 border-black" : ""}`}
                  >
                    <ComparisonCell val={val} />
                  </div>
                ))}
              </div>
            ))}

            <div className="grid grid-cols-4 border-t-4 border-black">
              <div
                className="border-r-4 border-black p-4"
                style={{ backgroundColor: colors.panelWhite }}
              />
              {[
                { label: "START FREE", variant: "secondary" as const },
                { label: "GO HERO →", variant: "yellow" as const },
                { label: "ASSEMBLE →", variant: "primary" as const },
              ].map((cta, i) => (
                <div
                  key={cta.label}
                  className={`flex justify-center p-4 ${i < 2 ? "border-r-4 border-black" : ""}`}
                >
                  <Link href="/login">
                    <ComicButton variant={cta.variant} size="sm">
                      {cta.label}
                    </ComicButton>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider text="✦  CHOOSE YOUR ALTER EGO  ✦" />

      <section
        className="relative overflow-hidden py-14"
        style={{
          backgroundColor: colors.panelWhite,
          ...patterns.halftone("rgba(0,0,0,0.05)", "20px"),
        }}
      >
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
              FIND YOUR HERO
            </h2>
            <p style={CB} className="mt-2 text-sm text-black/50">
              Which plan matches your powers?
            </p>
          </div>

          <div
            className={`grid grid-cols-1 overflow-hidden border-4 border-black md:grid-cols-3 ${anim.scrollReveal}`}
          >
            {personas.map((item, i) => (
              <div
                key={i}
                className="relative p-6"
                style={{
                  backgroundColor: item.bg,
                  ...patterns.halftoneLight("16px"),
                  borderRight: i < 2 ? "4px solid #000" : undefined,
                }}
              >
                <span
                  className="absolute top-2 left-3 text-[10px] text-white/25 select-none"
                  style={CF}
                >
                  {item.panelN}
                </span>
                <item.Icon size={36} className="mb-3 text-white/80" />
                <div
                  style={CF}
                  className="mb-1 text-sm tracking-widest text-white/60"
                >
                  {item.plan}
                </div>
                <div style={CF} className="mb-3 text-3xl text-white">
                  {item.persona}
                </div>
                <p
                  style={CB}
                  className="mb-4 text-sm leading-relaxed text-white/70"
                >
                  {item.desc}
                </p>
                <div className="border-l-4 border-white/30 pl-3">
                  <p
                    style={{ ...CF, color: colors.comicYellow }}
                    className="text-sm"
                  >
                    {item.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-12 flex flex-col items-center gap-8 lg:flex-row ${anim.scrollReveal}`}
          >
            <div className="relative hidden lg:block">
              <div
                className="overflow-hidden border-4 border-black"
                style={{ boxShadow: shadows.md, transform: "rotate(-2deg)" }}
              >
                <div className="relative h-[300px] w-[460px]">
                  <Image
                    src={chillImg}
                    alt="Spider-Man chilling"
                    fill
                    className="object-cover object-top"
                    sizes="360px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                    style={patterns.halftone("rgba(0,0,0,1)", "5px")}
                  />
                </div>
                <div className="border-t-2 border-black bg-[#003366] px-2 py-0.5">
                  <span
                    style={CF}
                    className="text-[8px] tracking-widest text-white"
                  >
                    VIBIN&apos;
                  </span>
                </div>
              </div>
              <div
                className={`absolute -top-4 -right-6 ${anim.burstFloat}`}
                style={{ animationDelay: "1.8s" }}
              >
                <ActionBurst
                  word="CHILL!"
                  bg={colors.mangaOrange}
                  size="w-14 h-14"
                  textSize="text-[9px]"
                />
              </div>
            </div>

            <ThoughtBubble className="max-w-lg">
              <p
                style={CB}
                className="text-sm leading-relaxed text-gray-700 italic"
              >
                &ldquo;Wait... they actually have a{" "}
                <strong>free plan with no credit card</strong>, unlimited forms
                on paid, AND a 14-day trial? This is the most un-villain pricing
                page I&apos;ve ever seen.&rdquo;
              </p>
              <p
                style={{ ...CF, color: colors.spiderRed }}
                className="mt-3 text-xs"
              >
                — EVERY DEVELOPER WHO READS THIS PAGE, PROBABLY
              </p>
            </ThoughtBubble>
          </div>
        </div>
      </section>

      <SectionDivider
        text="✦  YOUR QUESTIONS ANSWERED  ✦"
        bg={colors.spiderRed}
      />

      <section
        className="relative overflow-hidden py-14"
        style={{ backgroundColor: colors.panelWhite }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={patterns.crosshatch()}
        />

        <div className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 xl:block">
          <div
            className="overflow-hidden border-4 border-black"
            style={{ boxShadow: "6px 6px 0 #000", transform: "rotate(2deg)" }}
          >
            <div className="relative h-[160px] w-[120px]">
              <Image
                src={updownImg}
                alt="Spider-Man upside down"
                fill
                className="object-cover object-center"
                sizes="120px"
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
            style={{ animationDelay: "2.2s" }}
          >
            <ActionBurst
              word="HMPH!"
              bg={colors.marvelBlue}
              size="w-14 h-14"
              textSize="text-[9px]"
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-5">
          <div className={`mb-10 text-center ${anim.scrollReveal}`}>
            <h2
              style={{ ...CF, textShadow: `4px 4px 0 ${colors.comicYellow}` }}
              className="text-5xl text-black"
            >
              VILLAINOUS DOUBTS?
            </h2>
            <p style={CB} className="mt-2 text-sm text-black/50">
              We defeat them with facts.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details
                key={i}
                className={`group border-4 border-black bg-white ${anim.scrollReveal}`}
                style={{
                  boxShadow: shadows.sm,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between px-5 py-4 select-none"
                  style={{ backgroundColor: "transparent" }}
                >
                  <span style={CF} className="pr-4 text-base text-black">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-[#CC0000] transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div
                  className="border-t-2 border-black/10 px-5 py-4"
                  style={{ backgroundColor: colors.panelWhite }}
                >
                  <p
                    style={CB}
                    className="text-sm leading-relaxed text-black/60"
                  >
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className={`mt-10 flex justify-center ${anim.scrollReveal}`}>
            <div
              className="max-w-sm border-4 border-black p-5 text-center"
              style={{
                boxShadow: shadows.md,
                backgroundColor: colors.comicYellow,
              }}
            >
              <span style={CF} className="mb-1 block text-base text-black">
                STILL HAVE QUESTIONS?
              </span>
              <p style={CB} className="mb-3 text-xs text-black/60">
                Our support heroes respond within 24 hours.
              </p>
              <a href="mailto:hello@webform.app">
                <ComicButton variant="primary" size="sm">
                  EMAIL SUPPORT →
                </ComicButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      <HalftoneSection
        bg={colors.spiderRed}
        className="relative overflow-hidden border-t-4 border-black py-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={patterns.impactFrame()}
        />
        <SpiderWeb
          className={`absolute top-0 right-0 h-52 w-52 text-white ${anim.webSway}`}
        />
        <SpiderWeb
          className={`absolute bottom-0 left-0 h-44 w-44 rotate-180 text-white ${anim.webSway}`}
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <SpeedLines
            className="pointer-events-none absolute inset-0 h-full w-full text-white"
            count={32}
            cx={50}
            cy={50}
          />

          <div
            style={CF}
            className={`relative z-10 mb-3 text-lg tracking-widest text-white/60 ${anim.scrollReveal}`}
          >
            — YOUR ORIGIN STORY STARTS NOW —
          </div>

          <h2
            className={`relative z-10 mb-5 ${anim.scrollReveal}`}
            style={{
              ...CF,
              animationDelay: "0.15s",
              fontSize: "clamp(2rem, 5.5vw, 4rem)",
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
            className={`relative z-10 mx-auto mb-8 max-w-md text-base leading-relaxed text-white/75 ${anim.scrollReveal}`}
          >
            Free plan forever. HERO trial 14 days. Cancel anytime. No credit
            card needed to start.
          </p>

          <div
            className={`relative z-10 flex flex-wrap justify-center gap-4 ${anim.scrollReveal}`}
            style={{ animationDelay: "0.45s" }}
          >
            <Link href="/login">
              <ComicButton variant="yellow" size="lg" className={anim.pulse}>
                START FREE →
              </ComicButton>
            </Link>
            <Link href="/login">
              <ComicButton variant="ghost" size="lg">
                TRY HERO FREE
              </ComicButton>
            </Link>
          </div>

          <div
            className={`absolute top-6 right-10 hidden lg:block ${anim.burstFloat}`}
          >
            <ActionBurst word="KAPOW!" size="w-20 h-20" textSize="text-sm" />
          </div>
          <div
            className={`absolute bottom-8 left-10 hidden lg:block ${anim.burstFloat}`}
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
          <Link href="/" className="flex items-center gap-2">
            <SpiderWeb className="h-5 w-5 text-[#CC0000]" />
            <span style={CF} className="text-xl text-white">
              WEB<span className="text-[#CC0000]">FORM</span>
            </span>
          </Link>
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
            AMAZING WEBFORM VOL.1 ISSUE #002 · PRICING EDITION · PRINTED IN THE
            DIGITAL UNIVERSE
          </span>
        </div>
      </footer>
    </div>
  )
}
