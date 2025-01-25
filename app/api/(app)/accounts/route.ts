import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { auth0 } from "@/lib/auth0"

import { db } from "@/db/drizzle"
import { accounts, insertAccountSchema } from "@/db/schema"

export const GET = async () => {
  const user = (await auth0.getSession())!.user
  const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,
    })
    .from(accounts)
    .where(eq(accounts.userId, user.sub))

  return NextResponse.json({
    data,
  })
}

export type GetAccountsOutput = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}[]

export const POST = async (req: Request) => {
  const user = (await auth0.getSession())!.user
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
  createdAt: Date
  updatedAt: Date
}
