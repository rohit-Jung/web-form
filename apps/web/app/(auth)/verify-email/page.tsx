"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { fonts, colors, shadows } from "@/lib/design-system"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"

const CF = fonts.comic
const CB = fonts.body

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const error = searchParams.get("error")

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(
        error === "missing_token"
          ? "Invalid verification link."
          : error === "Verification link has expired. Please request a new one."
            ? "Link expired. Request a new one below."
            : "Verification failed. Try again."
      )
    }
  }, [error])

  const handleResend = async () => {
    if (!email) {
      toast.error("No email address found. Please register again.")
      router.push("/register")
      return
    }
    setResending(true)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        toast.error(data.error ?? "Failed to resend. Try again.")
        return
      }
      setResent(true)
      toast.success("Verification email sent!")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundColor: colors.webGray,
        backgroundImage:
          "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block">
            <div
              className="mb-4 inline-block border-4 border-black px-5 py-2"
              style={{
                backgroundColor: "#CC0000",
                boxShadow: shadows.md,
                transform: "rotate(-1deg)",
              }}
            >
              <span style={CF} className="text-2xl tracking-wider text-white">
                WEBFORM
              </span>
            </div>
          </Link>
        </div>

        <div
          className="border-4 border-black bg-white p-6"
          style={{ boxShadow: shadows.lg }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center border-3 border-black"
              style={{ backgroundColor: error ? "#FFD700" : colors.marvelBlue }}
            >
              {error ? (
                <AlertCircle size={22} className="text-black" />
              ) : resent ? (
                <CheckCircle size={22} className="text-white" />
              ) : (
                <Mail size={22} className="text-white" />
              )}
            </div>
            <div>
              <h1 style={CF} className="text-xl text-black">
                {error ? "VERIFICATION FAILED" : "CHECK YOUR EMAIL"}
              </h1>
              <p style={CB} className="text-xs text-black/50">
                {error ? "Something went wrong" : "One more step"}
              </p>
            </div>
          </div>

          {!error ? (
            <div className="space-y-4">
              <p style={CB} className="text-sm text-black/70">
                We sent a verification link to{" "}
                {email ? (
                  <strong className="text-black">{email}</strong>
                ) : (
                  "your email address"
                )}
                . Click the link in the email to activate your account.
              </p>

              <div className="border-2 border-black/10 bg-black/3 px-4 py-3">
                <p style={CB} className="text-xs text-black/50">
                  Didn&apos;t receive it? Check your spam folder, or resend
                  below. Link expires in 24 hours.
                </p>
              </div>

              <Button
                onClick={handleResend}
                disabled={resending || resent}
                variant="outline"
                className="w-full rounded-none border-2 border-black"
                style={CF}
              >
                {resending ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={13} className="animate-spin" />
                    SENDING...
                  </span>
                ) : resent ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle size={13} />
                    EMAIL SENT
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={13} />
                    RESEND VERIFICATION EMAIL
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p style={CB} className="text-sm text-black/70">
                {error === "missing_token"
                  ? "The verification link is invalid. Please request a new one."
                  : decodeURIComponent(error)}
              </p>

              {email && (
                <Button
                  onClick={handleResend}
                  disabled={resending || resent}
                  className="w-full rounded-none border-2 border-black"
                  style={{
                    ...CF,
                    backgroundColor: "#CC0000",
                    color: "#fff",
                    boxShadow: shadows.sm,
                  }}
                >
                  {resending
                    ? "SENDING..."
                    : resent
                      ? "EMAIL SENT"
                      : "RESEND VERIFICATION EMAIL"}
                </Button>
              )}
            </div>
          )}

          <p style={CB} className="mt-5 text-center text-sm text-black/50">
            <Link
              href="/login"
              className="font-medium text-[#CC0000] hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
