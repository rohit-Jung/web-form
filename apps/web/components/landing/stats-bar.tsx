import { anim, colors, fonts } from "@/lib/design-system"

const CF = fonts.comic

const stats = [
  { num: "10K+", label: "FORMS CREATED" },
  { num: "1M+", label: "RESPONSES COLLECTED" },
  { num: "99.9%", label: "UPTIME" },
  { num: "500+", label: "HAPPY HEROES" },
]

export function StatsBar() {
  return (
    <div
      className="border-y-4 border-black py-4"
      style={{ backgroundColor: colors.comicYellow }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-around gap-3 px-5">
        {stats.map((s) => (
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
  )
}
