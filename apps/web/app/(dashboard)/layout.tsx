"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useSession, useLogout } from "@/hooks/auth/use-session"
import { useForms } from "@/hooks/forms/use-forms"
import { colors, fonts, shadows, SpiderWeb } from "@/lib/design-system"
import { Skeleton } from "@workspace/ui/components/skeleton"

const CF = fonts.comic
const CB = fonts.body

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "OVERVIEW", exact: true },
  { href: "/dashboard/forms", icon: FileText, label: "MY FORMS", exact: false },
  { href: "/dashboard/explore", icon: Globe, label: "EXPLORE", exact: false },
  { href: "/dashboard/profile", icon: User, label: "PROFILE", exact: false },
]

function UserAvatar({
  name,
  imageUrl,
  size = 36,
}: {
  name: string
  imageUrl?: string | null
  size?: number
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full border-2 border-black object-cover"
      />
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-black"
      style={{ width: size, height: size, backgroundColor: colors.spiderRed }}
    >
      <span style={{ ...CF, fontSize: size * 0.38, color: "#fff" }}>
        {initials}
      </span>
    </div>
  )
}

function ThemeCycleButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const next =
    resolvedTheme === "dark"
      ? "light"
      : resolvedTheme === "light"
        ? "system"
        : "dark"
  const Icon =
    resolvedTheme === "dark" ? Moon : resolvedTheme === "light" ? Sun : Monitor

  return (
    <button
      onClick={() => setTheme(next)}
      title={`Theme: ${resolvedTheme} — click to cycle`}
      className="rounded-sm border-2 border-transparent p-1.5 transition-all hover:border-black hover:bg-black/5 dark:hover:border-white/30 dark:hover:bg-white/10"
    >
      <Icon size={14} className="text-black/50 dark:text-white/50" />
    </button>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useSession()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const { forms } = useForms()
  const pathname = usePathname()

  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved === "true") setCollapsed(true)
  }, [])
  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", String(!prev))
      return !prev
    })
  }

  const publishedCount = forms.filter((f) => f.published).length

  return (
    <div className="flex min-h-screen bg-[#fafaf8] dark:bg-zinc-950">
      <aside
        className="flex shrink-0 flex-col border-r-4 border-black bg-[oklch(0.97_0_0)] transition-all duration-200 dark:border-white/10 dark:bg-zinc-900"
        style={{ width: collapsed ? 56 : 240 }}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center justify-between border-b-4 border-black px-3 py-3 dark:border-white/10">
          {!collapsed && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <SpiderWeb className="h-5 w-5 shrink-0 text-[#CC0000]" />
              <span
                style={CF}
                className="text-xl leading-none text-black dark:text-white"
              >
                WEB<span className="text-[#CC0000]">FORM</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link
              href="/dashboard"
              className="mx-auto transition-opacity hover:opacity-80"
            >
              <SpiderWeb className="h-5 w-5 text-[#CC0000]" />
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={toggleCollapsed}
              className="rounded-sm border-2 border-transparent p-1 transition-colors hover:border-black/20 hover:bg-black/10 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              <ChevronLeft
                size={14}
                className="text-black/40 dark:text-white/40"
              />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 rounded-sm px-2.5 py-2 transition-all ${collapsed ? "justify-center" : ""} ${
                  isActive
                    ? "border-2 border-black bg-white dark:border-white/30 dark:bg-zinc-800"
                    : "border-2 border-transparent"
                }`}
                style={isActive ? { boxShadow: shadows.sm } : undefined}
              >
                <item.icon
                  size={15}
                  className={
                    isActive
                      ? "shrink-0 text-[#CC0000]"
                      : "shrink-0 text-black/40 dark:text-white/40"
                  }
                />
                {!collapsed && (
                  <span
                    style={CF}
                    className={`text-sm whitespace-nowrap ${isActive ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"}`}
                  >
                    {item.label}
                  </span>
                )}
                {/* Forms count badge */}
                {!collapsed && item.href === "/dashboard/forms" && forms.length > 0 && (
                  <span
                    className="ml-auto rounded-sm border border-black/20 bg-black/5 px-1.5 py-0.5 text-[9px] text-black/50 dark:border-white/20 dark:bg-white/10 dark:text-white/50"
                    style={CF}
                  >
                    {forms.length}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Mini stats strip */}
          {!collapsed && !isLoading && forms.length > 0 && (
            <div className="mt-3 border-t-2 border-black/10 pt-3 dark:border-white/10">
              <div className="rounded-sm border-2 border-black/10 bg-black/3 px-2.5 py-2 dark:border-white/10">
                <p
                  style={CF}
                  className="mb-1.5 text-[9px] tracking-widest text-black/30 uppercase dark:text-white/30"
                >
                  YOUR STATS
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-center">
                    <p style={CF} className="text-base leading-none text-black dark:text-white">
                      {forms.length}
                    </p>
                    <p style={CB} className="text-[9px] text-black/40 dark:text-white/40">forms</p>
                  </div>
                  <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
                  <div className="text-center">
                    <p style={CF} className="text-base leading-none text-[#CC0000]">
                      {publishedCount}
                    </p>
                    <p style={CB} className="text-[9px] text-black/40 dark:text-white/40">live</p>
                  </div>
                  <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
                  <div className="text-center">
                    <p style={CF} className="text-base leading-none text-[#003366] dark:text-blue-400">
                      {forms.length - publishedCount}
                    </p>
                    <p style={CB} className="text-[9px] text-black/40 dark:text-white/40">drafts</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom user section */}
        <div className="shrink-0 border-t-4 border-black dark:border-white/10">
          {!collapsed && (
            <div className="border-b-2 border-black/10 p-3 dark:border-white/10">
              {isLoading ? (
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-9 w-9 rounded-full bg-black/10" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-24 bg-black/10" />
                    <Skeleton className="h-2.5 w-32 bg-black/10" />
                  </div>
                </div>
              ) : user ? (
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-80"
                >
                  <UserAvatar
                    name={user.fullName}
                    imageUrl={user.profileImageUrl}
                    size={36}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      style={CF}
                      className="truncate text-sm leading-tight text-black dark:text-white"
                    >
                      {user.fullName}
                    </p>
                    <p
                      style={CB}
                      className="truncate text-[10px] leading-tight text-black/40 dark:text-white/40"
                    >
                      {user.email}
                    </p>
                  </div>
                </Link>
              ) : null}
            </div>
          )}

          {collapsed && user && !isLoading && (
            <div className="flex justify-center border-b-2 border-black/10 py-2 dark:border-white/10">
              <Link href="/dashboard/profile" className="transition-opacity hover:opacity-80">
                <UserAvatar
                  name={user.fullName}
                  imageUrl={user.profileImageUrl}
                  size={32}
                />
              </Link>
            </div>
          )}

          <div
            className={`flex items-center p-2 ${collapsed ? "flex-col gap-2" : "justify-between"}`}
          >
            {collapsed ? (
              <button
                onClick={toggleCollapsed}
                className="rounded-sm border-2 border-transparent p-1.5 transition-colors hover:border-black/20 hover:bg-black/10 dark:hover:bg-white/10"
                title="Expand sidebar"
              >
                <ChevronRight
                  size={14}
                  className="text-black/40 dark:text-white/40"
                />
              </button>
            ) : null}

            <ThemeCycleButton />

            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              title="Sign out"
              className="flex items-center gap-1.5 rounded-sm border-2 border-transparent p-1.5 text-black/40 transition-colors hover:border-[#CC0000]/20 hover:text-[#CC0000] disabled:opacity-50 dark:text-white/40 dark:hover:text-[#CC0000]"
            >
              <LogOut size={14} />
              {!collapsed && (
                <span style={CF} className="text-xs">
                  SIGN OUT
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto dark:bg-zinc-950">
        {children}
      </main>
    </div>
  )
}
