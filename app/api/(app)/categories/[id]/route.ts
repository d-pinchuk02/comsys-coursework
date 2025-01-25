import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { db } from "@/db/drizzle"
import { categories, insertCategorySchema } from "@/db/schema"

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const id = (await params).id
  const user = (await getSession())!.user
  const [data] = await db
    .select({
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, user.sub)))
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

export type GetCategoryOutput = {
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
  const values = insertCategorySchema.pick({ name: true }).parse(body)

  const [data] = await db
    .update(categories)
    .set(values)
    .where(and(eq(categories.userId, user.sub), eq(categories.id, id)))
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

export type EditCategoryInput = {
  name: string
}
export type EditCategoryOutput = {
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
    .delete(categories)
    .where(and(eq(categories.userId, user.sub), eq(categories.id, id)))
    .returning({
      id: categories.id,
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

export type DeleteCategoryOutput = {
  id: string
}
