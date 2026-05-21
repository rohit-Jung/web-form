import Link from "next/link"
import { ComicButton, colors, fonts, SpiderWeb } from "@/lib/design-system"

const CF = fonts.comic

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
]

export function LandingNav() {
  return (
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
          {navLinks.map((item) => (
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
  )
}
