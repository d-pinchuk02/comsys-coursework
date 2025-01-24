import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartRadarChart,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: {
    name: string
    value: number
  }[]
}

export const RadarChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartRadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
        <PolarRadiusAxis style={{ fontSize: "12px" }} />
        <Radar
          dataKey="value"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
        />
      </RechartRadarChart>
    </ResponsiveContainer>
  )
}
