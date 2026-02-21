/**
 * Simple chart primitives used across the Super Admin dashboards.
 *
 * Lightweight, CSS-based charts (no external libraries), intended
 * for seed-driven, non-interactive visualizations.
 * Optimized with React.memo for performance.
 */

"use client"

import { memo } from "react"

export type BarDatum = { label: string; value: number; colorClass: string }

export const SimpleBarChart = memo(function SimpleBarChart({
  data,
}: {
  data: BarDatum[]
}) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-40 items-end gap-3" role="img" aria-label="Bar chart">
      {data.map((d) => (
        <div
          key={d.label}
          className="flex flex-1 flex-col items-center gap-1"
          role="group"
          aria-label={`${d.label}: ${d.value}`}
        >
          <div className="flex h-full w-full items-end justify-center rounded-md bg-slate-100">
            <div
              className={`${d.colorClass} w-3/5 rounded-t-md transition-[height]`}
              style={{
                height: `${(d.value / max) * 100 || 4}%`,
              }}
              aria-hidden="true"
            />
          </div>
          <span className="text-[10px] text-slate-600">{d.label}</span>
          <span className="text-[10px] font-semibold text-slate-800">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  )
})

SimpleBarChart.displayName = "SimpleBarChart"

export type DonutDatum = { label: string; value: number; color: string }

export const SimpleDonutChart = memo(function SimpleDonutChart({
  data,
}: {
  data: DonutDatum[]
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const segments = data.filter((d) => d.value > 0)

  let currentAngle = 0
  const gradientParts: string[] = []
  segments.forEach((d) => {
    const start = currentAngle
    const angle = total > 0 ? (d.value / total) * 360 : 0
    const end = start + angle
    gradientParts.push(`${d.color} ${start}deg ${end}deg`)
    currentAngle = end
  })

  const gradient =
    gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "conic-gradient(#e2e8f0 0deg 360deg)"

  const chartDescription = segments
    .map((d) => `${d.label}: ${d.value}`)
    .join(", ")

  return (
    <div
      className="flex items-center gap-4"
      role="img"
      aria-label={`Donut chart: ${chartDescription}`}
    >
      <div
        className="relative h-32 w-32 rounded-full border border-slate-200 bg-slate-100"
        style={{ backgroundImage: gradient }}
        aria-hidden="true"
      >
        <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white">
          <span className="text-[11px] font-semibold text-slate-800">
            {total}
          </span>
        </div>
      </div>
      <ul className="space-y-1.5 text-[10px] text-slate-600" role="list">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
              aria-hidden="true"
            />
            <span className="text-slate-700">{d.label}</span>
            <span className="text-slate-500">· {d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})

SimpleDonutChart.displayName = "SimpleDonutChart"
