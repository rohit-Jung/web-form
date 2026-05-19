import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { formsTable } from "./forms"

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "textarea",
  "email",
  "number",
  "date",
  "select",
  "multiselect",
  "radio",
  "checkbox",
  "file",
])

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),
  type: fieldTypeEnum("type").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  placeholder: varchar("placeholder", { length: 255 }),
  helpText: text("help_text"),
  required: boolean("required").default(false).notNull(),
  order: integer("order").notNull().default(0),
  options: jsonb("options").$type<string[]>(),
  validations: jsonb("validations").$type<{
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})

export type FormField = typeof formFieldsTable.$inferSelect
export type InsertFormField = typeof formFieldsTable.$inferInsert
