/**
 * Recharts Line Chart – AGENCIES_DESIGN_SPEC
 */

"use client"

import { memo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  CHART_AXIS_TICK,
  CHART_MARGIN,
  CHART_PALETTE,
  CHART_TOOLTIP_STYLE,
} from "./chartConstants"

export interface RechartsLineDatum {
  label: string
  value: number
}

export const RechartsLine = memo(function RechartsLine({
  data,
  color = CHART_PALETTE.gold,
  height = 280,
}: {
  data: RechartsLineDatum[]
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={CHART_MARGIN} accessibilityLayer>
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
        <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 5, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
})

RechartsLine.displayName = "RechartsLine"
