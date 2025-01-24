import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
