"use client"

import { useEffect, useState } from "react"
import { getTenantLimits } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, UserCircle2, Megaphone, HardDrive } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Limits"
        subtitle="Usage against tenant limits"
      >
      <AdminStatsGrid columns={4}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </>
        ) : (
          items.map((item) => {
            const Icon = item.icon
            const pct = Math.round((item.used / item.limit) * 100)
            return (
              <AdminStatCard
                key={item.label}
                label={item.label}
                value={`${item.used} / ${item.limit}${item.unit ? ` ${item.unit}` : ""}`}
                subtitle={`${pct}% used`}
                icon={Icon}
                color={item.color}
              />
            )
          })
        )}
      </AdminStatsGrid>

      <AdminCard title="Usage Details">
        {loading ? (
          <AdminLoading rows={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon
              const pct = Math.round((item.used / item.limit) * 100)
              const isNearLimit = pct >= 80
              return (
                <div
                  key={item.label}
                  className="rounded border border-[#edebe9] bg-white p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-[#8764b8] p-2 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#605e5c]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#323130]">
                        {item.used} / {item.limit}
                        {item.unit && ` ${item.unit}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f3f2f1]">
                    <div
                      className={`h-full transition-all ${
                        isNearLimit ? "bg-[#d13438]" : "bg-[#107c10]"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className={`mt-2 text-xs ${isNearLimit ? "text-[#d13438]" : "text-[#605e5c]"}`}>
                    {pct}% used {isNearLimit && "⚠️ Near limit"}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
