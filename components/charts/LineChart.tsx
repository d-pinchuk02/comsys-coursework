import {
  Tooltip,
  XAxis,
  LineChart as RechartLineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { format } from "date-fns"

import { CustomTooltip } from "@/components/charts/CustomTooltip"

type Props = {
  data: {
    date: string
    income: number
    expenses: number
  }[]
}

export const LineChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        {/* @ts-expect-error It's a custom component */}
        <Tooltip content={CustomTooltip} />
        <Line
          dataKey="income"
          dot={false}
          stroke="#10b981"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dataKey="expenses"
          dot={false}
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
      </RechartLineChart>
    </ResponsiveContainer>
  )
}
