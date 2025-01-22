import { useQuery } from "@tanstack/react-query"
import type { GetCategoryOutput } from "@/app/api/(app)/categories/[id]/route"

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id }],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch category")
      }

      const { data }: { data: GetCategoryOutput } = await response.json()
      return data
    },
  })

  return query
}
