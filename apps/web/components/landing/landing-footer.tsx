import { colors, fonts, SpiderWeb } from "@/lib/design-system"

const CF = fonts.comic

const footerLinks = ["Privacy", "Terms", "Contact"]

export function LandingFooter() {
  return (
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
          {footerLinks.map((link) => (
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
  )
}
