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

import {
  CHART_AXIS_TICK,
  CHART_MARGIN,
  CHART_PALETTE,
  CHART_TOOLTIP_STYLE,
} from "./chartConstants"

export const RechartsBar = memo(function RechartsBar({
  data,
  color = CHART_PALETTE.gold,
  height = 280,
}: {
  data: RechartsBarDatum[]
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={CHART_MARGIN} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_PALETTE.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={CHART_AXIS_TICK}
          axisLine={{ stroke: CHART_PALETTE.border }}
          tickLine={false}
        />
        <YAxis
          tick={CHART_AXIS_TICK}
          axisLine={{ stroke: CHART_PALETTE.border }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: CHART_PALETTE.textSecondary }}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[8, 8, 0, 0]}
          maxBarSize={42}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

RechartsBar.displayName = "RechartsBar"
