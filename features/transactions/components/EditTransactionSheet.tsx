import { z } from "zod"
import { Loader2 } from "lucide-react"

import { insertTransactionSchema } from "@/db/schema"
import { convertAmountFromCents } from "@/lib/utils"
import { useConfirm } from "@/hooks/useConfirm"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useGetTransaction } from "@/features/transactions/api/useGetTransaction"
import { useEditTransaction } from "@/features/transactions/api/useEditTransaction"
import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction"
import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction"
import { TransactionForm } from "@/features/transactions/components/TransactionForm"
import { useCreateCategory } from "@/features/categories/api/useCreateCategory"
import { useGetCategories } from "@/features/categories/api/useGetCategories"
import { useCreateAccount } from "@/features/accounts/api/useCreateAccount"
import { useGetAccounts } from "@/features/accounts/api/useGetAccounts"

const formSchema = insertTransactionSchema.omit({
  id: true,
  updatedAt: true,
})

type FormValues = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()

  const [ConfirmDialog, confirm] = useConfirm(
    "Ви точно впевнені?",
    "Ви збираєтесь видалити транзакцію."
  )

  const transactionQuery = useGetTransaction(id)
  const editMutation = useEditTransaction(id)
  const deleteMutation = useDeleteTransaction(id)

  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    })
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    })
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending
  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading

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

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: convertAmountFromCents(transactionQuery.data.amount).toString(),
        createdAt: transactionQuery.data.createdAt
          ? new Date(transactionQuery.data.createdAt)
          : new Date(),
        notes: transactionQuery.data.notes,
      }
    : undefined

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Редагувати транзакцію</SheetTitle>
            <SheetDescription>Змініть деталі вашої транзакції</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
