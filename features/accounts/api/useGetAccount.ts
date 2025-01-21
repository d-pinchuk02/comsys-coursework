import { useQuery } from "@tanstack/react-query"
import type { GetAccountOutput } from "@/app/api/(app)/accounts/[id]/route"

export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      const response = await fetch(`/api/accounts/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch account")
      }

      const { data }: { data: GetAccountOutput } = await response.json()
      return data
    },
  })

  return query
}
