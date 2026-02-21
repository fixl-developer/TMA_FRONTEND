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

import {
  CHART_COLORS_ENTERPRISE,
  CHART_PALETTE,
  CHART_TOOLTIP_STYLE,
} from "./chartConstants"

export const RechartsPie = memo(function RechartsPie({
  data,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  palette = CHART_COLORS_ENTERPRISE,
}: {
  data: RechartsPieDatum[]
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  palette?: readonly string[]
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart accessibilityLayer>
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
              fill={palette[index % palette.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            formatter={(value) => (
              <span style={{ color: CHART_PALETTE.textSecondary }}>{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  )
})

RechartsPie.displayName = "RechartsPie"
