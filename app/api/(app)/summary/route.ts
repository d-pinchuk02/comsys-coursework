import { NextRequest, NextResponse } from "next/server"
import { parse, subDays, differenceInDays } from "date-fns"
import { sql, sum, eq, and, gte, lte, lt, desc } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"

import { calculatePercentageChange, fillMissingDays } from "@/lib/utils"
import { db } from "@/db/drizzle"
import { transactions, accounts, categories } from "@/db/schema"

async function fetchPeriodData(
  userId: string,
  accountId: number | undefined,
  startDate: Date,
  endDate: Date
) {
  return await db
    .select({
      income:
        sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expenses:
        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      remaining: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, userId),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    )
}

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      from: string | undefined
      to: string | undefined
      accountId: number | undefined
    }>
  }
) => {
  const { from, to, accountId } = (await params) || {}
  const user = (await getSession())!.user
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom
  const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

  const periodLength = differenceInDays(endDate, startDate) + 1
  const lastPeriodStart = subDays(startDate, periodLength)
  const lastPeriodEnd = subDays(endDate, periodLength)

  const [currentPeriod] = await fetchPeriodData(
    user.sub,
    accountId,
    startDate,
    endDate
  )
  const [lastPeriod] = await fetchPeriodData(
    user.sub,
    accountId,
    lastPeriodStart,
    lastPeriodEnd
  )

  const incomeChange = calculatePercentageChange(
    currentPeriod.income,
    lastPeriod.income
  )
  const expensesChange = calculatePercentageChange(
    currentPeriod.expenses,
    lastPeriod.expenses
  )
  const remainingChange = calculatePercentageChange(
    currentPeriod.remaining,
    lastPeriod.remaining
  )

  const category = await db
    .select({
      name: categories.name,
      value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, user.sub),
        lt(transactions.amount, 0),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    )
    .groupBy(categories.name)
    .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`))

  const topCategories = category.slice(0, 3)
  const otherCategories = category.slice(3)
  const otherSum = otherCategories.reduce(
    (sum, current) => sum + current.value,
    0
  )
  const finalCategories = topCategories
  if (otherCategories.length > 0) {
    finalCategories.push({
      name: "Інші",
      value: otherSum,
    })
  }

  const activeDays = await db
    .select({
      date: transactions.createdAt,
      income:
        sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expenses:
        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
          Number
        ),
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, user.sub),
        gte(transactions.createdAt, startDate),
        lte(transactions.createdAt, endDate)
      )
    )
    .groupBy(transactions.createdAt)
    .orderBy(transactions.createdAt)

  const days = fillMissingDays(activeDays, startDate, endDate)

  return NextResponse.json<{ data: SummaryOutput }>({
    data: {
      remainingAmount: currentPeriod.remaining,
      remainingChange,
      incomeAmount: currentPeriod.income,
      incomeChange,
      expensesAmount: currentPeriod.expenses,
      expensesChange,
      categories: finalCategories,
      days,
    },
  })
}

export type SummaryOutput = {
  remainingAmount: number
  remainingChange: number
  incomeAmount: number
  incomeChange: number
  expensesAmount: number
  expensesChange: number
  categories: {
    name: string
    value: number
  }[]
  days: {
    date: Date
    income: number
    expenses: number
  }[]
}
