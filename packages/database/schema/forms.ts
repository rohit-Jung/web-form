import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { usersTable } from "./auth"

export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"])

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 100 }).unique(),
  published: boolean("published").default(false).notNull(),
  visibility: formVisibilityEnum("visibility").default("unlisted").notNull(),
  liveUntil: timestamp("live_until"),
  theme: varchar("theme", { length: 50 }).default("minimal").notNull(),
  primaryColor: varchar("primary_color", { length: 20 }),
  accentColor: varchar("accent_color", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})

export type Form = typeof formsTable.$inferSelect
export type InsertForm = typeof formsTable.$inferInsert
