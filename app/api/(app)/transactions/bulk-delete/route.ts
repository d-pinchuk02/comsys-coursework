import { NextResponse } from "next/server"
import { and, eq, inArray, sql } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"
import { z } from "zod"

import { db } from "@/db/drizzle"
import { transactions, accounts } from "@/db/schema"

export const POST = async (req: Request) => {
  const user = (await getSession())!.user
  const body = await req.json()
  const values = z
    .object({
      ids: z.array(z.number()),
    })
    .parse(body)

  const transactionsToDelete = db.$with("transactions_to_delete").as(
    db
      .select({ id: transactions.id })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(inArray(transactions.id, values.ids), eq(accounts.userId, user.sub))
      )
  )

  const data = await db
    .with(transactionsToDelete)
    .delete(transactions)
    .where(
      inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
    )
    .returning({
      id: transactions.id,
    })

  return NextResponse.json({
    data,
  })
}

export type BulkDeleteTransactionsInput = {
  ids: number[]
}
export type BulkDeleteTransactionsOutput = {
  ids: number[]
}
