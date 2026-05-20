import { z } from "zod"

const d2s = (v: unknown) => (v instanceof Date ? v.toISOString() : (v ?? null))

export const authUserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  profileImageUrl: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.preprocess(d2s, z.string().nullable()),
})

export const supportedProviderSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH"]),
  displayName: z.string(),
  displayText: z.string(),
  authUrl: z.string(),
})

export type AuthUserOutput = z.infer<typeof authUserOutputSchema>
export type SupportedProvider = z.infer<typeof supportedProviderSchema>
