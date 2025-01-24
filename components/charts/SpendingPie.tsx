import { useState } from "react"
import {
  FileSearch,
  PieChartIcon,
  RadarIcon,
  TargetIcon,
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
import { PieChart } from "@/components/charts/PieChart"
import { RadarChart } from "@/components/charts/RadarChart"
import { RadialChart } from "@/components/charts/RadialChart"

type Props = {
  data?: {
    name: string
    value: number
  }[]
}

export const SpendingPie = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("pie")

  const onTypeChange = (type: string) => {
    setChartType(type)
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Категорії</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Тип графіку" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChartIcon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Круг</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <RadarIcon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Радар</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <TargetIcon className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Кільця</p>
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
            {chartType === "pie" && <PieChart data={data} />}
            {chartType === "radar" && <RadarChart data={data} />}
            {chartType === "radial" && <RadialChart data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const SpendingPieLoading = () => {
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
