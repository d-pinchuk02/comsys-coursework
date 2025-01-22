import { createInsertSchema } from "drizzle-zod"
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
}

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  ...timestamps,
})

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  ...timestamps,
})

export const insertCategorySchema = createInsertSchema(categories)
