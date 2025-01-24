import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  BulkDeleteAccountsInput,
  BulkDeleteAccountsOutput,
} from "@/app/api/(app)/accounts/bulk-delete/route"

type RequestType = BulkDeleteAccountsInput
type ResponseType = BulkDeleteAccountsOutput

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`/api/accounts/bulk-delete`, {
        method: "POST",
        body: JSON.stringify(json),
      })

      return (await response.json()).data as ResponseType
    },
    onSuccess: () => {
      toast.success("Рахунки видалено")
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
    },
    onError: () => {
      toast.error("Не вдалося видалити рахунки")
    },
  })

  return mutation
}
