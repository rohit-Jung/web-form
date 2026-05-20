import { db, eq } from "@workspace/database"
import { usersTable } from "@workspace/database/schema"
import type { CreateUserInput } from "./model"

class UserService {
  async create(data: CreateUserInput) {
    const [user] = await db.insert(usersTable).values(data).returning()
    if (!user) throw new Error("Failed to create user")
    return user
  }

  async getByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return user ?? null
  }

  async getById(id: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
    return user ?? null
  }
}

export default UserService
