"use client"

import { useMemo } from "react"
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

import { CHART_PALETTE, CHART_MARGIN } from "./chartConstants"

/** AGENCIES_DESIGN_SPEC palette only */
const MOVEMENT_COLORS = {
  newBookings: CHART_PALETTE.gold,
  churn: CHART_PALETTE.coral,
  reactivations: CHART_PALETTE.teal,
  expansions: CHART_PALETTE.mustard,
  trialToPaid: CHART_PALETTE.goldHover,
  seasonal: CHART_PALETTE.softGold,
}

const MOVEMENT_LABELS: Record<string, string> = {
  newBookings: "New bookings",
  churn: "Churn",
  reactivations: "Reactivations",
  expansions: "Expansions",
  trialToPaid: "Trial-to-paid",
  seasonal: "Seasonal",
}

function formatAmount(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value / 100)
}

interface RevenueMovementsChartProps {
  data: {
    period: string
    newBookings: number
    churn: number
    reactivations: number
    expansions: number
    trialToPaid: number
    seasonal: number
    total: number
  }[]
  current: number
  historical: { label: string; value: number; changePct: string }[]
  currency?: string
}

export function RevenueMovementsChart({
  data,
  current,
  historical,
  currency = "INR",
}: RevenueMovementsChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        periodLabel: d.period.replace("-", " "),
      })),
    [data]
  )

  const hasData = chartData.length > 0

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="min-w-0 rounded-xl border border-[#E7E5E4] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-[#1C1917]">
          Monthly recurring revenue
        </h3>
        {hasData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={CHART_MARGIN}
              >
                <defs>
                  {Object.entries(MOVEMENT_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`mrr-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.88} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis
                  dataKey="periodLabel"
                  tick={{ fill: "#57534E", fontSize: 11 }}
                  axisLine={{ stroke: "#E7E5E4" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#57534E", fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 100).toLocaleString()}`}
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
                    formatAmount(value, currency),
                    MOVEMENT_LABELS[name] ?? name,
                  ]}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => MOVEMENT_LABELS[value] ?? value}
                  iconType="square"
                  iconSize={10}
                />
                <Bar dataKey="newBookings" stackId="a" fill={`url(#mrr-grad-newBookings)`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="reactivations" stackId="a" fill={`url(#mrr-grad-reactivations)`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="expansions" stackId="a" fill={`url(#mrr-grad-expansions)`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="trialToPaid" stackId="a" fill={`url(#mrr-grad-trialToPaid)`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="seasonal" stackId="a" fill={`url(#mrr-grad-seasonal)`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="churn" stackId="a" fill={`url(#mrr-grad-churn)`} radius={[0, 0, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center text-[#78716C]">
            No revenue data yet
          </div>
        )}
        {hasData && (
          <div className="mt-3 flex flex-wrap gap-4 border-t border-[#E7E5E4]/60 pt-3">
            {Object.entries(MOVEMENT_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs text-[#57534E]">{MOVEMENT_LABELS[key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[#78716C]">
            Current MRR
          </p>
          <p className="mt-1 text-2xl font-bold text-[#1C1917]">
            {formatAmount(current, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#78716C]">
            Historical comparison
          </p>
          <div className="space-y-2">
            {historical.map((h) => (
              <div
                key={h.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[#57534E]">{h.label}</span>
                <span className="font-medium text-[#1C1917]">
                  {formatAmount(h.value, currency)}
                  {Number(h.changePct) >= 0 ? (
                    <span className="ml-1.5 text-emerald-600">
                      +{h.changePct}%
                    </span>
                  ) : (
                    <span className="ml-1.5 text-rose-600">{h.changePct}%</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
