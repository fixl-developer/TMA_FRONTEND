"use client"

import * as React from "react"
import Link from "next/link"
import { Clock, ChevronRight } from "lucide-react"
import { useRecentlyVisited } from "@/shared/hooks/useRecentlyVisited"
import { cn } from "@/shared/lib/utils"

export function RecentlyVisited({ className }: { className?: string }) {
  const items = useRecentlyVisited()

  if (items.length === 0) return null

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-semibold text-slate-800">Recently visited</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-amber-50 hover:text-slate-800"
            >
              <span className="truncate">{item.label}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
