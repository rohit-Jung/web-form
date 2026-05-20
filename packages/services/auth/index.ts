import crypto from "node:crypto"
import { promisify } from "node:util"
import { db, eq, and, gt } from "@workspace/database"
import { usersTable, sessionsTable } from "@workspace/database/schema"
import { googleOAuth2Client } from "../clients/google-oauth"
import { env } from "../env"
import type { SupportedProvider } from "./schemas/output"

const scrypt = promisify(crypto.scrypt)

type GoogleProfile = {
  email: string
  fullName: string
  profileImageUrl?: string
}

const SESSION_TTL_DAYS = 30

class AuthService {
  getSupportedProviders(): SupportedProvider[] {
    const authUrl = googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      prompt: "select_account",
    })

    return [
      {
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Continue with Google",
        authUrl,
      },
    ]
  }

  async handleGoogleCallback(code: string) {
    const { tokens } = await googleOAuth2Client.getToken(code)
    googleOAuth2Client.setCredentials(tokens)

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.GOOGLE_OAUTH_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email) throw new Error("Invalid Google token payload")

    const profile: GoogleProfile = {
      email: payload.email,
      fullName: payload.name ?? payload.email,
      profileImageUrl: payload.picture,
    }

    return this.getOrCreateUser(profile)
  }

  async getOrCreateUser(profile: GoogleProfile) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, profile.email))
      .limit(1)

    if (existing[0]) return existing[0]

    const [created] = await db
      .insert(usersTable)
      .values({
        email: profile.email,
        fullName: profile.fullName,
        profileImageUrl: profile.profileImageUrl ?? null,
        emailVerified: true,
      })
      .returning()

    if (!created) throw new Error("Failed to create user")
    return created
  }

  async createSession(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

    await db.insert(sessionsTable).values({ userId, token, expiresAt })
    return token
  }

  async validateSession(token: string) {
    const rows = await db
      .select({ user: usersTable })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
      .where(
        and(
          eq(sessionsTable.token, token),
          gt(sessionsTable.expiresAt, new Date())
        )
      )
      .limit(1)

    return rows[0]?.user ?? null
  }

  async deleteSession(token: string) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token))
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString("hex")
    const key = (await scrypt(password, salt, 64)) as Buffer
    return `${salt}:${key.toString("hex")}`
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, stored] = hash.split(":")
    if (!salt || !stored) return false
    const key = (await scrypt(password, salt, 64)) as Buffer
    return key.toString("hex") === stored
  }

  async register(email: string, password: string, fullName: string) {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1)

    if (existing[0]) throw new Error("An account with this email already exists")

    const passwordHash = await this.hashPassword(password)
    const [user] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase(), fullName, passwordHash, emailVerified: false })
      .returning()

    if (!user) throw new Error("Failed to create account")
    return user
  }

  async loginWithPassword(email: string, password: string) {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1)

    const user = rows[0]
    if (!user) throw new Error("Invalid email or password")

    if (!user.passwordHash) {
      throw new Error("This account uses Google Sign-In. Please continue with Google.")
    }

    const valid = await this.verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error("Invalid email or password")

    return user
  }
}

export default AuthService
