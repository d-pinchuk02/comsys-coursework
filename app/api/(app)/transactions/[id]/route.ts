import { NextRequest, NextResponse } from "next/server"
import { eq, and, sql, inArray } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { db } from "@/db/drizzle"
import { transactions, insertTransactionSchema, accounts } from "@/db/schema"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const [data] = await db
    .select({
      id: transactions.id,
      categoryId: transactions.categoryId,
      amount: transactions.amount,
      notes: transactions.notes,
      accountId: transactions.accountId,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(and(eq(transactions.id, id), eq(accounts.userId, user.sub)))
    .limit(1)

  if (!data) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      {
        status: 404,
      }
    )
  }

  return NextResponse.json({
    data,
  })
}

export type GetTransactionInput = {}
export type GetTransactionOutput = {
  id: number
  categoryId?: number | null
  amount: number
  notes?: string | null
  accountId: number
  createdAt: Date
  updatedAt?: Date | null
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const body = await req.json()
  const values = insertTransactionSchema
    .omit({ id: true, updatedAt: true })
    .parse(body)

  const transactionsToUpdate = db.$with("transactions_to_update").as(
    db
      .select({ id: transactions.id })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(transactions.id, id), eq(accounts.userId, user.sub)))
  )

  const [data] = await db
    .with(transactionsToUpdate)
    .update(transactions)
    .set(values)
    .where(
      inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
    )
    .returning()

  if (!data) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      {
        status: 404,
      }
    )
  }

  return NextResponse.json({
    data,
  })
}

export type EditTransactionInput = {}
export type EditTransactionOutput = {
  id: number
  categoryId?: number | null
  amount: number
  notes?: string | null
  accountId: number
  createdAt: Date
  updatedAt?: Date | null
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user

  const transactionsToDelete = db.$with("transactions_to_delete").as(
    db
      .select({ id: transactions.id })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(transactions.id, id), eq(accounts.userId, user.sub)))
  )

  const [data] = await db
    .with(transactionsToDelete)
    .delete(transactions)
    .where(
      inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
    )
    .returning({
      id: transactions.id,
    })

  if (!data) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      {
        status: 404,
      }
    )
  }

  return NextResponse.json({
    data,
  })
}

export type DeleteTransactionInput = {}
export type DeleteTransactionOutput = {
  id: string
}
