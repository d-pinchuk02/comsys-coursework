import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DeleteTransactionOutput } from "@/app/api/(app)/transactions/[id]/route"

type ResponseType = DeleteTransactionOutput

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      const { data }: { data: DeleteTransactionOutput } = await response.json()
      return data
    },
    onMutate: () => {
      toast.loading("Видалення транзакції...")
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Транзакцію видалено")
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити транзакцію")
    },
  })
  return mutation
}
