import { useState } from "react"
import {
  FileSearch,
  AreaChartIcon,
  LineChartIcon,
  BarChart3Icon,
  Loader2Icon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { AreaChart } from "@/components/charts/AreaChart"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"

type Props = {
  data?: {
    date: string
    income: number
    expenses: number
  }[]
}

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area")

  const onTypeChange = (type: string) => {
    setChartType(type)
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Транзакції</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Тип графіку" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChartIcon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Зони</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChartIcon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Лінії</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart3Icon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Стовпчики</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Немає даних за обраний період
            </p>
          </div>
        ) : (
          <>
            {chartType === "line" && <LineChart data={data} />}
            {chartType === "area" && <AreaChart data={data} />}
            {chartType === "bar" && <BarChart data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2Icon className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  )
}
