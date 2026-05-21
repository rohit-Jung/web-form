"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart2,
  Users,
  TrendingUp,
  Download,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useFormLive } from "@/hooks/forms/use-live"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { useForm } from "@/hooks/forms/use-forms"
import {
  useSubmissions,
  useFormAnalytics,
} from "@/hooks/submissions/use-submissions"
import { colors, fonts, shadows } from "@/lib/design-system"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import type { SubmissionOutput } from "@workspace/services/submission/schemas/output"

const CF = fonts.comic
const CB = fonts.body

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <div
      className="flex items-center gap-3 border-4 border-black bg-white p-4 dark:border-white/20 dark:bg-zinc-800"
      style={{ boxShadow: shadows.md }}
    >
      <div
        className="shrink-0 border-2 border-black p-2 dark:border-white/20"
        style={{ backgroundColor: color }}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p
          style={CF}
          className="text-3xl leading-none text-black dark:text-white"
        >
          {value}
        </p>
        <p
          style={CB}
          className="mt-0.5 text-xs text-black/50 dark:text-white/40"
        >
          {label}
        </p>
      </div>
    </div>
  )
}

function exportCSV(
  submissions: SubmissionOutput[],
  fields: { id: string; label: string }[],
  formTitle: string
) {
  const headers = ["Date", "Respondent Email", ...fields.map((f) => f.label)]
  const rows = submissions.map((sub) => {
    const date = sub.submittedAt
      ? new Date(sub.submittedAt).toLocaleString()
      : ""
    const email = sub.respondentEmail ?? ""
    const answers = fields.map((f) => {
      const ans = sub.answers.find((a) => a.fieldId === f.id)
      return `"${(ans?.value ?? "").replace(/"/g, '""')}"`
    })
    return [`"${date}"`, `"${email}"`, ...answers].join(",")
  })

  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${formTitle.replace(/\s+/g, "_")}_responses.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function LiveCountdown({ liveUntil }: { liveUntil: string }) {
  const [remaining, setRemaining] = useState("")
  useEffect(() => {
    const tick = () => {
      const ms = new Date(liveUntil).getTime() - Date.now()
      if (ms <= 0) {
        setRemaining("ENDED")
        return
      }
      const m = Math.floor(ms / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setRemaining(`${m}:${String(s).padStart(2, "0")}`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [liveUntil])
  return <span>{remaining}</span>
}

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { form, isLoading: formLoading } = useForm(id)
  const { submissions, isLoading: subsLoading } = useSubmissions(id)
  const { analytics, isLoading: analyticsLoading } = useFormAnalytics(id)
  const [activeTab, setActiveTab] = useState<"responses" | "live">("responses")

  const formIsCurrentlyLive = !!(
    form?.liveUntil && new Date(form.liveUntil) > new Date()
  )
  const {
    submissions: liveSubmissions,
    isLive,
    liveUntil,
    status,
  } = useFormLive(id, activeTab === "live")

  const isLoading = formLoading || subsLoading || analyticsLoading

  const chartAxisColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(10,10,10,0.5)"
  const chartGridColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(10,10,10,0.12)"
  const chartAxisStroke = isDark ? "rgba(255,255,255,0.15)" : "#0a0a0a"
  const chartTooltipStyle = isDark
    ? {
        border: "2px solid rgba(255,255,255,0.2)",
        borderRadius: 0,
        fontFamily: "sans-serif",
        fontSize: 12,
        backgroundColor: "#27272a",
        color: "#f4f4f5",
      }
    : {
        border: "2px solid #0a0a0a",
        borderRadius: 0,
        fontFamily: "sans-serif",
        fontSize: 12,
      }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64 rounded-none border-2 border-black bg-black/5 dark:border-white/20 dark:bg-white/5" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 rounded-none border-4 border-black bg-black/5 dark:border-white/20 dark:bg-white/5"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-6">
        <p style={CF} className="text-2xl text-black dark:text-white">
          FORM NOT FOUND
        </p>
      </div>
    )
  }

  const dailyData = analytics?.dailySubmissions ?? []
  const hasChartData = dailyData.length > 0

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/forms/${id}/edit`}
            className="text-black transition-colors hover:text-[#CC0000] dark:text-white dark:hover:text-[#CC0000]"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div>
            <h1
              style={{
                ...CF,
                color: colors.marvelBlue,
                textShadow: `2px 2px 0 ${colors.spiderRed}`,
              }}
              className="text-3xl"
            >
              RESPONSES
            </h1>
            <p style={CB} className="text-sm text-black/50 dark:text-white/40">
              {form.title}
            </p>
          </div>
        </div>

        {submissions.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-none border-2 border-black px-3 dark:border-white/30 dark:text-white dark:hover:bg-white/10"
            onClick={() => exportCSV(submissions, form.fields, form.title)}
          >
            <Download size={12} />
            <span style={CF} className="text-xs">
              EXPORT CSV
            </span>
          </Button>
        )}
      </div>

      {analytics && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Responses"
            value={analytics.totalSubmissions}
            color={colors.spiderRed}
          />
          <StatCard
            icon={TrendingUp}
            label="Last 30 Days"
            value={analytics.submissionsLast30Days}
            color={colors.marvelBlue}
          />
          <StatCard
            icon={BarChart2}
            label="Fields"
            value={form.fields.length}
            color={colors.deepVoid}
          />
        </div>
      )}

      {hasChartData && (
        <div
          className="mb-8 border-4 border-black bg-white p-4 dark:border-white/20 dark:bg-zinc-800"
          style={{ boxShadow: shadows.sm }}
        >
          <h2 style={CF} className="mb-4 text-lg text-black dark:text-white">
            RESPONSES OVER TIME
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={dailyData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="responseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.spiderRed}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.spiderRed}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis
                dataKey="date"
                tick={{ style: CB, fontSize: 10, fill: chartAxisColor }}
                tickFormatter={(v: unknown) => String(v).slice(5)}
                tickLine={false}
                axisLine={{ stroke: chartAxisStroke }}
              />
              <YAxis
                tick={{ style: CB, fontSize: 10, fill: chartAxisColor }}
                tickLine={false}
                axisLine={{ stroke: chartAxisStroke }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                labelFormatter={(v: unknown) => `Date: ${v}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Responses"
                stroke={colors.spiderRed}
                strokeWidth={2}
                fill="url(#responseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {analytics && analytics.fieldBreakdowns.length > 0 && (
        <div className="mb-8">
          <h2 style={CF} className="mb-4 text-xl text-black dark:text-white">
            FIELD BREAKDOWN
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {analytics.fieldBreakdowns.map((fb) => {
              const chartData = fb.valueCounts
                ? Object.entries(fb.valueCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([name, count]) => ({ name, count }))
                : null

              return (
                <div
                  key={fb.fieldId}
                  className="border-4 border-black bg-white p-4 dark:border-white/20 dark:bg-zinc-800"
                  style={{ boxShadow: shadows.sm }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      style={CF}
                      className="text-sm text-black dark:text-white"
                    >
                      {fb.fieldLabel}
                    </span>
                    <Badge
                      className="rounded-none border-2 border-black text-[10px] dark:border-white/20 dark:bg-zinc-700 dark:text-white/70"
                      style={{
                        backgroundColor: isDark ? undefined : colors.webGray,
                        color: isDark ? undefined : "#0a0a0a",
                      }}
                    >
                      {fb.responsesCount} responses
                    </Badge>
                  </div>
                  <p
                    style={CB}
                    className="mb-3 text-xs text-black/40 capitalize dark:text-white/40"
                  >
                    {fb.fieldType}
                  </p>

                  {chartData && chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartGridColor}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            style: CB,
                            fontSize: 9,
                            fill: chartAxisColor,
                          }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{
                            style: CB,
                            fontSize: 9,
                            fill: chartAxisColor,
                          }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          cursor={{
                            fill: isDark
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(10,10,10,0.06)",
                          }}
                        />
                        <Bar dataKey="count" name="Count" radius={0}>
                          {chartData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                i === 0 ? colors.spiderRed : colors.marvelBlue
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {!chartData && fb.responsesCount > 0 && (
                    <p
                      style={CB}
                      className="text-xs text-black/40 italic dark:text-white/40"
                    >
                      Text field — {fb.responsesCount} responses collected
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Separator className="my-6 bg-black/20 dark:bg-white/10" />

      <div className="mb-6 flex items-center gap-2">
        {(["responses", "live"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 border-2 px-4 py-2 transition-all ${
              activeTab === tab
                ? tab === "live"
                  ? "border-[#CC0000] bg-[#CC0000] text-white"
                  : "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-black bg-white text-black hover:bg-black/5 dark:border-white/20 dark:bg-zinc-800 dark:text-white dark:hover:bg-white/5"
            }`}
          >
            {tab === "live" && (
              <Radio
                size={12}
                className={activeTab === "live" ? "animate-pulse" : ""}
              />
            )}
            <span style={CF} className="text-xs tracking-wider uppercase">
              {tab === "live" ? "LIVE FEED" : "ALL RESPONSES"}
            </span>
            {tab === "live" && formIsCurrentlyLive && (
              <span className="ml-0.5 h-2 w-2 animate-pulse rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "live" && (
        <div className="mb-6">
          <div
            className={`mb-4 flex items-center gap-3 border-4 border-black px-4 py-3 dark:border-white/20 ${isLive ? "" : "bg-[#f5f5f0] dark:bg-zinc-800"}`}
            style={isLive ? { backgroundColor: "#003366" } : undefined}
          >
            {status === "connecting" || status === "connected" ? (
              <Wifi size={16} className="animate-pulse text-white" />
            ) : status === "subscribed" && isLive ? (
              <Wifi size={16} className="animate-pulse text-green-400" />
            ) : (
              <WifiOff size={16} className="text-black/40 dark:text-white/30" />
            )}
            <div className="flex-1">
              {status === "subscribed" && isLive && liveUntil ? (
                <span style={CF} className="text-sm text-white">
                  LIVE — ends in <LiveCountdown liveUntil={liveUntil} />
                </span>
              ) : status === "subscribed" && !isLive ? (
                <span
                  style={CF}
                  className="text-sm text-black/60 dark:text-white/50"
                >
                  Form is not currently live. Start a live session from the
                  editor.
                </span>
              ) : status === "connecting" || status === "connected" ? (
                <span style={CF} className="text-sm text-white/70">
                  Connecting...
                </span>
              ) : (
                <span
                  style={CF}
                  className="text-sm text-black/60 dark:text-white/50"
                >
                  Not connected. Open the LIVE tab to connect.
                </span>
              )}
            </div>
            <span style={CF} className="text-xs text-white/60">
              {liveSubmissions.length} new
            </span>
          </div>

          {liveSubmissions.length === 0 ? (
            <div className="border-4 border-dashed border-black bg-white p-12 text-center dark:border-white/20 dark:bg-zinc-800">
              <Radio
                size={32}
                className="mx-auto mb-3 text-black/20 dark:text-white/20"
              />
              <p
                style={CF}
                className="text-xl text-black/30 dark:text-white/30"
              >
                WAITING FOR RESPONSES
              </p>
              <p
                style={CB}
                className="mt-1 text-xs text-black/30 dark:text-white/30"
              >
                New submissions will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {liveSubmissions.map((sub, i) => (
                <div
                  key={sub.id ?? i}
                  className="animate-panel-slam flex items-start gap-3 border-2 border-black bg-white p-3 dark:border-white/20 dark:bg-zinc-800"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#CC0000] dark:border-white/20">
                    <span style={CF} className="text-[10px] text-white">
                      {liveSubmissions.length - i}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        style={CB}
                        className="text-xs text-black/60 dark:text-white/50"
                      >
                        {sub.respondentEmail ?? "Anonymous"}
                      </span>
                      <span
                        style={CB}
                        className="text-[10px] text-black/40 dark:text-white/30"
                      >
                        {sub.submittedAt
                          ? new Date(sub.submittedAt).toLocaleTimeString()
                          : "just now"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sub.answers.slice(0, 3).map((a, ai) => (
                        <span
                          key={ai}
                          style={CB}
                          className="max-w-[180px] truncate border border-black/20 bg-[#f5f5f0] px-2 py-0.5 text-xs text-black dark:border-white/10 dark:bg-zinc-700 dark:text-white/80"
                        >
                          {a.value}
                        </span>
                      ))}
                      {sub.answers.length > 3 && (
                        <span
                          style={CB}
                          className="text-xs text-black/40 dark:text-white/30"
                        >
                          +{sub.answers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "responses" && (
        <>
          <h2 style={CF} className="mb-4 text-xl text-black dark:text-white">
            ALL SUBMISSIONS
          </h2>

          {submissions.length === 0 ? (
            <div className="border-4 border-dashed border-black bg-white p-12 text-center dark:border-white/20 dark:bg-zinc-800">
              <p
                style={CF}
                className="mb-2 text-2xl text-black/30 dark:text-white/30"
              >
                NO RESPONSES YET
              </p>
              <p
                style={CB}
                className="text-sm text-black/30 dark:text-white/30"
              >
                Share your form link to start collecting responses.
              </p>
            </div>
          ) : (
            <div className="overflow-auto border-4 border-black bg-white dark:border-white/20 dark:bg-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b-4 border-black dark:border-white/20"
                    style={{
                      backgroundColor: isDark ? "#3f3f46" : colors.webGray,
                    }}
                  >
                    <th
                      className="border-r-2 border-black px-3 py-2 text-left text-black dark:border-white/20 dark:text-white"
                      style={CF}
                    >
                      <span className="text-xs tracking-wider uppercase">
                        DATE
                      </span>
                    </th>
                    <th
                      className="border-r-2 border-black px-3 py-2 text-left text-black dark:border-white/20 dark:text-white"
                      style={CF}
                    >
                      <span className="text-xs tracking-wider uppercase">
                        EMAIL
                      </span>
                    </th>
                    {form.fields.slice(0, 4).map((field) => (
                      <th
                        key={field.id}
                        className="border-r-2 border-black px-3 py-2 text-left text-black last:border-r-0 dark:border-white/20 dark:text-white"
                        style={CF}
                      >
                        <span className="block max-w-[120px] truncate text-xs tracking-wider uppercase">
                          {field.label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr
                      key={sub.id}
                      className={`border-b-2 border-black/20 transition-colors hover:bg-[#fffde7] dark:border-white/10 dark:hover:bg-white/5 ${
                        i % 2 === 0
                          ? "bg-white dark:bg-zinc-800"
                          : "bg-[#f5f5f0] dark:bg-zinc-700"
                      }`}
                    >
                      <td className="border-r-2 border-black/20 px-3 py-2 whitespace-nowrap dark:border-white/10">
                        <span
                          style={CB}
                          className="text-xs text-black/60 dark:text-white/50"
                        >
                          {sub.submittedAt
                            ? new Date(sub.submittedAt).toLocaleString()
                            : "—"}
                        </span>
                      </td>
                      <td className="border-r-2 border-black/20 px-3 py-2 dark:border-white/10">
                        <span
                          style={CB}
                          className="text-xs text-black/70 dark:text-white/60"
                        >
                          {sub.respondentEmail ?? "—"}
                        </span>
                      </td>
                      {form.fields.slice(0, 4).map((field) => {
                        const answer = sub.answers.find(
                          (a) => a.fieldId === field.id
                        )
                        return (
                          <td
                            key={field.id}
                            className="max-w-[160px] border-r-2 border-black/20 px-3 py-2 last:border-r-0 dark:border-white/10"
                          >
                            <span
                              style={CB}
                              className="block truncate text-xs text-black/70 dark:text-white/60"
                            >
                              {answer?.value ?? "—"}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
