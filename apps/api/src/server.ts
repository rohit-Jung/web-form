import { createExpressMiddleware } from "@trpc/server/adapters/express"
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi"
import { apiReference } from "@scalar/express-api-reference"
import cookieParser from "cookie-parser"
import cors from "cors"
import rateLimit from "express-rate-limit"
import express from "express"
import { appRouter, createContext } from "@workspace/trpc/server"
import AuthService from "@workspace/services/auth"
import { logger } from "@workspace/logger"
import { env } from "./env"

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
)

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "FormBuilder API",
  version: "1.0.0",
  baseUrl: `${env.BASE_URL}/api`,
  description: "Type-safe form builder API — powered by tRPC + Zod",
})

const authService = new AuthService()

const COOKIE_NAME = "session_token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

const submissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
})

const authLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
})

const authRegisterRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many accounts created. Try again in an hour." },
})

const trpcRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Slow down." },
})

app.get("/api/auth/google", (_req, res) => {
  const [provider] = authService.getSupportedProviders()
  if (!provider) {
    res.status(500).json({ error: "Google OAuth not configured" })
    return
  }
  res.redirect(provider.authUrl)
})

app.get("/api/auth/google/callback", async (req, res) => {
  const code = req.query.code as string | undefined

  if (!code) {
    res.redirect(`${env.FRONTEND_URL}/login?error=missing_code`)
    return
  }

  try {
    const user = await authService.handleGoogleCallback(code)
    const token = await authService.createSession(user.id)
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.redirect(`${env.FRONTEND_URL}/dashboard`)
  } catch (err) {
    logger.error("Google OAuth callback failed", { err })
    res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`)
  }
})

app.post("/api/auth/register", authRegisterRateLimit, async (req, res) => {
  const { email, password, fullName } = req.body as {
    email?: string
    password?: string
    fullName?: string
  }

  if (!email || !password || !fullName) {
    res
      .status(400)
      .json({ error: "Email, password and full name are required" })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" })
    return
  }

  try {
    await authService.register(email, password, fullName)
    res.json({ success: true, emailSent: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed"
    res.status(400).json({ error: message })
  }
})

app.get("/api/auth/verify-email", async (req, res) => {
  const token = req.query.token as string | undefined
  if (!token) {
    res.redirect(`${env.FRONTEND_URL}/verify-email?error=missing_token`)
    return
  }
  try {
    const user = await authService.verifyEmailToken(token)
    const sessionToken = await authService.createSession(user.id)
    res.cookie(COOKIE_NAME, sessionToken, COOKIE_OPTIONS)
    res.redirect(`${env.FRONTEND_URL}/dashboard`)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed"
    res.redirect(
      `${env.FRONTEND_URL}/verify-email?error=${encodeURIComponent(message)}`
    )
  }
})

app.post(
  "/api/auth/resend-verification",
  authRegisterRateLimit,
  async (req, res) => {
    const { email } = req.body as { email?: string }
    if (!email) {
      res.status(400).json({ error: "Email is required" })
      return
    }
    try {
      await authService.resendVerification(email)
      res.json({ success: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend"
      res.status(400).json({ error: message })
    }
  }
)

app.post("/api/auth/login", authLoginRateLimit, async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" })
    return
  }

  try {
    const user = await authService.loginWithPassword(email, password)
    const token = await authService.createSession(user.id)
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    res.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed"
    if (message === "EMAIL_NOT_VERIFIED") {
      res.status(403).json({ error: "EMAIL_NOT_VERIFIED" })
      return
    }
    res.status(401).json({ error: message })
  }
})

app.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined
  if (token) await authService.deleteSession(token)
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  res.json({ success: true })
})

function requireDocsSecret(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const provided =
    (req.query.secret as string | undefined) ??
    req.cookies?.["docs_secret"]
  if (provided !== env.DOCS_SECRET) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }
  next()
}

app.get("/openapi.json", requireDocsSecret, (_req, res) => {
  res.json(openApiDocument)
})

app.use("/docs", requireDocsSecret, apiReference({ url: "/openapi.json" }))

app.use(
  "/api",
  createOpenApiExpressMiddleware({ router: appRouter, createContext })
)

app.get("/", (_req, res) => {
  res.json({ message: "FormBuilder API is up and running" })
})

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", message: "FormBuilder server is healthy" })
})

app.use("/trpc", trpcRateLimit)
app.use("/trpc/submission.submit", submissionRateLimit)

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ path, error }) {
      logger.error(`tRPC error on ${path ?? "unknown"}`, { error })
    },
  })
)

export default app
