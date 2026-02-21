/**
 * Recharts Area Chart - Light theme
 */

"use client"

import { memo, useId } from "react"
import {
  AreaChart,
  Area,
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

export interface RechartsAreaDatum {
  label: string
  value: number
}

export const RechartsArea = memo(function RechartsArea({
  data,
  color = CHART_PALETTE.teal,
  height = 280,
}: {
  data: RechartsAreaDatum[]
  color?: string
  height?: number
}) {
  const gradientId = useId().replace(/:/g, "")
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={CHART_MARGIN} accessibilityLayer>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
})

RechartsArea.displayName = "RechartsArea"
