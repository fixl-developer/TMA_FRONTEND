/**
 * Recharts Bar Chart - Light theme
 */

"use client"

import { memo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export interface RechartsBarDatum {
  label: string
  value: number
}

const CHART_COLORS = ["#3b82f6", "#0ea5e9", "#10b981", "#f59e0b"]

export const RechartsBar = memo(function RechartsBar({
  data,
}: {
  data: RechartsBarDatum[]
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#475569" }}
        />
        <Bar
          dataKey="value"
          fill={CHART_COLORS[0]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

RechartsBar.displayName = "RechartsBar"
