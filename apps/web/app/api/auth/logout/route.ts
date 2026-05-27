import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "session_token"
const API_BASE = process.env.API_INTERNAL_URL ?? "http://localhost:8080"

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (token) {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
      })
    } catch {
      // best effort — cookie still gets cleared below
    }
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  })
  return res
}
