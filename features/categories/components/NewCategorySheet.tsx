import { z } from "zod"

import { insertCategorySchema } from "@/db/schema"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNewCategory } from "@/features/categories/hooks/useNewCategory"
import { CategoryForm } from "@/features/categories/components/CategoryForm"
import { useCreateCategory } from "@/features/categories/api/useCreateCategory"

const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()

  const mutation = useCreateCategory()

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Створити категорію</SheetTitle>
          <SheetDescription>
            Створіть нову категорію для розподілення витрат
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
