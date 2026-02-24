"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSupportCasesByTenant } from "@/shared/services/supportService"
import type { SupportCase } from "@/shared/services/supportService"
import { HelpCircle, Plus, ChevronRight } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Support"
        subtitle="Support cases and help center"
        actions={
        <>
          <Link href="/admin/help">
            <AdminButton variant="secondary">Help Center</AdminButton>
          </Link>
          <Link href="/admin/support/new">
            <AdminButton>
              <Plus className="h-4 w-4" />
              New Case
            </AdminButton>
          </Link>
        </>
      }
    >
      <AdminStatsGrid columns={4}>
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              label="Total Cases"
              value={cases.length}
              subtitle="All support cases"
              icon={HelpCircle}
              color="purple"
            />
            <AdminStatCard
              label="Open"
              value={open}
              subtitle="Needs attention"
              icon={HelpCircle}
              color="yellow"
            />
            <AdminStatCard
              label="Resolved"
              value={resolved}
              subtitle="Completed"
              icon={HelpCircle}
              color="green"
            />
            <AdminStatCard
              label="In Progress"
              value={cases.filter((c) => c.status === "IN_PROGRESS").length}
              subtitle="Being worked on"
              icon={HelpCircle}
              color="blue"
            />
          </>
        )}
      </AdminStatsGrid>

      <AdminCard title="Your Support Cases" subtitle={`${cases.length} total cases`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : cases.length === 0 ? (
          <AdminEmptyState
            icon={HelpCircle}
            title="No support cases"
            description="Create a case if you need help"
            action={
              <Link href="/admin/support/new">
                <AdminButton>
                  <Plus className="h-4 w-4" />
                  New Case
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {cases.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold text-[#323130]">{c.subject}</p>
                  <p className="text-xs text-[#605e5c]">
                    {c.category} · {c.priority} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminBadge variant={getStatusVariant(c.status)}>
                    {c.status}
                  </AdminBadge>
                  <ChevronRight className="h-4 w-4 text-[#a19f9d]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
