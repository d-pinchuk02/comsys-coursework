import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import type { GetSummaryOutput } from "@/app/api/(app)/summary/route"
import { convertAmountFromCents } from "@/lib/utils"

export const useGetSummary = () => {
  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""
  const accountId = params.get("accountId") || ""

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set("from", from)
      queryParams.set("to", to)
      queryParams.set("accountId", accountId)
      const response = await fetch(`/api/summary?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch summary")
      }

      const { data }: { data: GetSummaryOutput } = await response.json()
      return {
        ...data,
        incomeAmount: convertAmountFromCents(data.incomeAmount),
        expensesAmount: convertAmountFromCents(data.expensesAmount),
        remainingAmount: convertAmountFromCents(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromCents(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromCents(day.income),
          expenses: convertAmountFromCents(day.expenses),
        })),
      }
    },
  })

  return query
}
