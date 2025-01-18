import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  PostAccountInput,
  PostAccountOutput,
} from "@/app/api/(app)/accounts/route"

type RequestType = PostAccountInput
type ResponseType = PostAccountOutput

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/accounts`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Рахунок створено")
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
    onError: () => {
      toast.error("Не вдалося створити рахунок")
    },
  })

  return mutation
}
