import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  BulkDeleteCategoriesInput,
  BulkDeleteCategoriesOutput,
} from "@/app/api/(app)/categories/bulk-delete/route"

type RequestType = BulkDeleteCategoriesInput
type ResponseType = BulkDeleteCategoriesOutput

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/categories/bulk-delete`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Категорії видалено")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити категорії")
    },
  })

  return mutation
}
