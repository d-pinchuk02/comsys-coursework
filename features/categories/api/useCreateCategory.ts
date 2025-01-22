import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  PostCategoryInput,
  PostCategoryOutput,
} from "@/app/api/(app)/categories/route"

type RequestType = PostCategoryInput
type ResponseType = PostCategoryOutput

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/categories`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Категорію створено")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: () => {
      toast.error("Не вдалося створити категорію")
    },
  })

  return mutation
}
