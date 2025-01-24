import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  BulkDeleteTransactionsInput,
  BulkDeleteTransactionsOutput,
} from "@/app/api/(app)/transactions/bulk-delete/route"

type RequestType = BulkDeleteTransactionsInput
type ResponseType = BulkDeleteTransactionsOutput

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/transactions/bulk-delete`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Транзакції видалено")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити транзакції")
    },
  })

  return mutation
}
