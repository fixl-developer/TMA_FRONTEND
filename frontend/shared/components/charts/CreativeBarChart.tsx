"use client"

import { useId } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { CHART_PALETTE, CHART_MARGIN } from "./chartConstants"

/**
 * TalentOS Creative Bar Chart – AGENCIES_DESIGN_SPEC only
 */

interface CreativeBarChartProps {
  data: { [key: string]: string | number }[]
  dataKey: string
  xAxisKey: string
  title?: string
  fill?: string
  valueFormatter?: (value: number) => string
  height?: number
  emptyMessage?: string
}

const DEFAULT_FILL = CHART_PALETTE.gold

export function CreativeBarChart({
  data,
  dataKey,
  xAxisKey,
  title,
  fill = DEFAULT_FILL,
  valueFormatter = (v) => String(v),
  height = 260,
  emptyMessage = "No data yet",
}: CreativeBarChartProps) {
  const hasData = data.length > 0
  const gradId = useId().replace(/:/g, "")

  return (
    <div className="min-w-0 rounded-xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
      {title && (
        <h3 className="mb-4 text-base font-semibold text-[#1C1917]">{title}</h3>
      )}
      {!hasData ? (
        <div
          className="flex items-center justify-center text-[#78716C]"
          style={{ height }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fill} stopOpacity={1} />
                  <stop offset="100%" stopColor={fill} stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
              <XAxis
                dataKey={xAxisKey}
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
                  padding: "10px 14px",
                }}
                formatter={(value: number) => [valueFormatter(value), dataKey]}
              />
              <Bar
                dataKey={dataKey}
                fill={`url(#${gradId})`}
                radius={[6, 6, 0, 0]}
                name={dataKey}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
