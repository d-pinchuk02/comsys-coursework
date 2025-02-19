import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"

import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  value?: Date
  onChange?: SelectSingleEventHandler
  disabled?: boolean
}

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? formatDate(value, "PPP") : <span>Оберіть дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  )
}
