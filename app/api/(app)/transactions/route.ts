import { NextRequest, NextResponse } from "next/server"
import { parse, subDays } from "date-fns"
import { and, eq, gte, lte, desc } from "drizzle-orm"
import { auth0 } from "@/lib/auth0"

import { db } from "@/db/drizzle"
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema"

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const accountId = searchParams.get("accountId")
  const user = (await auth0.getSession())!.user
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom
  const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

  const data = await db
    .select({
      id: transactions.id,
      category: categories.name,
      categoryId: transactions.categoryId,
      amount: transactions.amount,
      notes: transactions.notes,
      account: accounts.name,
      accountId: transactions.accountId,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, Number(accountId)) : undefined,
        eq(accounts.userId, user.sub),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    )
    .orderBy(desc(transactions.createdAt))

  return NextResponse.json({
    data,
  })
}

export type GetTransactionsOutput = {
  id: number
  category?: string | null
  categoryId?: number | null
  amount: number
  notes?: string | null
  account: string
  accountId: number
  createdAt: Date
  updatedAt?: Date | null
}[]

export const POST = async (req: Request) => {
  const body = await req.json()
  const values = insertTransactionSchema
    .omit({ id: true, updatedAt: true })
    .parse(body)

  const [data] = await db
    .insert(transactions)
    .values({
      ...values,
    })
    .returning()

  return NextResponse.json({
    data,
  })
}

export type PostTransactionInput = {
  categoryId?: number | null
  amount: number
  notes?: string | null
  accountId: number
  createdAt: Date
}
export type PostTransactionOutput = {
  id: number
  category?: string | null
  categoryId?: number | null
  amount: number
  notes?: string | null
  account: string
  accountId: number
  createdAt: Date
  updatedAt?: Date | null
}
