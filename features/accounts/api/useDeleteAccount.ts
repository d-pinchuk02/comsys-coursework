import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { DeleteAccountOutput } from "@/app/api/(app)/accounts/[id]/route"

type ResponseType = DeleteAccountOutput

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      const { data }: { data: DeleteAccountOutput } = await response.json()
      return data
    },
    onMutate: () => {
      toast.loading("Видалення рахунку...")
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Рахунок видалено")
      queryClient.invalidateQueries({ queryKey: ["account", { id }] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити рахунок")
    },
  })
  return mutation
}
