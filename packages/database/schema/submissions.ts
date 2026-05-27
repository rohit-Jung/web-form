import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { formsTable } from "./forms"
import { formFieldsTable } from "./fields"

export const formSubmissionsTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),
  respondentEmail: varchar("respondent_email", { length: 255 }),
  submittedAt: timestamp("submitted_at").defaultNow(),
})

export const formAnswersTable = pgTable("form_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => formSubmissionsTable.id, { onDelete: "cascade" }),
  fieldId: uuid("field_id")
    .notNull()
    .references(() => formFieldsTable.id, { onDelete: "cascade" }),
  value: text("value"),
})

export type FormSubmission = typeof formSubmissionsTable.$inferSelect
export type FormAnswer = typeof formAnswersTable.$inferSelect
