import { db, eq, and, gte, sql, count } from "@workspace/database"
import {
  formSubmissionsTable,
  formAnswersTable,
  formFieldsTable,
  formsTable,
  usersTable,
} from "@workspace/database/schema"
import { logger } from "@workspace/logger"
import { sendCreatorNotification, sendRespondentConfirmation } from "../email"
import type { SubmitFormInput } from "./schemas/input"

// Kafka publisher — optional dep injected at runtime so services pkg stays Kafka-free
let _publishSubmission: ((formId: string, sub: unknown) => Promise<void>) | null = null
export function setKafkaPublisher(fn: (formId: string, sub: unknown) => Promise<void>) {
  _publishSubmission = fn
}

class SubmissionService {
  async submit({ formId, respondentEmail, answers }: SubmitFormInput) {
    const [formRow] = await db
      .select({
        id: formsTable.id,
        published: formsTable.published,
        title: formsTable.title,
        liveUntil: formsTable.liveUntil,
        creatorEmail: usersTable.email,
        creatorName: usersTable.fullName,
      })
      .from(formsTable)
      .innerJoin(usersTable, eq(formsTable.userId, usersTable.id))
      .where(eq(formsTable.id, formId))

    if (!formRow) throw new Error("Form not found")
    if (!formRow.published) throw new Error("Form is not accepting responses")

    const submission = await db.transaction(async (tx) => {
      const [sub] = await tx
        .insert(formSubmissionsTable)
        .values({ formId, respondentEmail: respondentEmail ?? null })
        .returning()

      if (!sub) throw new Error("Failed to create submission")

      if (answers.length > 0) {
        await tx.insert(formAnswersTable).values(
          answers.map((a) => ({
            submissionId: sub.id,
            fieldId: a.fieldId,
            value: a.value,
          }))
        )
      }

      logger.info(`Form ${formId} submission created`, { submissionId: sub.id })
      return sub
    })

    // Publish to Kafka if form is live
    const isLive = formRow.liveUntil && formRow.liveUntil > new Date()
    if (isLive && _publishSubmission) {
      void _publishSubmission(formId, {
        id: submission.id,
        formId,
        respondentEmail: respondentEmail ?? null,
        submittedAt: submission.submittedAt?.toISOString() ?? null,
        answers,
      })
    }

    // Fire emails asynchronously — don't block the response
    void sendCreatorNotification({
      creatorEmail: formRow.creatorEmail,
      creatorName: formRow.creatorName,
      formTitle: formRow.title,
      respondentEmail,
    })

    if (respondentEmail) {
      void sendRespondentConfirmation({ respondentEmail, formTitle: formRow.title })
    }

    return submission
  }

  async getByFormId(formId: string, userId: string) {
    const [form] = await db
      .select({ userId: formsTable.userId })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))

    if (!form) throw new Error("Unauthorized")

    const submissions = await db
      .select()
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(formSubmissionsTable.submittedAt)

    if (submissions.length === 0) return []

    const submissionIds = submissions.map((s) => s.id)
    const answers = await db
      .select()
      .from(formAnswersTable)
      .where(
        sql`${formAnswersTable.submissionId} = ANY(ARRAY[${sql.join(
          submissionIds.map((id) => sql`${id}::uuid`),
          sql`, `
        )}])`
      )

    return submissions.map((s) => ({
      ...s,
      answers: answers.filter((a) => a.submissionId === s.id),
    }))
  }

  async getAnalytics(formId: string, userId: string) {
    const [form] = await db
      .select({ userId: formsTable.userId })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))

    if (!form) throw new Error("Unauthorized")

    const [totalResult] = await db
      .select({ count: count() })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [recentResult] = await db
      .select({ count: count() })
      .from(formSubmissionsTable)
      .where(
        and(
          eq(formSubmissionsTable.formId, formId),
          gte(formSubmissionsTable.submittedAt, thirtyDaysAgo)
        )
      )

    // Daily submissions for last 30 days
    const dailyRows = await db.execute<{ date: string; count: number }>(
      sql`SELECT TO_CHAR(DATE(submitted_at), 'YYYY-MM-DD') as date, COUNT(*)::int as count
          FROM form_submissions
          WHERE form_id = ${formId}
          AND submitted_at >= NOW() - INTERVAL '30 days'
          GROUP BY DATE(submitted_at)
          ORDER BY date`
    )

    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.order)

    const fieldBreakdowns = await Promise.all(
      fields.map(async (field) => {
        const [respCount] = await db
          .select({ count: count() })
          .from(formAnswersTable)
          .where(eq(formAnswersTable.fieldId, field.id))

        const isChoiceField = ["select", "multiselect", "radio", "checkbox"].includes(field.type)
        let valueCounts: Record<string, number> | null = null

        if (isChoiceField) {
          const answers = await db
            .select({ value: formAnswersTable.value })
            .from(formAnswersTable)
            .where(eq(formAnswersTable.fieldId, field.id))

          valueCounts = {}
          for (const { value } of answers) {
            if (value) {
              valueCounts[value] = (valueCounts[value] ?? 0) + 1
            }
          }
        }

        return {
          fieldId: field.id,
          fieldLabel: field.label,
          fieldType: field.type,
          responsesCount: respCount?.count ?? 0,
          valueCounts,
        }
      })
    )

    return {
      totalSubmissions: totalResult?.count ?? 0,
      submissionsLast30Days: recentResult?.count ?? 0,
      dailySubmissions: (dailyRows.rows ?? dailyRows) as { date: string; count: number }[],
      fieldBreakdowns,
    }
  }
}

export default SubmissionService
