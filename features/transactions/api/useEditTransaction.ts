import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  EditTransactionInput,
  EditTransactionOutput,
} from "@/app/api/(app)/transactions/[id]/route"

type RequestType = EditTransactionInput
type ResponseType = EditTransactionOutput

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(json),
      })
      if (!response.ok) {
        throw new Error("Failed to edit transaction")
      }

      const { data }: { data: EditTransactionOutput } = await response.json()
      return data
    },
    onSuccess: () => {
      toast.success("Транзакцію оновлено")
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Не вдалося оновити транзакцію")
    },
  })
  return mutation
}
