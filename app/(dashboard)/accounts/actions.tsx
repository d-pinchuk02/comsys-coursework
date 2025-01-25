import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount"
import { useDeleteAccount } from "@/features/accounts/api/useDeleteAccount"
import { useConfirm } from "@/hooks/useConfirm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  id: string | number
}

export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Ви точно впевнені?",
    "Ви збираєтесь видалити рахунок."
  )
  const deleteMutation = useDeleteAccount(id.toString())
  const isDisabled = deleteMutation.isPending
  const { onOpen } = useOpenAccount()
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
              onOpen(id.toString())
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
