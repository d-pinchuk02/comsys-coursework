import { formatCurrency, formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type Props = {
  active: boolean
  payload: {
    payload?: {
      date: Date
    }
    value?: number
  }[]
}

export const CustomTooltip = ({ active, payload }: Props) => {
  if (!active) return null

  const date = payload[0]!.payload!.date
  const income = payload[0]!.value
  const expenses = payload[1]!.value

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {formatDate(date, "MMM dd, yyyy")}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-emerald-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Доходи</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income!)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Витрати</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expenses! * -1)}
          </p>
        </div>
      </div>
    </div>
  )
}
