import { NextResponse } from "next/server"
import { and, eq, inArray } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"
import { z } from "zod"

import { db } from "@/db/drizzle"
import { categories } from "@/db/schema"

export const POST = async (req: Request) => {
  const user = (await getSession())!.user
  const body = await req.json()
  const values = z
    .object({
      ids: z.array(z.number()),
    })
    .parse(body)

  const data = await db
    .delete(categories)
    .where(
      and(eq(categories.userId, user.sub), inArray(categories.id, values.ids))
    )
    .returning({
      id: categories.id,
    })

  return NextResponse.json({
    data,
  })
}

export type BulkDeleteCategoriesInput = {
  ids: number[]
}
export type BulkDeleteCategoriesOutput = {
  ids: number[]
}
