import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { GetTransactionsOutput } from "@/app/api/(app)/transactions/route"

export const useGetTransactions = () => {
  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""
  const accountId = params.get("accountId") || ""

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set("from", from)
      queryParams.set("to", to)
      queryParams.set("accountId", accountId)
      const response = await fetch(`/api/transactions?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const { data }: { data: GetTransactionsOutput } = await response.json()
      return data
    },
  })

  return query
}
