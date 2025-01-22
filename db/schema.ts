import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"
import { relations } from "drizzle-orm"
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"

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

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}))

export const insertAccountSchema = createInsertSchema(accounts, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  ...timestamps,
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}))

export const insertCategorySchema = createInsertSchema(categories, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  notes: text("notes"),
  accountId: integer("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  ...timestamps,
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}))

export const insertTransactionSchema = createInsertSchema(transactions, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
