"use client"

import * as React from "react"
import Link from "next/link"
import { Activity, FileText, Calendar, Wallet, AlertCircle, Package, Megaphone } from "lucide-react"
import { getNotifications } from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import { cn } from "@/shared/lib/utils"

const TYPE_ICONS: Record<string, React.ElementType> = {
  CONTRACT: FileText,
  BOOKING: Calendar,
  ESCROW: Wallet,
  INVOICE: Wallet,
  DISPUTE: AlertCircle,
  DELIVERABLE: Package,
  CASTING: Megaphone,
  QUOTE: FileText,
}

function getIconForType(type: string) {
  return TYPE_ICONS[type] ?? Activity
}

function formatTimeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export function ActivityFeed({
  maxItems = 8,
  className,
}: {
  maxItems?: number
  className?: string
}) {
  const { tenantId } = useTenant()
  const [items, setItems] = React.useState<{ _id: string; title: string; message: string; type: string; createdAt: string }[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    getNotifications(tenantId)
      .then((list) => setItems(list.slice(0, maxItems)))
      .finally(() => setLoading(false))
  }, [tenantId, maxItems])

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-slate-800">Recent activity</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-1 h-3 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-slate-800">Recent activity</span>
        </div>
        <p className="text-sm text-slate-500">No recent activity</p>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-semibold text-slate-800">Recent activity</span>
      </div>
      <ul className="space-y-2">
        {items.map((n) => {
          const Icon = getIconForType(n.type)
          return (
            <li key={n._id} className="flex gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">{n.title}</p>
                <p className="truncate text-xs text-slate-500">{n.message}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{formatTimeAgo(n.createdAt)}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
