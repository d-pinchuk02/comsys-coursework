import {
  Tooltip,
  XAxis,
  BarChart as RechartBarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import { formatDate } from "@/lib/utils"
import { CustomTooltip } from "@/components/charts/CustomTooltip"

type Props = {
  data: {
    date: string
    income: number
    expenses: number
  }[]
}

export const BarChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => formatDate(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        {/* @ts-expect-error It's a custom component */}
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="income" fill="#10b981" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </RechartBarChart>
    </ResponsiveContainer>
  )
}
