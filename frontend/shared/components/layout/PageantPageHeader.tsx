"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

export function PageantPageHeader({
  title,
  subtitle,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
}) {
  const { colors } = usePageantModeStyles()

  return (
    <div className={cn("min-w-0", className)}>
      <h1 className="truncate text-[30px] font-semibold leading-tight tracking-[-0.01em] sm:text-[34px]" style={{ color: colors.title }}>
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 truncate text-[13px] font-medium sm:text-sm" style={{ color: colors.textSoft }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

