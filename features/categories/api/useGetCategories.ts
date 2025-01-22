import { useQuery } from "@tanstack/react-query"
import type { GetCategoriesOutput } from "@/app/api/(app)/categories/route"

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`/api/categories`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const { data }: { data: GetCategoriesOutput } = await response.json()
      return data
    },
  })

  return query
}
