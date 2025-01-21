import { createInsertSchema } from "drizzle-zod"
import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
})

export const insertCategorySchema = createInsertSchema(categories)
