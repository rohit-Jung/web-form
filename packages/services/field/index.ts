import { db, eq, and } from "@workspace/database"
import { formFieldsTable, formsTable } from "@workspace/database/schema"
import { logger } from "@workspace/logger"
import type { CreateFieldInput, UpdateFieldInput, ReorderFieldsInput } from "./schemas/input"

class FieldService {
  async create(data: CreateFieldInput) {
    const [field] = await db
      .insert(formFieldsTable)
      .values({
        ...data,
        placeholder: data.placeholder ?? null,
        helpText: data.helpText ?? null,
        options: data.options ?? null,
        validations: data.validations ?? null,
      })
      .returning()
    if (!field) throw new Error("Failed to create field")
    logger.info(`Field created`, { fieldId: field.id, formId: data.formId, type: data.type })
    return field
  }

  async getByFormId(formId: string) {
    return db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.order)
  }

  async getById(id: string) {
    const [field] = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
    return field ?? null
  }

  async update({ id, ...data }: UpdateFieldInput) {
    const [field] = await db
      .update(formFieldsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(formFieldsTable.id, id))
      .returning()
    return field ?? null
  }

  async delete(id: string, userId: string) {
    const [field] = await db
      .select({ formId: formFieldsTable.formId })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id))

    if (!field) return

    const [form] = await db
      .select({ userId: formsTable.userId })
      .from(formsTable)
      .where(and(eq(formsTable.id, field.formId), eq(formsTable.userId, userId)))

    if (!form) throw new Error("Unauthorized")

    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, id))
    logger.info(`Field deleted`, { fieldId: id, userId })
  }

  async reorder({ formId, orderedIds }: ReorderFieldsInput, userId: string) {
    const [form] = await db
      .select({ userId: formsTable.userId })
      .from(formsTable)
      .where(and(eq(formsTable.id, formId), eq(formsTable.userId, userId)))

    if (!form) throw new Error("Unauthorized")

    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const fieldId = orderedIds[i]
        if (fieldId) {
          await tx
            .update(formFieldsTable)
            .set({ order: i, updatedAt: new Date() })
            .where(and(eq(formFieldsTable.id, fieldId), eq(formFieldsTable.formId, formId)))
        }
      }
    })
    logger.info(`Fields reordered`, { formId, count: orderedIds.length, userId })
  }

  async getNextOrder(formId: string): Promise<number> {
    const fields = await db
      .select({ order: formFieldsTable.order })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
    if (fields.length === 0) return 0
    return Math.max(...fields.map((f) => f.order)) + 1
  }
}

export default FieldService
