"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

/**
 * TalentOS Creative Pie Chart
 * Donut/pie chart with AGENCIES_DESIGN_SPEC palette.
 */

import { CHART_COLORS } from "./chartConstants"
const DEFAULT_PALETTE = CHART_COLORS

interface CreativePieChartProps {
  data: { name: string; value: number }[]
  title?: string
  colors?: string[]
  height?: number
  emptyMessage?: string
}

export function CreativePieChart({
  data,
  title,
  colors = DEFAULT_PALETTE,
  height = 220,
  emptyMessage = "No data yet",
}: CreativePieChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0)

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
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={height * 0.28}
                outerRadius={height * 0.38}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E7E5E4",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  padding: "10px 14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
