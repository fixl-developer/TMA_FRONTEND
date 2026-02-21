"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSupportCasesByTenant } from "@/shared/services/supportService"
import type { SupportCase } from "@/shared/services/supportService"
import { HelpCircle, Plus, ChevronRight } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const DEMO_TENANT = "tenant_001"

export default function SupportPage() {
  const [cases, setCases] = useState<SupportCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSupportCasesByTenant(DEMO_TENANT).then(setCases).finally(() => setLoading(false))
  }, [])

  const open = cases.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS").length
  const resolved = cases.filter((c) => c.status === "RESOLVED").length

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "OPEN": return "warning"
      case "IN_PROGRESS": return "info"
      case "RESOLVED": return "success"
      default: return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Support"
        subtitle="Support cases and help center"
        action={
          <div className="flex gap-2">
            <Link href="/admin/help">
              <AdminButton variant="secondary" size="sm">Help Center</AdminButton>
            </Link>
            <Link href="/admin/support/new">
              <AdminButton size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> New Case
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Cases"
              value={cases.length}
              subtitle="All support cases"
              icon={HelpCircle}
              color="purple"
            />
            <AdminStatCard
              title="Open"
              value={open}
              subtitle="Needs attention"
              icon={HelpCircle}
              color="yellow"
            />
            <AdminStatCard
              title="Resolved"
              value={resolved}
              subtitle="Completed"
              icon={HelpCircle}
              color="green"
            />
          </>
        )}
      </div>

      {/* Support Cases */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Your Support Cases
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <AdminEmptyState
            icon={HelpCircle}
            title="No support cases"
            description="Create a case if you need help"
            action={
              <Link href="/admin/support/new">
                <AdminButton>
                  <Plus className="mr-1.5 h-4 w-4" /> New Case
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {cases.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10"
              >
                <div>
                  <p className="font-medium text-white admin-light-theme:text-slate-900 transition-colors">{c.subject}</p>
                  <p className="text-xs text-white/50 admin-light-theme:text-slate-500 transition-colors">
                    {c.category} · {c.priority} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminBadge variant={getStatusVariant(c.status)}>
                    {c.status}
                  </AdminBadge>
                  <ChevronRight className="h-4 w-4 text-white/40 admin-light-theme:text-slate-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
