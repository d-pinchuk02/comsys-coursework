import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  EditCategoryInput,
  EditCategoryOutput,
} from "@/app/api/(app)/categories/[id]/route"

type RequestType = EditCategoryInput
type ResponseType = EditCategoryOutput

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(json),
      })
      if (!response.ok) {
        throw new Error("Failed to edit category")
      }

      const { data }: { data: ResponseType } = await response.json()
      return data
    },
    onSuccess: () => {
      toast.success("Категорію оновлено")
      queryClient.invalidateQueries({ queryKey: ["categories", { id }] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Не вдалося оновити категорію")
    },
  })
  return mutation
}
