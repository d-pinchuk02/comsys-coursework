import { TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { useOpenCategory } from "@/features/categories/hooks/useOpenCategory"
import { useOpenTransaction } from "@/features/transactions/hooks/useOpenTransaction"

type Props = {
  id: string | number
  category?: string | null
  categoryId?: string | number | null
}

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory()
  const { onOpen: onOpenTransaction } = useOpenTransaction()

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId.toString())
    } else {
      onOpenTransaction(id.toString())
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || "Без категорії"}
    </div>
  )
}
