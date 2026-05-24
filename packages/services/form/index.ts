import { db, eq, and, desc, count, sql, inArray } from "@workspace/database"
import { formsTable, formFieldsTable, formSubmissionsTable } from "@workspace/database/schema"
import { logger } from "@workspace/logger"
import type { CreateFormInput, UpdateFormInput, StartLiveInput } from "./schemas/input"

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 70)
  const suffix = Math.random().toString(36).substring(2, 7)
  return `${base}-${suffix}`
}

class FormService {
  async create(data: CreateFormInput & { userId: string }) {
    const slug = generateSlug(data.title)
    const [form] = await db
      .insert(formsTable)
      .values({ ...data, slug })
      .returning()
    if (!form) throw new Error("Failed to create form")
    logger.info(`Form created`, { formId: form.id, userId: data.userId, slug: form.slug })
    return form
  }

  async getAll(userId: string) {
    return db
      .select()
      .from(formsTable)
      .where(eq(formsTable.userId, userId))
      .orderBy(desc(formsTable.createdAt))
  }

  async getById(id: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.id, id))
    return form ?? null
  }

  async getByIdWithFields(id: string) {
    const form = await this.getById(id)
    if (!form) return null
    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, id))
      .orderBy(formFieldsTable.order)
    return { ...form, fields }
  }

  async getBySlug(slug: string) {
    const [form] = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.slug, slug))
    return form ?? null
  }

  async getBySlugWithFields(slug: string) {
    const form = await this.getBySlug(slug)
    if (!form) return null
    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, form.id))
      .orderBy(formFieldsTable.order)
    return { ...form, fields }
  }

  async getPublicForms() {
    return db
      .select()
      .from(formsTable)
      .where(and(eq(formsTable.published, true), eq(formsTable.visibility, "public")))
      .orderBy(desc(formsTable.createdAt))
  }

  async update({ id, ...data }: UpdateFormInput) {
    const [form] = await db
      .update(formsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(formsTable.id, id))
      .returning()
    return form ?? null
  }

  async publish(id: string, userId: string) {
    const [form] = await db
      .update(formsTable)
      .set({ published: true, updatedAt: new Date() })
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
      .returning()
    if (form) logger.info(`Form published`, { formId: id, userId })
    return form ?? null
  }

  async unpublish(id: string, userId: string) {
    const [form] = await db
      .update(formsTable)
      .set({ published: false, updatedAt: new Date() })
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
      .returning()
    if (form) logger.info(`Form unpublished`, { formId: id, userId })
    return form ?? null
  }

  async delete(id: string, userId: string) {
    await db
      .delete(formsTable)
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
    logger.info(`Form deleted`, { formId: id, userId })
  }

  async startLive({ id, durationMinutes }: StartLiveInput, userId: string) {
    const liveUntil = new Date(Date.now() + durationMinutes * 60 * 1000)
    const [form] = await db
      .update(formsTable)
      .set({ liveUntil, updatedAt: new Date() })
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
      .returning()
    if (form) logger.info(`Form went live`, { formId: id, userId, liveUntil })
    return form ?? null
  }

  async clone(id: string, userId: string) {
    const form = await this.getByIdWithFields(id)
    if (!form || form.userId !== userId) throw new Error("Not found")

    const slug = generateSlug(`${form.title} copy`)
    const [newForm] = await db
      .insert(formsTable)
      .values({
        userId,
        title: `${form.title} (Copy)`,
        description: form.description,
        visibility: form.visibility,
        theme: form.theme,
        primaryColor: form.primaryColor,
        accentColor: form.accentColor,
        responseLimit: form.responseLimit,
        published: false,
        slug,
      })
      .returning()

    if (!newForm) throw new Error("Failed to clone form")

    if (form.fields.length > 0) {
      await db.insert(formFieldsTable).values(
        form.fields.map((f) => ({
          formId: newForm.id,
          type: f.type,
          label: f.label,
          placeholder: f.placeholder,
          helpText: f.helpText,
          required: f.required,
          order: f.order,
          options: f.options,
          validations: f.validations,
        }))
      )
    }

    logger.info(`Form cloned`, { sourceId: id, newId: newForm.id, userId })
    return newForm
  }

  async stopLive(id: string, userId: string) {
    const [form] = await db
      .update(formsTable)
      .set({ liveUntil: null, updatedAt: new Date() })
      .where(and(eq(formsTable.id, id), eq(formsTable.userId, userId)))
      .returning()
    if (form) logger.info(`Form live stopped`, { formId: id, userId })
    return form ?? null
  }

  isLive(form: { liveUntil: Date | null | undefined }): boolean {
    return !!form.liveUntil && form.liveUntil > new Date()
  }

  async getDashboardStats(userId: string) {
    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.userId, userId))
      .orderBy(desc(formsTable.createdAt))

    const now = new Date()
    const totalForms = forms.length
    const publishedForms = forms.filter((f) => f.published).length
    const draftForms = totalForms - publishedForms
    const liveForms = forms.filter((f) => f.liveUntil && f.liveUntil > now).length

    if (totalForms === 0) {
      return { totalForms: 0, publishedForms: 0, draftForms: 0, liveForms: 0, totalResponses: 0, recentForms: [] }
    }

    const formIds = forms.map((f) => f.id)
    const [totalResult] = await db
      .select({ count: count() })
      .from(formSubmissionsTable)
      .where(inArray(formSubmissionsTable.formId, formIds))

    const totalResponses = totalResult?.count ?? 0

    const recentForms = await Promise.all(
      forms.slice(0, 5).map(async (form) => {
        const [cr] = await db
          .select({ count: count() })
          .from(formSubmissionsTable)
          .where(eq(formSubmissionsTable.formId, form.id))
        return {
          id: form.id,
          title: form.title,
          published: form.published,
          createdAt: form.createdAt ? form.createdAt.toISOString() : null,
          responseCount: cr?.count ?? 0,
        }
      })
    )

    return { totalForms, publishedForms, draftForms, liveForms, totalResponses, recentForms }
  }
}

export default FormService
