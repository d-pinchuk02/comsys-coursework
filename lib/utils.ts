import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, isSameDay } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromCents(amount: number) {
  return amount / 100
}

export function convertAmountToCents(amount: number) {
  return Math.round(amount * 100)
}

export function truncateText(text: string | null | undefined, limit: number) {
  const length = text?.length || 0
  if (length <= limit) return text

  return text?.substring(0, limit).concat("...")
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 2,
  }).format(value)
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }

  return ((current - previous) / previous) * 100
}

export function fillMissingDays(
  activeDays: {
    date: Date
    income: number
    expenses: number
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))

    if (found) {
      return found
    }

    return {
      date: day,
      income: 0,
      expenses: 0,
    }
  })

  return transactionsByDay
}
