"use client"

import { useState, useEffect } from "react"
import { useTRPC } from "@/providers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "@/hooks/auth/use-session"
import {
  colors,
  fonts,
  shadows,
  patterns,
  ActionBurst,
  SpeedLines,
} from "@/lib/design-system"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"
import { User, Mail, Image, Shield, CheckCircle } from "lucide-react"

const CF = fonts.comic
const CB = fonts.body

function AvatarPreview({
  name,
  imageUrl,
  size = 96,
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

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border-4 border-black"
      style={{ width: size, height: size, boxShadow: shadows.md }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ backgroundColor: colors.spiderRed }}
        >
          <span style={{ ...CF, fontSize: size * 0.35, color: "#fff" }}>
            {initials || "?"}
          </span>
        </div>
      )}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={CF}
      className="block text-xs tracking-wider text-black/60 uppercase dark:text-white/60"
    >
      {children}
    </label>
  )
}

export default function ProfilePage() {
  const { user, isLoading } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [fullName, setFullName] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setProfileImageUrl(user.profileImageUrl ?? "")
      setDirty(false)
    }
  }, [user])

  const updateProfile = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: (updated) => {
        void queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() })
        setDirty(false)
        toast.success("Profile updated!")
      },
      onError: () => toast.error("Failed to update profile"),
    })
  )

  const handleSave = () => {
    if (!fullName.trim()) return
    updateProfile.mutate({
      fullName: fullName.trim(),
      profileImageUrl: profileImageUrl.trim() || null,
    })
  }

  const previewImageUrl = profileImageUrl.trim() || null

  return (
    <div className="min-h-full">
      {/* Header strip */}
      <div
        className="relative overflow-hidden border-b-4 border-black px-8 py-8"
        style={{ backgroundColor: colors.marvelBlue, ...patterns.halftone("rgba(255,255,255,0.06)", "16px") }}
      >
        <SpeedLines className="absolute inset-0 h-full w-full text-white opacity-[0.04]" count={25} cx={20} cy={50} />
        <div className="relative z-10">
          <p style={CF} className="mb-0.5 text-xs tracking-widest text-white/50">WEBFORM DASHBOARD</p>
          <h1
            style={{
              ...CF,
              fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
              color: "#fff",
              textShadow: "3px 3px 0 rgba(0,0,0,0.4)",
            }}
          >
            YOUR PROFILE
          </h1>
          <p style={CB} className="mt-1 text-sm text-white/60">
            Manage your hero identity and account details.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-none border-4 border-black bg-black/5" />
            <Skeleton className="h-32 rounded-none border-4 border-black bg-black/5" />
          </div>
        ) : (
          <>
            {/* Avatar card */}
            <div
              className="overflow-hidden border-4 border-black bg-white dark:border-white/20 dark:bg-zinc-800"
              style={{ boxShadow: shadows.md }}
            >
              <div
                className="border-b-4 border-black px-5 py-3 dark:border-white/20"
                style={{ backgroundColor: colors.comicYellow }}
              >
                <span style={CF} className="text-sm text-black">HERO IDENTITY</span>
              </div>
              <div className="flex items-center gap-6 p-6">
                {isLoading ? (
                  <Skeleton className="h-24 w-24 rounded-full bg-black/10" />
                ) : (
                  <AvatarPreview
                    name={fullName || user?.fullName || "?"}
                    imageUrl={previewImageUrl}
                    size={96}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p style={CF} className="text-2xl leading-tight text-black dark:text-white">
                    {fullName || user?.fullName}
                  </p>
                  <p style={CB} className="mt-0.5 text-sm text-black/50 dark:text-white/50">
                    {user?.email}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {user?.emailVerified ? (
                      <>
                        <CheckCircle size={12} className="text-green-600" />
                        <span style={CB} className="text-xs text-green-600">Email verified</span>
                      </>
                    ) : (
                      <>
                        <Shield size={12} className="text-yellow-600" />
                        <span style={CB} className="text-xs text-yellow-600">Email not verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit form */}
            <div
              className="overflow-hidden border-4 border-black bg-white dark:border-white/20 dark:bg-zinc-800"
              style={{ boxShadow: shadows.md }}
            >
              <div
                className="border-b-4 border-black px-5 py-3 dark:border-white/20"
                style={{ backgroundColor: colors.spiderRed }}
              >
                <span style={CF} className="text-sm text-white">EDIT PROFILE</span>
              </div>

              <div className="space-y-5 p-6">
                {/* Full name */}
                <div className="space-y-1.5">
                  <FieldLabel>
                    <User size={10} className="mr-1 inline" />
                    DISPLAY NAME
                  </FieldLabel>
                  <Input
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setDirty(true) }}
                    placeholder="Your full name"
                    style={CB}
                    className="rounded-none border-2 border-black focus-visible:border-[#CC0000] focus-visible:ring-0 dark:border-white/20 dark:bg-zinc-700 dark:text-white"
                    maxLength={80}
                  />
                  <p style={CB} className="text-[10px] text-black/30 dark:text-white/30">
                    Shown in the sidebar and on shared forms.
                  </p>
                </div>

                {/* Email — read-only */}
                <div className="space-y-1.5">
                  <FieldLabel>
                    <Mail size={10} className="mr-1 inline" />
                    EMAIL ADDRESS
                  </FieldLabel>
                  <Input
                    value={user?.email ?? ""}
                    readOnly
                    style={CB}
                    className="cursor-not-allowed rounded-none border-2 border-black/30 bg-black/5 text-black/50 focus-visible:ring-0 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
                  />
                  <p style={CB} className="text-[10px] text-black/30 dark:text-white/30">
                    Email cannot be changed.
                  </p>
                </div>

                {/* Profile image URL */}
                <div className="space-y-1.5">
                  <FieldLabel>
                    <Image size={10} className="mr-1 inline" />
                    PROFILE IMAGE URL
                  </FieldLabel>
                  <Input
                    value={profileImageUrl}
                    onChange={(e) => { setProfileImageUrl(e.target.value); setDirty(true) }}
                    placeholder="https://example.com/avatar.png"
                    style={CB}
                    className="rounded-none border-2 border-black focus-visible:border-[#CC0000] focus-visible:ring-0 dark:border-white/20 dark:bg-zinc-700 dark:text-white"
                  />
                  <p style={CB} className="text-[10px] text-black/30 dark:text-white/30">
                    Paste a direct image URL. Leave blank to use initials avatar.
                  </p>
                </div>

                {/* Save */}
                <div className="flex items-center gap-3 border-t-2 border-black/10 pt-4 dark:border-white/10">
                  <Button
                    onClick={handleSave}
                    disabled={!fullName.trim() || updateProfile.isPending || !dirty}
                    className="rounded-none border-2 border-black bg-[#CC0000] px-6 text-white hover:bg-[#aa0000] disabled:opacity-50"
                    style={{ ...CF, boxShadow: dirty ? shadows.sm : undefined }}
                  >
                    {updateProfile.isPending ? "SAVING..." : "SAVE CHANGES"}
                  </Button>
                  {!dirty && !updateProfile.isPending && (
                    <span style={CB} className="flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                      <CheckCircle size={11} />
                      Up to date
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account info card */}
            <div
              className="border-4 border-black/20 bg-white p-5 dark:border-white/10 dark:bg-zinc-800/50"
              style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.06)" }}
            >
              <p style={CF} className="mb-2 text-xs tracking-widest text-black/40 uppercase dark:text-white/30">
                ACCOUNT INFO
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span style={CB} className="text-xs text-black/50 dark:text-white/40">Member since</span>
                  <span style={CF} className="text-xs text-black/70 dark:text-white/60">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={CB} className="text-xs text-black/50 dark:text-white/40">User ID</span>
                  <span style={{ ...fonts.sans }} className="text-[10px] font-mono text-black/30 dark:text-white/30">
                    {user?.id.slice(0, 8)}…
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
