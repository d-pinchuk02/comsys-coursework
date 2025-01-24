import { useConfirm } from "@/hooks/useConfirm"
import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction"
import { useDeleteTransaction } from "@/features/transactions/api/useDeleteTransaction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Ви точно впевнені?",
    "Ви збираєтесь видалити транзакцію."
  )
  const deleteMutation = useDeleteTransaction(id)
  const isDisabled = deleteMutation.isPending
  const { onOpen } = useOpenTransaction()
  const handleDelete = async () => {
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate()
    }
  }
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              onOpen(id)
            }}
          >
            <Edit className="mr-2 size-4" />
            Редагувати
          </DropdownMenuItem>

          <DropdownMenuItem disabled={isDisabled} onClick={handleDelete}>
            <Trash className="mr-2 size-4" />
            Видалити
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
