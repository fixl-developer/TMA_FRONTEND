"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

/** Tiny 7-day trend line for metric cards */
export function Sparkline({
  data,
  className,
  stroke = "currentColor",
  strokeWidth = 1.5,
  height = 24,
}: {
  data: number[]
  className?: string
  stroke?: string
  strokeWidth?: number
  height?: number
}) {
  if (!data?.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 48
  const padding = 2
  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(" ")
  return (
    <svg
      className={cn("inline-block", className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}
