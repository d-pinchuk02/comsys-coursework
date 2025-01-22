import { z } from "zod"
import { Loader2, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { insertCategorySchema } from "@/db/schema"

const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

type Props = {
  id?: string
  defaultValues?: FormValues
  onSubmit: (values: FormValues) => void
  onDelete?: () => void
  disabled?: boolean
}

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  }

  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Наприклад, продукти, транспорт, ліки"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {disabled && (
            <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
          )}
          {id ? "Зберегти зміни" : "Створити категорію"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            size="icon"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Видалити категорію
          </Button>
        )}
      </form>
    </Form>
  )
}
