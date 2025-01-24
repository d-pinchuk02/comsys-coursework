import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DeleteCategoryOutput } from "@/app/api/(app)/categories/[id]/route"

type ResponseType = DeleteCategoryOutput

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      const { data }: { data: ResponseType } = await response.json()
      return data
    },
    onMutate: () => {
      toast.loading("Видалення категорії...")
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Категорію видалено")
      queryClient.invalidateQueries({ queryKey: ["category", { id }] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити категорію")
    },
  })
  return mutation
}
