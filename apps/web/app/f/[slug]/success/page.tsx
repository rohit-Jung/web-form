"use client"

import { use } from "react"
import Link from "next/link"
import {
  colors,
  fonts,
  shadows,
  SpiderWeb,
  ActionBurst,
  anim,
} from "@/lib/design-system"

const CF = fonts.comic
const CB = fonts.body

export default function SuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: colors.panelWhite }}
    >
      <SpiderWeb
        className={`absolute top-0 right-0 h-40 w-40 text-[#CC0000]/20 ${anim.webSway}`}
      />
      <SpiderWeb
        className={`absolute bottom-0 left-0 h-32 w-32 text-[#CC0000]/20 ${anim.webSway}`}
        style={{ transform: "rotate(180deg)", animationDelay: "2s" }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className={`mb-6 flex justify-center ${anim.burstFloat}`}>
          <ActionBurst word="SENT!" size="w-28 h-28" textSize="text-lg" />
        </div>

        <div
          className="border-4 border-black bg-white p-8"
          style={{ boxShadow: shadows.xl }}
        >
          <h1
            style={{ ...CF, textShadow: `4px 4px 0 ${colors.spiderRed}` }}
            className="mb-3 text-5xl text-black"
          >
            RESPONSE SENT!
          </h1>
          <p
            style={CB}
            className="mb-6 text-base leading-relaxed text-black/60"
          >
            Your response has been recorded. Thanks for taking the time to fill
            this out!
          </p>

          <div className="flex flex-col gap-3">
            <a href={`/f/${slug}`}>
              <button
                className="h-12 w-full border-4 border-black bg-[#003366] text-white transition-colors hover:bg-[#002244]"
                style={{ boxShadow: shadows.sm, ...CF, fontSize: "1rem" }}
              >
                SUBMIT ANOTHER RESPONSE
              </button>
            </a>
            <Link href="/">
              <button
                className="h-10 w-full border-2 border-black bg-transparent text-black transition-colors hover:bg-black/5"
                style={{ ...CF, fontSize: "0.85rem" }}
              >
                BACK TO HOME
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-center opacity-30">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black"
            style={{
              transform: "rotate(-12deg)",
              backgroundColor: colors.comicYellow,
            }}
          >
            <span
              style={{
                ...CF,
                fontSize: "10px",
                lineHeight: 1.1,
                textAlign: "center",
                display: "block",
              }}
              className="text-black"
            >
              EXCELSIOR!
            </span>
          </div>
        </div>

        <p style={CB} className="mt-4 text-xs text-black/20">
          Powered by{" "}
          <a href="/" className="transition-colors hover:text-[#CC0000]">
            WebForm
          </a>
        </p>
      </div>
    </div>
  )
}
