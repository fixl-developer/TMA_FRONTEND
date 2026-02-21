"use client"

import { CHART_PALETTE, CHART_MARGIN_HORIZONTAL } from "./chartConstants"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export interface FloatingBarDatum {
  /** Label for Y-axis (category) */
  name: string
  /** [start, end] – bar spans from start to end */
  range: [number, number]
  /** Optional metadata for tooltip */
  meta?: Record<string, unknown>
}

interface HorizontalFloatingBarChartProps {
  data: FloatingBarDatum[]
  /** Bar fill color (default: amber) */
  fill?: string
  /** X-axis label */
  xAxisLabel?: string
  /** Format X-axis tick (e.g. time, currency) */
  xAxisFormatter?: (value: number) => string
  /** Format tooltip value */
  tooltipFormatter?: (value: number) => string
  /** Chart height */
  height?: number
  /** X-axis domain [min, max] – auto if not provided */
  domain?: [number, number]
}

export function HorizontalFloatingBarChart({
  data,
  fill = CHART_PALETTE.gold,
  xAxisLabel,
  xAxisFormatter,
  tooltipFormatter,
  height = 280,
  domain,
}: HorizontalFloatingBarChartProps) {
  const hasData = data.length > 0

  const computedDomain = domain ?? (() => {
    if (!hasData) return [0, 100]
    let min = Infinity
    let max = -Infinity
    data.forEach((d) => {
      const [a, b] = d.range
      min = Math.min(min, a, b)
      max = Math.max(max, a, b)
    })
    const pad = (max - min) * 0.05 || 1
    return [Math.floor(min - pad), Math.ceil(max + pad)]
  })()

  const chartData = data.map((d) => ({
    name: d.name,
    range: d.range,
    meta: d.meta,
  }))

  const defaultFormatter = (v: number) => String(v)
  const fmt = tooltipFormatter ?? xAxisFormatter ?? defaultFormatter

  return (
    <div className="min-w-0">
      {!hasData ? (
        <div
          className="flex items-center justify-center text-[#78716C]"
          style={{ height }}
        >
          No data
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={CHART_MARGIN_HORIZONTAL}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" horizontal={false} />
              <XAxis
                type="number"
                domain={computedDomain}
                tick={{ fill: "#57534E", fontSize: 11 }}
                tickFormatter={xAxisFormatter ?? defaultFormatter}
                axisLine={{ stroke: "#E7E5E4" }}
                label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fill: "#57534E", fontSize: 11 }}
                axisLine={{ stroke: "#E7E5E4" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E7E5E4",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: unknown) => {
                  const [start, end] = Array.isArray(value) ? value : [0, 0]
                  return [`${fmt(Number(start))} → ${fmt(Number(end))}`, "Range"]
                }}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="range"
                fill={fill}
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
