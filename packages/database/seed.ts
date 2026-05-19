/**
 * Demo seed — creates 3 themed forms with fields and submissions.
 * Run: pnpm db:seed
 *
 * Creates a demo user (demo@webform.app) with 3 public forms:
 *  1. Spider-Man Fan Quiz     (slug: spider-man-fan-quiz)
 *  2. Startup Pitch Evaluator (slug: startup-pitch-evaluator)
 *  3. Anime Preferences Survey (slug: anime-preferences-survey)
 */

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"
import * as path from "path"
import crypto from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(crypto.scrypt)

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const key = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${key.toString("hex")}`
}

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import {
  usersTable,
  formsTable,
  formFieldsTable,
  formSubmissionsTable,
  formAnswersTable,
} from "./schema"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

async function seed() {
  console.log("🌱 Seeding demo data...")

  // ── Demo User ────────────────────────────────────────────────────────────────
  const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, "demo@webform.app"))
  let demoUserId: string

  if (existingUsers[0]) {
    demoUserId = existingUsers[0].id
    // Backfill password if missing (re-seed after auth migration)
    if (!existingUsers[0].passwordHash) {
      const passwordHash = await hashPassword("demo1234")
      await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.email, "demo@webform.app"))
    }
    console.log("✓ Demo user already exists:", demoUserId)
  } else {
    const passwordHash = await hashPassword("demo1234")
    const [user] = await db
      .insert(usersTable)
      .values({
        email: "demo@webform.app",
        fullName: "Peter Parker",
        passwordHash,
        profileImageUrl: null,
        emailVerified: true,
      })
      .returning()
    demoUserId = user!.id
    console.log("✓ Created demo user:", demoUserId)
  }

  // ── Helper ────────────────────────────────────────────────────────────────────
  async function createForm(
    title: string,
    description: string,
    slug: string,
    visibility: "public" | "unlisted",
    fields: Array<{
      type: "text" | "textarea" | "email" | "number" | "date" | "select" | "multiselect" | "radio" | "checkbox" | "file"
      label: string
      placeholder?: string
      helpText?: string
      required: boolean
      order: number
      options?: string[]
      validations?: { min?: number; max?: number; minLength?: number; maxLength?: number; pattern?: string }
    }>,
    submissionData: Array<{
      respondentEmail?: string
      answers: Record<string, string>
    }>
  ) {
    // Check if slug already exists
    const existing = await db.select().from(formsTable).where(eq(formsTable.slug, slug))
    if (existing[0]) {
      console.log(`  ⚡ Form "${title}" already seeded, skipping.`)
      return
    }

    const [form] = await db
      .insert(formsTable)
      .values({ userId: demoUserId, title, description, slug, published: true, visibility })
      .returning()
    console.log(`  ✓ Created form: ${title}`)

    const fieldRows = await db
      .insert(formFieldsTable)
      .values(fields.map((f) => ({ formId: form!.id, ...f, placeholder: f.placeholder ?? null, helpText: f.helpText ?? null, options: f.options ?? null })))
      .returning()
    console.log(`    ✓ ${fieldRows.length} fields added`)

    const labelToId: Record<string, string> = {}
    for (const row of fieldRows) {
      labelToId[row.label] = row.id
    }

    for (const sub of submissionData) {
      const [submission] = await db
        .insert(formSubmissionsTable)
        .values({ formId: form!.id, respondentEmail: sub.respondentEmail ?? null })
        .returning()

      const answerEntries = Object.entries(sub.answers)
        .filter(([label]) => labelToId[label])
        .map(([label, value]) => ({
          submissionId: submission!.id,
          fieldId: labelToId[label]!,
          value,
        }))

      if (answerEntries.length > 0) {
        await db.insert(formAnswersTable).values(answerEntries)
      }
    }
    console.log(`    ✓ ${submissionData.length} submissions added`)
  }

  // ── Form 1: Spider-Man Fan Quiz ───────────────────────────────────────────────
  await createForm(
    "Spider-Man Fan Quiz",
    "<p>How well do you know the Amazing Spider-Man? Test your knowledge of the web-slinger! Questions cover comics, movies, and all things Spidey. <strong>Excelsior!</strong></p>",
    "spider-man-fan-quiz",
    "public",
    [
      { type: "text",     label: "Your Hero Name",        placeholder: "e.g. The Amazing Arachnid",   required: true,  order: 0, helpText: "What would your superhero name be?" },
      { type: "email",    label: "Email Address",         placeholder: "hero@shield.gov",             required: false, order: 1 },
      { type: "radio",    label: "Who created Spider-Man?", required: true,  order: 2, options: ["Stan Lee & Jack Kirby", "Stan Lee & Steve Ditko", "Jack Kirby & Joe Simon", "Brian Michael Bendis"] },
      { type: "radio",    label: "What is Peter Parker's job?", required: true, order: 3, options: ["Teacher", "Journalist", "Scientist", "Photographer"] },
      { type: "select",   label: "Favorite Spider-Man Movie Era", required: true, order: 4, options: ["Tobey Maguire (2002–2007)", "Andrew Garfield (2012–2014)", "Tom Holland (2016–)", "Into the Spider-Verse (Animated)"] },
      { type: "multiselect", label: "Which Spidey powers are real?", required: true, order: 5, options: ["Wall-crawling", "Spider-sense", "Web-shooting (organic)", "Flight", "Super speed", "Superhuman strength"] },
      { type: "number",   label: "Rate your Spider-Man knowledge (1–10)", placeholder: "1-10", required: true, order: 6, validations: { min: 1, max: 10 } },
      { type: "textarea", label: "Best Spider-Man moment ever", placeholder: "Describe your favorite scene, issue, or quote...", required: false, order: 7 },
    ],
    [
      { respondentEmail: "tony.stark@starkindustries.com",  answers: { "Your Hero Name": "Iron Spider", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Tom Holland (2016–)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense, Superhuman strength", "Rate your Spider-Man knowledge (1–10)": "9", "Best Spider-Man moment ever": "No way home ending, absolutely destroyed me." } },
      { respondentEmail: "natasha.romanoff@shield.gov",     answers: { "Your Hero Name": "Black Widow", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Into the Spider-Verse (Animated)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense", "Rate your Spider-Man knowledge (1–10)": "7", "Best Spider-Man moment ever": "Miles Morales' leap of faith. Goosebumps every time." } },
      { respondentEmail: "bruce.banner@avengers.org",       answers: { "Your Hero Name": "The Amazing Hulk", "Who created Spider-Man?": "Stan Lee & Jack Kirby", "What is Peter Parker's job?": "Scientist", "Favorite Spider-Man Movie Era": "Tobey Maguire (2002–2007)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense, Superhuman strength", "Rate your Spider-Man knowledge (1–10)": "6", "Best Spider-Man moment ever": "The train scene in Spider-Man 2." } },
      { respondentEmail: "sam.wilson@shield.gov",           answers: { "Your Hero Name": "Falcon-Man", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Tom Holland (2016–)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense, Superhuman strength", "Rate your Spider-Man knowledge (1–10)": "8" } },
      { respondentEmail: "wanda.maximoff@avengers.org",     answers: { "Your Hero Name": "Scarlet Spider", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Into the Spider-Verse (Animated)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense", "Rate your Spider-Man knowledge (1–10)": "9", "Best Spider-Man moment ever": "What's up, Danger — every frame of that sequence." } },
      { answers: { "Your Hero Name": "Venom Fan", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Andrew Garfield (2012–2014)", "Which Spidey powers are real?": "Wall-crawling, Superhuman strength", "Rate your Spider-Man knowledge (1–10)": "10" } },
      { answers: { "Your Hero Name": "Spider-Gwen", "Who created Spider-Man?": "Stan Lee & Steve Ditko", "What is Peter Parker's job?": "Photographer", "Favorite Spider-Man Movie Era": "Into the Spider-Verse (Animated)", "Which Spidey powers are real?": "Wall-crawling, Spider-sense, Web-shooting (organic), Superhuman strength", "Rate your Spider-Man knowledge (1–10)": "10", "Best Spider-Man moment ever": "Gwen's origin story. Finally representation." } },
      { answers: { "Your Hero Name": "Deadpool", "Who created Spider-Man?": "Stan Lee & Jack Kirby", "What is Peter Parker's job?": "Teacher", "Favorite Spider-Man Movie Era": "Tobey Maguire (2002–2007)", "Rate your Spider-Man knowledge (1–10)": "4" } },
    ]
  )

  // ── Form 2: Startup Pitch Evaluator ──────────────────────────────────────────
  await createForm(
    "Startup Pitch Evaluator",
    "<p>Submit your startup idea for evaluation by our panel of Marvel-level investors. We review pitches every Monday. <em>With great funding comes great responsibility.</em></p>",
    "startup-pitch-evaluator",
    "public",
    [
      { type: "text",      label: "Startup Name",              placeholder: "e.g. Stark Industries 2.0",   required: true,  order: 0 },
      { type: "email",     label: "Founder Email",             placeholder: "ceo@yourstartup.com",         required: true,  order: 1 },
      { type: "select",    label: "Industry",                  required: true,  order: 2, options: ["FinTech", "HealthTech", "EdTech", "CleanTech", "AI/ML", "SaaS", "Web3", "Consumer", "Other"] },
      { type: "select",    label: "Stage",                     required: true,  order: 3, options: ["Idea", "MVP", "Pre-Seed", "Seed", "Series A+"] },
      { type: "number",    label: "Team Size",                 placeholder: "Number of founders/employees", required: true, order: 4, validations: { min: 1, max: 500 } },
      { type: "textarea",  label: "Problem Statement",         placeholder: "What problem are you solving?", required: true, order: 5 },
      { type: "textarea",  label: "Solution / Product",        placeholder: "Describe your solution in 2-3 sentences.", required: true, order: 6 },
      { type: "text",      label: "Target Market",             placeholder: "e.g. SMBs in Southeast Asia",  required: true, order: 7 },
      { type: "text",      label: "Revenue Model",             placeholder: "e.g. SaaS subscription, marketplace fee", required: true, order: 8 },
      { type: "radio",     label: "Funding Needed",            required: true,  order: 9, options: ["Under $50K", "$50K–$250K", "$250K–$1M", "$1M–$5M", "$5M+"] },
      { type: "checkbox",  label: "What are you looking for?", required: false, order: 10, options: ["Capital", "Mentorship", "Co-founder", "Customers", "Technical help", "PR/Marketing"] },
      { type: "radio",     label: "Rate your product-market fit confidence", required: true, order: 11, options: ["1 - Just an idea", "2 - Some validation", "3 - Early traction", "4 - Strong PMF signals", "5 - Product-market fit confirmed"] },
    ],
    [
      { respondentEmail: "happy.hogan@starkindustries.com", answers: { "Startup Name": "HappyShield AI", "Industry": "AI/ML", "Stage": "Seed", "Team Size": "4", "Problem Statement": "Security teams drown in alerts with no context.", "Solution / Product": "AI-powered threat correlation that reduces false positives by 90%.", "Target Market": "Enterprise SOC teams", "Revenue Model": "SaaS subscription", "Funding Needed": "$1M–$5M", "What are you looking for?": "Capital, Mentorship", "Rate your product-market fit confidence": "4 - Strong PMF signals" } },
      { respondentEmail: "pepper.potts@starkindustries.com", answers: { "Startup Name": "PottsLogistics", "Industry": "SaaS", "Stage": "MVP", "Team Size": "2", "Problem Statement": "SMBs lose 15% of revenue to supply chain inefficiencies.", "Solution / Product": "Automated vendor relationship management with AI insights.", "Target Market": "SMBs in manufacturing", "Revenue Model": "SaaS subscription", "Funding Needed": "$50K–$250K", "What are you looking for?": "Capital, Customers", "Rate your product-market fit confidence": "3 - Early traction" } },
      { respondentEmail: "nick.fury@shield.gov", answers: { "Startup Name": "S.H.I.E.L.D. Analytics", "Industry": "AI/ML", "Stage": "Series A+", "Team Size": "50", "Problem Statement": "Global threat intelligence is siloed across agencies.", "Solution / Product": "Unified intelligence platform for government agencies.", "Target Market": "Government & defense", "Revenue Model": "Enterprise contract", "Funding Needed": "$5M+", "What are you looking for?": "Capital, Customers, PR/Marketing", "Rate your product-market fit confidence": "5 - Product-market fit confirmed" } },
      { respondentEmail: "vision@avengers.org", answers: { "Startup Name": "VisionAI", "Industry": "AI/ML", "Stage": "Pre-Seed", "Team Size": "1", "Problem Statement": "Humans are unable to process visual data at scale.", "Solution / Product": "Neural-network-based visual understanding API.", "Target Market": "Developers and enterprises", "Revenue Model": "API pay-per-use", "Funding Needed": "$250K–$1M", "What are you looking for?": "Capital, Technical help", "Rate your product-market fit confidence": "2 - Some validation" } },
      { respondentEmail: "peter.parker@bugle.com", answers: { "Startup Name": "WebShot Photos", "Industry": "SaaS", "Stage": "MVP", "Team Size": "1", "Problem Statement": "Freelance photographers have no professional portfolio platform.", "Solution / Product": "Portfolio builder optimized for action photographers.", "Target Market": "Freelance photographers globally", "Revenue Model": "Subscription", "Funding Needed": "Under $50K", "Rate your product-market fit confidence": "3 - Early traction" } },
    ]
  )

  // ── Form 3: Anime Preferences Survey ─────────────────────────────────────────
  await createForm(
    "Anime Preferences Survey 2024",
    "<p>Hey otaku! 👋 We&apos;re studying anime viewing habits for our community research. Takes 2 minutes. <strong>NANI?!</strong> you haven&apos;t filled this yet?</p>",
    "anime-preferences-survey",
    "public",
    [
      { type: "text",       label: "Anime Username",           placeholder: "e.g. ShadowNaruto99",        required: false, order: 0 },
      { type: "email",      label: "Email",                    placeholder: "otaku@crunchyroll.com",      required: false, order: 1 },
      { type: "number",     label: "How many anime have you watched?", placeholder: "Estimated total", required: true, order: 2, validations: { min: 0 } },
      { type: "radio",      label: "How many episodes per week do you watch?", required: true, order: 3, options: ["0–5 episodes", "6–15 episodes", "16–30 episodes", "30+ episodes (certified addict)"] },
      { type: "multiselect", label: "Favorite genres",        required: true,  order: 4, options: ["Shonen", "Shojo", "Seinen", "Josei", "Isekai", "Mecha", "Slice of Life", "Horror", "Sports", "Romance", "Fantasy", "Sci-Fi"] },
      { type: "select",     label: "All-time favorite anime", required: true,  order: 5, options: ["Fullmetal Alchemist: Brotherhood", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "One Piece", "Naruto", "Death Note", "Steins;Gate", "Vinland Saga", "Other"] },
      { type: "select",     label: "Preferred platform",      required: true,  order: 6, options: ["Crunchyroll", "Netflix", "HiDive", "Funimation", "Piracy (we don't judge)", "Other"] },
      { type: "radio",      label: "Sub or Dub?",             required: true,  order: 7, options: ["Sub 100% (original is sacred)", "Dub (accessibility matters)", "Either works for me", "Depends on the anime"] },
      { type: "radio",      label: "Current hype level for anime",  required: true, order: 8, options: ["1 - Just getting into it", "2 - Casual viewer", "3 - Weekly watcher", "4 - Read manga too", "5 - Absolute weeb"] },
      { type: "textarea",   label: "Most anticipated anime of 2025?", placeholder: "Tell us what you're hyped for!", required: false, order: 9 },
    ],
    [
      { respondentEmail: "levi.ackerman@scouts.co", answers: { "How many anime have you watched?": "87", "How many episodes per week do you watch?": "16–30 episodes", "Favorite genres": "Shonen, Seinen, Fantasy", "All-time favorite anime": "Attack on Titan", "Preferred platform": "Crunchyroll", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "5 - Absolute weeb", "Most anticipated anime of 2025?": "Anything from MAPPA honestly." } },
      { respondentEmail: "eren.yeager@paradis.com", answers: { "How many anime have you watched?": "120", "How many episodes per week do you watch?": "30+ episodes (certified addict)", "Favorite genres": "Shonen, Fantasy, Seinen", "All-time favorite anime": "Attack on Titan", "Preferred platform": "Crunchyroll", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "5 - Absolute weeb", "Most anticipated anime of 2025?": "The rumbling... in 4K." } },
      { respondentEmail: "gojo.satoru@jjk.com", answers: { "How many anime have you watched?": "200", "How many episodes per week do you watch?": "30+ episodes (certified addict)", "Favorite genres": "Shonen, Fantasy, Horror", "All-time favorite anime": "Jujutsu Kaisen", "Preferred platform": "Crunchyroll", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "5 - Absolute weeb", "Most anticipated anime of 2025?": "Blue Lock season 3. The Ego Arc deserves justice." } },
      { respondentEmail: "nezuko.kamado@ds.com", answers: { "How many anime have you watched?": "45", "How many episodes per week do you watch?": "6–15 episodes", "Favorite genres": "Shonen, Romance, Fantasy", "All-time favorite anime": "Demon Slayer", "Preferred platform": "Netflix", "Sub or Dub?": "Either works for me", "Current hype level for anime": "4 - Read manga too" } },
      { respondentEmail: "l.lawliet@wammy.com", answers: { "How many anime have you watched?": "312", "How many episodes per week do you watch?": "30+ episodes (certified addict)", "Favorite genres": "Seinen, Sci-Fi, Horror", "All-time favorite anime": "Death Note", "Preferred platform": "Crunchyroll", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "5 - Absolute weeb", "Most anticipated anime of 2025?": "A proper Death Note remake with today&apos;s animation budget." } },
      { answers: { "How many anime have you watched?": "12", "How many episodes per week do you watch?": "0–5 episodes", "Favorite genres": "Isekai, Slice of Life", "All-time favorite anime": "Fullmetal Alchemist: Brotherhood", "Preferred platform": "Netflix", "Sub or Dub?": "Dub (accessibility matters)", "Current hype level for anime": "2 - Casual viewer" } },
      { answers: { "How many anime have you watched?": "67", "How many episodes per week do you watch?": "16–30 episodes", "Favorite genres": "Shonen, Sports, Fantasy", "All-time favorite anime": "Vinland Saga", "Preferred platform": "HiDive", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "4 - Read manga too", "Most anticipated anime of 2025?": "Chainsaw Man season 2 PLEASE." } },
      { answers: { "How many anime have you watched?": "5", "How many episodes per week do you watch?": "0–5 episodes", "Favorite genres": "Isekai", "All-time favorite anime": "One Piece", "Preferred platform": "Piracy (we don't judge)", "Sub or Dub?": "Dub (accessibility matters)", "Current hype level for anime": "1 - Just getting into it" } },
      { answers: { "How many anime have you watched?": "178", "How many episodes per week do you watch?": "30+ episodes (certified addict)", "Favorite genres": "Mecha, Sci-Fi, Seinen", "All-time favorite anime": "Steins;Gate", "Preferred platform": "Crunchyroll", "Sub or Dub?": "Sub 100% (original is sacred)", "Current hype level for anime": "5 - Absolute weeb", "Most anticipated anime of 2025?": "Anything Makoto Shinkai adapts next." } },
    ]
  )

  console.log("\n✅ Seed complete!")
  console.log("\n📋 Public form links:")
  console.log("  /f/spider-man-fan-quiz")
  console.log("  /f/startup-pitch-evaluator")
  console.log("  /f/anime-preferences-survey")
  console.log("\n🔑 Demo user: demo@webform.app (sign in via Google to see dashboard)")
}

seed()
  .catch(console.error)
  .finally(() => pool.end())
