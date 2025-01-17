import { useQuery } from "@tanstack/react-query"
import type { GetAccounts } from "@/app/api/(app)/accounts/route"

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch(`/api/accounts`)
      if (!response.ok) {
        throw new Error("Failed to fetch accounts")
      }

      const { data }: { data: GetAccounts } = await response.json()
      return data
    },
  })

  return query
}
