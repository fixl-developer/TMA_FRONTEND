/**
 * Recharts Pie/Donut Chart - Light theme
 */

"use client"

import { memo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export interface RechartsPieDatum {
  label: string
  value: number
}

const CHART_COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"]

export const RechartsPie = memo(function RechartsPie({
  data,
  innerRadius = 60,
  outerRadius = 80,
}: {
  data: RechartsPieDatum[]
  innerRadius?: number
  outerRadius?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          nameKey="label"
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px" }}
          formatter={(value) => <span style={{ color: "#475569" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
})

RechartsPie.displayName = "RechartsPie"
