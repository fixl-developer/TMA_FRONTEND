"use client"

import { useEffect, useState } from "react"
import { getTenantLimits } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, UserCircle2, Megaphone, HardDrive } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminLimitsPage() {
  const { tenantId } = useTenant()
  const [limits, setLimits] = useState<Awaited<ReturnType<typeof getTenantLimits>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantLimits(tenantId).then((d) => {
      setLimits(d)
      setLoading(false)
    })
  }, [tenantId])

  const items = limits
    ? [
        { label: "Users", used: limits.users.used, limit: limits.users.limit, icon: Users, color: "purple" as const },
        { label: "Talents", used: limits.talents.used, limit: limits.talents.limit, icon: UserCircle2, color: "blue" as const },
        { label: "Castings", used: limits.castings.used, limit: limits.castings.limit, icon: Megaphone, color: "pink" as const },
        { label: "Storage", used: limits.storage.used, limit: limits.storage.limit, unit: limits.storage.unit, icon: HardDrive, color: "yellow" as const },
      ]
    : []

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Limits"
        subtitle="Usage against tenant limits"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          items.map((item) => {
            const Icon = item.icon
            const pct = Math.round((item.used / item.limit) * 100)
            return (
              <AdminStatCard
                key={item.label}
                title={item.label}
                value={`${item.used} / ${item.limit}${item.unit ? ` ${item.unit}` : ""}`}
                subtitle={`${pct}% used`}
                icon={Icon}
                color={item.color}
              />
            )
          })
        )}
      </div>

      {/* Detailed Usage */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">Usage Details</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon
              const pct = Math.round((item.used / item.limit) * 100)
              const isNearLimit = pct >= 80
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 admin-light-theme:border-slate-200 bg-white/5 admin-light-theme:bg-white p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:hover:border-slate-300 hover:bg-white/10 admin-light-theme:hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/10 admin-light-theme:bg-purple-100 p-2 transition-colors">
                      <Icon className="h-5 w-5 text-purple-400 admin-light-theme:text-purple-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-white/50 admin-light-theme:text-slate-500 transition-colors">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
                        {item.used} / {item.limit}
                        {item.unit && ` ${item.unit}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10 admin-light-theme:bg-slate-200 transition-colors">
                    <div
                      className={`h-full transition-all ${
                        isNearLimit ? "bg-rose-400 admin-light-theme:bg-rose-500" : "bg-[#d4ff00]"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className={`mt-2 text-xs transition-colors ${isNearLimit ? "text-rose-400 admin-light-theme:text-rose-600" : "text-white/60 admin-light-theme:text-slate-600"}`}>
                    {pct}% used {isNearLimit && "⚠️ Near limit"}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
