"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTRPC } from "@/providers"
import { colors, fonts, shadows } from "@/lib/design-system"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Globe, ExternalLink } from "lucide-react"

const CF = fonts.comic
const CB = fonts.body

export default function ExplorePage() {
  const trpc = useTRPC()
  const { data: forms = [], isLoading } = useQuery(
    trpc.form.getPublic.queryOptions(undefined)
  )

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1
          style={{
            ...CF,
            color: colors.marvelBlue,
            textShadow: `3px 3px 0 ${colors.spiderRed}`,
          }}
          className="text-4xl"
        >
          EXPLORE PUBLIC FORMS
        </h1>
        <p style={CB} className="mt-1 text-sm text-black/50 dark:text-white/50">
          Browse and fill public forms from the community
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-36 rounded-none border-4 border-black bg-black/5"
            />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="border-4 border-dashed border-black bg-white p-16 text-center dark:border-white/20 dark:bg-zinc-800/50">
          <Globe
            size={48}
            className="mx-auto mb-4 text-black/20 dark:text-white/20"
          />
          <h2
            style={CF}
            className="mb-2 text-3xl text-black/30 dark:text-white/30"
          >
            NO PUBLIC FORMS YET
          </h2>
          <p style={CB} className="text-sm text-black/30 dark:text-white/30">
            Published public forms will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {forms.map((form) => (
            <a
              key={form.id}
              href={form.slug ? `/f/${form.slug}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-4 border-black bg-white p-4 transition-transform hover:-translate-y-0.5 dark:border-white/20 dark:bg-zinc-800"
              style={{ boxShadow: shadows.md }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3
                  style={CF}
                  className="text-lg leading-tight text-black transition-colors group-hover:text-[#CC0000] dark:text-white"
                >
                  {form.title}
                </h3>
                <ExternalLink
                  size={14}
                  className="mt-1 shrink-0 text-black/30 dark:text-white/30"
                />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Badge
                  className="rounded-none border-2 text-[10px] tracking-wider uppercase"
                  style={{
                    backgroundColor: colors.comicYellow,
                    color: "#0a0a0a",
                    borderColor: "#0a0a0a",
                  }}
                >
                  <Globe size={8} className="mr-1" />
                  PUBLIC
                </Badge>
              </div>
              <p
                style={CB}
                className="text-xs text-black/40 dark:text-white/40"
              >
                {form.createdAt
                  ? new Date(form.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
