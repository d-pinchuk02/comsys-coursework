import {
  Tooltip,
  XAxis,
  AreaChart as RechartAreaChart,
  Area,
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

export const AreaChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#10b981"
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          strokeWidth={2}
          stroke="#f43f5e"
          fill="url(#expenses)"
          className="drop-shadow-sm"
        />
      </RechartAreaChart>
    </ResponsiveContainer>
  )
}
