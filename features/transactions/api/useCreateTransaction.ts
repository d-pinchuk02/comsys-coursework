import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  PostTransactionInput,
  PostTransactionOutput,
} from "@/app/api/(app)/transactions/route"

type RequestType = PostTransactionInput
type ResponseType = PostTransactionOutput

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/transactions`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Транзакцію створено")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Не вдалося створити транзакцію")
    },
  })

  return mutation
}
