import { NextResponse } from "next/server"
import { and, eq, inArray } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"
import { z } from "zod"

import { db } from "@/db/drizzle"
import { accounts } from "@/db/schema"

export const POST = async (req: Request) => {
  const user = (await getSession())!.user
  const body = await req.json()
  const values = z
    .object({
      ids: z.array(z.number()),
    })
    .parse(body)

  const data = await db
    .delete(accounts)
    .where(and(eq(accounts.userId, user.sub), inArray(accounts.id, values.ids)))
    .returning({
      id: accounts.id,
    })

  return NextResponse.json({
    data,
  })
}

export type BulkDeleteAccountsInput = {
  ids: number[]
}
export type BulkDeleteAccountsOutput = {
  ids: number[]
}
