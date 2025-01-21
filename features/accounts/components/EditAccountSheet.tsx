import { z } from "zod"
import { Loader2 } from "lucide-react"

import { insertAccountSchema } from "@/db/schema"
import { useConfirm } from "@/hooks/useConfirm"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useGetAccount } from "@/features/accounts/api/useGetAccount"
import { useEditAccount } from "@/features/accounts/api/useEditAccount"
import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount"
import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount"
import { AccountForm } from "@/features/accounts/components/AccountForm"

const formSchema = insertAccountSchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()

  const [ConfirmDialog, confirm] = useConfirm(
    "Ви точно впевнені?",
    "Ви збираєтесь видалити рахунок."
  )

  const accountQuery = useGetAccount(id)
  const editMutation = useEditAccount(id)
  const deleteMutation = useDeleteAccount(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountQuery.isLoading

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const onDelete = async () => {
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Редагувати рахунок</SheetTitle>
            <SheetDescription>Змініть назву вашого рахунка</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
