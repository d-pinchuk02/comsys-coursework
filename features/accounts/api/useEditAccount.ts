import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  EditAccountInput,
  EditAccountOutput,
} from "@/app/api/(app)/accounts/[id]/route"

type RequestType = EditAccountInput
type ResponseType = EditAccountOutput

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(json),
      })
      if (!response.ok) {
        throw new Error("Failed to edit account")
      }

      const { data }: { data: EditAccountOutput } = await response.json()
      return data
    },
    onSuccess: () => {
      toast.success("Рахунок оновлено")
      queryClient.invalidateQueries({ queryKey: ["account", { id }] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося оновити рахунок")
    },
  })
  return mutation
}
