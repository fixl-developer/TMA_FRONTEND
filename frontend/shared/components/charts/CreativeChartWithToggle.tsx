"use client"

import { useState, useId } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { BarChart2, LineChart as LineChartIcon, AreaChart as AreaChartIcon, PieChart as PieChartIcon } from "lucide-react"
import { CHART_PALETTE, CHART_COLORS, CHART_MARGIN } from "./chartConstants"

export type ChartVariant = "bar" | "line" | "area" | "pie"

interface CreativeChartWithToggleProps {
  data: { [key: string]: string | number }[]
  dataKey: string
  xAxisKey: string
  title?: string
  valueFormatter?: (value: number) => string
  height?: number
  emptyMessage?: string
  /** Allowed variants – bar always first. Time series: bar|line|area. Categorical: bar|pie */
  variants?: ChartVariant[]
  theme?: "light" | "dark"
}

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #E7E5E4",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  padding: "10px 14px",
} as const

export function CreativeChartWithToggle({
  data,
  dataKey,
  xAxisKey,
  title,
  valueFormatter = (v) => String(v),
  height = 260,
  emptyMessage = "No data yet",
  variants = ["bar", "line", "pie"],
  theme = "light",
}: CreativeChartWithToggleProps) {
  const [variant, setVariant] = useState<ChartVariant>(variants[0])
  const hasData = data.length > 0
  const uid = useId().replace(/:/g, "")
  const isDark = theme === "dark"
  const gridColor = isDark ? "#3f3f46" : "#e5e7eb"
  const axisColor = isDark ? "#d4d4d8" : "#6b7280"
  const tooltipBg = isDark ? "#18181b" : "#ffffff"
  const tooltipBorder = isDark ? "#3f3f46" : "#e5e7eb"
  const tooltipText = isDark ? "#f4f4f5" : "#111827"

  const iconButtons = [
    { id: "bar" as const, icon: BarChart2, label: "Bar" },
    { id: "line" as const, icon: LineChartIcon, label: "Line" },
    { id: "area" as const, icon: AreaChartIcon, label: "Area" },
    { id: "pie" as const, icon: PieChartIcon, label: "Pie" },
  ].filter((b) => variants.includes(b.id))

  // Show buttons inline with title if title exists, otherwise show them separately
  const showButtonsInline = !!title

  return (
    <div className="min-w-0">
      {title && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className={`text-base font-semibold ${isDark ? "text-zinc-100" : "text-[#1C1917]"}`}>{title}</h3>
          {iconButtons.length > 1 && (
            <div className="flex items-center gap-2">
              {iconButtons.map((btn) => {
                const Icon = btn.icon
                return (
                  <button
                    key={btn.id}
                    onClick={() => setVariant(btn.id)}
                    className={`rounded-lg p-2 transition-colors ${
                      variant === btn.id
                        ? "bg-[#fbbf24]/10"
                        : isDark
                        ? "hover:bg-white/5"
                        : "hover:bg-black/5"
                    }`}
                    title={`${btn.label} Chart`}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: variant === btn.id ? "#fbbf24" : isDark ? "#a3a3a3" : "#6b7280" }}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {!title && iconButtons.length > 1 && (
        <div className="mb-3 flex justify-end">
          <div className="flex items-center gap-2">
            {iconButtons.map((btn) => {
              const Icon = btn.icon
              return (
                <button
                  key={btn.id}
                  onClick={() => setVariant(btn.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    variant === btn.id
                      ? "bg-[#fbbf24]/10"
                      : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5"
                  }`}
                  title={`${btn.label} Chart`}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: variant === btn.id ? "#fbbf24" : isDark ? "#a3a3a3" : "#6b7280" }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!hasData ? (
        <div
          className={`flex items-center justify-center ${isDark ? "text-zinc-400" : "text-[#78716C]"}`}
          style={{ height }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {variant === "bar" && (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xAxisKey} tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={valueFormatter} axisLine={{ stroke: gridColor }} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    color: tooltipText,
                    boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "10px 14px",
                  }}
                  formatter={(v: number) => [valueFormatter(v), dataKey]} 
                />
                <Bar dataKey={dataKey} fill={`url(#${uid}-bar)`} radius={[8, 8, 0, 0]} name={dataKey} />
              </BarChart>
            )}

            {(variant === "line" || variant === "area") && (
              <>
                {variant === "line" ? (
                  <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey={xAxisKey} tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={valueFormatter} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                        boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "10px 14px",
                      }}
                      formatter={(v: number) => [valueFormatter(v), dataKey]} 
                    />
                    <Line type="monotone" dataKey={dataKey} stroke="#fbbf24" strokeWidth={3} dot={{ fill: "#fbbf24", strokeWidth: 0, r: 4 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey={xAxisKey} tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={valueFormatter} axisLine={{ stroke: gridColor }} tickLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                        color: tooltipText,
                        boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "10px 14px",
                      }}
                      formatter={(v: number) => [valueFormatter(v), dataKey]} 
                    />
                    <Area type="monotone" dataKey={dataKey} stroke="#fbbf24" fill={`url(#${uid}-area)`} strokeWidth={3} />
                  </AreaChart>
                )}
              </>
            )}

            {variant === "pie" && (
              <PieChart>
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={xAxisKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={height * 0.28}
                  outerRadius={height * 0.38}
                  paddingAngle={2}
                  label={({ [xAxisKey]: name, [dataKey]: val }) => `${name}: ${valueFormatter(Number(val))}`}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke={isDark ? "#18181b" : "#fff"} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    color: tooltipText,
                    boxShadow: isDark ? "0 10px 20px rgba(0,0,0,0.35)" : "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "10px 14px",
                  }}
                  formatter={(v: number) => valueFormatter(v)} 
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
