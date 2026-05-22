"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Plus,
  FileText,
  BarChart2,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { useDashboardStats, useCreateForm } from "@/hooks/forms/use-forms"
import { useSession } from "@/hooks/auth/use-session"
import {
  colors,
  fonts,
  shadows,
  ActionBurst,
  ComicButton,
  SpeedLines,
  patterns,
} from "@/lib/design-system"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"

const CF = fonts.comic
const CB = fonts.body

function QuickCreateDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const createForm = useCreateForm()
  const router = useRouter()

  const handleCreate = async () => {
    if (!title.trim()) return
    const form = await createForm.mutateAsync({ title: title.trim(), visibility: "unlisted" })
    onClose()
    router.push(`/dashboard/forms/${form.id}/edit`)
  }

  return (
    <DialogContent
      className="max-w-sm overflow-hidden rounded-none border-4 border-black bg-white p-0 dark:border-white/20 dark:bg-zinc-900"
      style={{ boxShadow: shadows.lg }}
    >
      <div className="border-b-4 border-black px-5 py-4 dark:border-white/20" style={{ backgroundColor: colors.spiderRed }}>
        <DialogTitle style={CF} className="text-2xl text-white">NEW FORM</DialogTitle>
      </div>
      <div className="space-y-4 p-5">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Form title..."
          style={CB}
          className="rounded-none border-2 border-black focus-visible:border-[#CC0000] focus-visible:ring-0 dark:border-white/20 dark:bg-zinc-800 dark:text-white"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || createForm.isPending}
            className="flex-1 rounded-none border-2 border-black bg-[#CC0000] text-white hover:bg-[#aa0000]"
            style={{ ...CF, boxShadow: shadows.sm }}
          >
            {createForm.isPending ? "CREATING..." : "CREATE"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none border-2 border-black dark:border-white/20 dark:text-white"
            style={CF}
          >
            CANCEL
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  accent: string
  sub?: string
}) {
  return (
    <div
      className="relative overflow-hidden border-4 border-black bg-white dark:border-white/20 dark:bg-zinc-800"
      style={{ boxShadow: shadows.md }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={patterns.halftone(accent, "14px")} />
      <div className="relative p-5">
        <div className="mb-3 flex items-center justify-between">
          <span style={CF} className="text-xs tracking-widest text-black/40 uppercase dark:text-white/40">
            {label}
          </span>
          <div
            className="flex h-8 w-8 items-center justify-center border-2 border-black dark:border-white/20"
            style={{ backgroundColor: accent }}
          >
            <Icon size={14} className="text-white" />
          </div>
        </div>
        <p style={CF} className="text-4xl leading-none text-black dark:text-white">
          {value}
        </p>
        {sub && (
          <p style={CB} className="mt-1 text-xs text-black/40 dark:text-white/40">{sub}</p>
        )}
      </div>
      {/* Bottom accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
    </div>
  )
}

function RecentFormRow({
  form,
}: {
  form: { id: string; title: string; published: boolean; createdAt: string | null; responseCount: number }
}) {
  return (
    <Link
      href={`/dashboard/forms/${form.id}/edit`}
      className="group flex items-center justify-between border-b-2 border-black/10 px-4 py-3 transition-colors hover:bg-black/3 last:border-0 dark:border-white/10 dark:hover:bg-white/5"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-2 w-2 shrink-0 rounded-full border border-black/20"
          style={{ backgroundColor: form.published ? colors.spiderRed : "#d1d5db" }}
        />
        <p
          style={CF}
          className="truncate text-sm text-black transition-colors group-hover:text-[#CC0000] dark:text-white"
        >
          {form.title}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 ml-3">
        <div className="flex items-center gap-1">
          <BarChart2 size={11} className="text-black/30 dark:text-white/30" />
          <span style={CF} className="text-xs text-black/50 dark:text-white/50">
            {form.responseCount}
          </span>
        </div>
        <ArrowRight size={12} className="text-black/20 transition-colors group-hover:text-[#CC0000] dark:text-white/20" />
      </div>
    </Link>
  )
}

export default function DashboardOverviewPage() {
  const { user } = useSession()
  const { stats, isLoading } = useDashboardStats()
  const [createOpen, setCreateOpen] = useState(false)

  const greeting = user ? `WELCOME BACK, ${user.fullName.split(" ")[0].toUpperCase()}!` : "COMMAND CENTER"

  return (
    <div className="min-h-full">
      {/* Hero strip */}
      <div
        className="relative overflow-hidden border-b-4 border-black px-8 py-8"
        style={{ backgroundColor: colors.spiderRed, ...patterns.halftone("rgba(0,0,0,0.12)", "16px") }}
      >
        <SpeedLines className="absolute inset-0 h-full w-full text-black opacity-[0.04]" count={30} cx={80} cy={50} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p style={CF} className="mb-0.5 text-xs tracking-widest text-white/50">WEBFORM DASHBOARD</p>
            <h1
              style={{
                ...CF,
                fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                color: "#fff",
                textShadow: "3px 3px 0 rgba(0,0,0,0.4)",
              }}
            >
              {greeting}
            </h1>
            <p style={CB} className="mt-1 text-sm text-white/60">
              Your hero dashboard — track forms, responses, and action items.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <ActionBurst word="POW!" size="w-20 h-20" textSize="text-sm" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
        {/* Stats grid */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 style={CF} className="text-lg text-black/60 uppercase dark:text-white/60">
              MISSION STATS
            </h2>
            <span style={CF} className="text-xs text-black/30 dark:text-white/30">
              — LIVE DATA —
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-none border-4 border-black bg-black/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="TOTAL FORMS"
                value={stats?.totalForms ?? 0}
                icon={FileText}
                accent={colors.marvelBlue}
                sub="in your arsenal"
              />
              <StatCard
                label="PUBLISHED"
                value={stats?.publishedForms ?? 0}
                icon={TrendingUp}
                accent={colors.spiderRed}
                sub="live & accepting"
              />
              <StatCard
                label="RESPONSES"
                value={stats?.totalResponses ?? 0}
                icon={BarChart2}
                accent={colors.mangaOrange}
                sub="total submissions"
              />
              <StatCard
                label="LIVE NOW"
                value={stats?.liveForms ?? 0}
                icon={Zap}
                accent="#16a34a"
                sub="real-time sessions"
              />
            </div>
          )}
        </section>

        {/* Recent forms + quick actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent forms */}
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 style={CF} className="text-lg text-black/60 uppercase dark:text-white/60">
                RECENT FORMS
              </h2>
              <Link href="/dashboard/forms">
                <span style={CF} className="flex items-center gap-1 text-xs text-[#CC0000] hover:underline">
                  ALL FORMS <ArrowRight size={10} />
                </span>
              </Link>
            </div>

            <div
              className="overflow-hidden border-4 border-black bg-white dark:border-white/20 dark:bg-zinc-800"
              style={{ boxShadow: shadows.md }}
            >
              {isLoading ? (
                <div className="space-y-1 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-none bg-black/5" />
                  ))}
                </div>
              ) : !stats?.recentForms.length ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <ActionBurst word="ZIP!" size="w-14 h-14" textSize="text-[10px]" />
                  <p style={CB} className="text-sm text-black/40 dark:text-white/40">
                    No forms yet. Create your first one!
                  </p>
                </div>
              ) : (
                stats.recentForms.map((form) => <RecentFormRow key={form.id} form={form} />)
              )}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h2 style={CF} className="mb-4 text-lg text-black/60 uppercase dark:text-white/60">
              QUICK ACTIONS
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="group flex w-full items-center gap-3 border-4 border-black bg-[#CC0000] px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: shadows.md }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white/30 bg-white/10">
                  <Plus size={16} className="text-white" />
                </div>
                <div>
                  <p style={CF} className="text-sm text-white">NEW FORM</p>
                  <p style={CB} className="text-[10px] text-white/60">Create and start collecting</p>
                </div>
              </button>

              <Link href="/dashboard/forms">
                <button
                  className="group flex w-full items-center gap-3 border-4 border-black bg-white px-4 py-3 text-left transition-transform hover:-translate-y-0.5 dark:bg-zinc-800"
                  style={{ boxShadow: shadows.md }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black dark:border-white/20"
                    style={{ backgroundColor: colors.marvelBlue }}
                  >
                    <FileText size={14} className="text-white" />
                  </div>
                  <div>
                    <p style={CF} className="text-sm text-black dark:text-white">ALL FORMS</p>
                    <p style={CB} className="text-[10px] text-black/40 dark:text-white/40">Manage your collection</p>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/explore">
                <button
                  className="group flex w-full items-center gap-3 border-4 border-black bg-white px-4 py-3 text-left transition-transform hover:-translate-y-0.5 dark:bg-zinc-800"
                  style={{ boxShadow: shadows.md }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black dark:border-white/20"
                    style={{ backgroundColor: colors.mangaOrange }}
                  >
                    <TrendingUp size={14} className="text-white" />
                  </div>
                  <div>
                    <p style={CF} className="text-sm text-black dark:text-white">EXPLORE</p>
                    <p style={CB} className="text-[10px] text-black/40 dark:text-white/40">Browse public forms</p>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/profile">
                <button
                  className="group flex w-full items-center gap-3 border-4 border-black bg-white px-4 py-3 text-left transition-transform hover:-translate-y-0.5 dark:bg-zinc-800"
                  style={{ boxShadow: shadows.md }}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black dark:border-white/20"
                    style={{ backgroundColor: "#6b21a8" }}
                  >
                    <BarChart2 size={14} className="text-white" />
                  </div>
                  <div>
                    <p style={CF} className="text-sm text-black dark:text-white">YOUR PROFILE</p>
                    <p style={CB} className="text-[10px] text-black/40 dark:text-white/40">Edit name & avatar</p>
                  </div>
                </button>
              </Link>
            </div>
          </section>
        </div>

        {/* Draft count callout */}
        {!isLoading && (stats?.draftForms ?? 0) > 0 && (
          <div
            className="flex items-center justify-between border-4 border-black bg-[#FFD700] px-5 py-3"
            style={{ boxShadow: shadows.sm }}
          >
            <div className="flex items-center gap-3">
              <ActionBurst word="!" size="w-8 h-8" textSize="text-xs" />
              <span style={CF} className="text-sm text-black">
                YOU HAVE {stats?.draftForms} UNPUBLISHED DRAFT{(stats?.draftForms ?? 0) > 1 ? "S" : ""}
              </span>
            </div>
            <Link href="/dashboard/forms">
              <Button
                size="sm"
                className="rounded-none border-2 border-black bg-black px-3 text-white hover:bg-black/80"
                style={CF}
              >
                PUBLISH NOW
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <QuickCreateDialog onClose={() => setCreateOpen(false)} />
      </Dialog>
    </div>
  )
}
