import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { db } from "@/db/drizzle"
import { accounts, insertAccountSchema } from "@/db/schema"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const [data] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,
    })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, user.sub)))
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

export type GetAccountOutput = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const body = await req.json()
  const values = insertAccountSchema.pick({ name: true }).parse(body)

  const [data] = await db
    .update(accounts)
    .set(values)
    .where(and(eq(accounts.userId, user.sub), eq(accounts.id, id)))
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

export type EditAccountInput = {
  name: string
}
export type EditAccountOutput = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const [data] = await db
    .delete(accounts)
    .where(and(eq(accounts.userId, user.sub), eq(accounts.id, id)))
    .returning({
      id: accounts.id,
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

export type DeleteAccountOutput = {
  id: string
}
