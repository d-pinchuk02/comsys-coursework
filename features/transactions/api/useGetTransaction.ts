import { useQuery } from "@tanstack/react-query"
import type { GetTransactionOutput } from "@/app/api/(app)/transactions/[id]/route"

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch transaction")
      }

      const { data }: { data: GetTransactionOutput } = await response.json()
      return data
    },
  })

  return query
}
