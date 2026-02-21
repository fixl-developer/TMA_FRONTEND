"use client"

import { useMemo, useId } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

/**
 * TalentOS Creative Stacked Bar Chart
 * Premium stacked bar chart using AGENCIES_DESIGN_SPEC palette.
 * Use for: revenue breakdown, pipeline stages, bookings by status, etc.
 */

export interface StackedSegment {
  dataKey: string
  label: string
  color: string
}

interface CreativeStackedBarChartProps {
  /** Chart data – each item has x-axis label + segment values */
  data: Record<string, string | number>[]
  /** Key for X-axis labels */
  xAxisKey: string
  /** Segments to stack (order = bottom to top) */
  segments: StackedSegment[]
  /** Chart title */
  title?: string
  /** Y-axis formatter (e.g. currency, count) */
  valueFormatter?: (value: number) => string
  /** Chart height */
  height?: number
  /** Empty state message */
  emptyMessage?: string
}

import { CHART_COLORS, CHART_MARGIN } from "./chartConstants"
const DEFAULT_PALETTE = CHART_COLORS

export function CreativeStackedBarChart({
  data,
  xAxisKey,
  segments,
  title,
  valueFormatter = (v) => String(v),
  height = 280,
  emptyMessage = "No data yet",
}: CreativeStackedBarChartProps) {
  const hasData = data.length > 0
  const chartId = useId().replace(/:/g, "")

  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      periodLabel: String(d[xAxisKey] ?? "").replace("-", " "),
    }))
  }, [data, xAxisKey])

  return (
    <div className="min-w-0 rounded-xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
      {title && (
        <h3 className="mb-4 text-base font-semibold text-[#1C1917]">
          {title}
        </h3>
      )}
      {!hasData ? (
        <div
          className="flex items-center justify-center text-[#78716C]"
          style={{ height }}
        >
          {emptyMessage}
        </div>
      ) : (
        <>
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={CHART_MARGIN}
              >
                <defs>
                  {segments.map((s) => (
                    <linearGradient
                      key={s.dataKey}
                      id={`grad-${chartId}-${s.dataKey}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={s.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={0.85} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E7E5E4"
                  vertical={false}
                />
                <XAxis
                  dataKey="periodLabel"
                  tick={{ fill: "#57534E", fontSize: 11 }}
                  axisLine={{ stroke: "#E7E5E4" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#57534E", fontSize: 11 }}
                  tickFormatter={valueFormatter}
                  axisLine={{ stroke: "#E7E5E4" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E7E5E4",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: number, name: string) => [
                    valueFormatter(value),
                    segments.find((s) => s.dataKey === name)?.label ?? name,
                  ]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) =>
                    segments.find((s) => s.dataKey === value)?.label ?? value
                  }
                  iconType="square"
                  iconSize={10}
                />
                {segments.map((s) => (
                  <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    stackId="a"
                    fill={`url(#grad-${chartId}-${s.dataKey})`}
                    radius={[0, 0, 0, 0]}
                    name={s.label}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 border-t border-[#E7E5E4]/60 pt-3">
            {segments.map((s) => (
              <div key={s.dataKey} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-[#57534E]">{s.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export { DEFAULT_PALETTE }
