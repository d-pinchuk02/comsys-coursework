import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { db } from "@/db/drizzle"
import { categories, insertCategorySchema } from "@/db/schema"

export const GET = async () => {
  const user = (await getSession())!.user
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.userId, user.sub))

  return NextResponse.json({
    data,
  })
}

export type GetCategoriesOutput = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}[]

export const POST = async (req: Request) => {
  const user = (await getSession())!.user
  const body = await req.json()
  const values = insertCategorySchema.pick({ name: true }).parse(body)

  const [data] = await db
    .insert(categories)
    .values({
      userId: user.sub,
      ...values,
    })
    .returning()

  return NextResponse.json({
    data,
  })
}

export type PostCategoryInput = {
  name: string
}
export type PostCategoryOutput = {
  id: number
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
