import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { db } from "@/db/drizzle"
import { accounts, insertAccountSchema } from "@/db/schema"

export const GET = async () => {
  const user = (await getSession())!.user
  const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(eq(accounts.userId, user.sub))

  return NextResponse.json({
    data,
  })
}

export type GetAccountsInput = {}
export type GetAccountsOutput = {
  id: string
  name: string
}[]

export const POST = async (req: Request) => {
  const user = (await getSession())!.user
  const body = await req.json()
  const values = insertAccountSchema.pick({ name: true }).parse(body)

  const [data] = await db
    .insert(accounts)
    .values({
      userId: user.sub,
      ...values,
    })
    .returning()

  return NextResponse.json({
    data,
  })
}

export type PostAccountInput = {
  name: string
}
export type PostAccountOutput = {
  id: number
  name: string
  userId: string
}
