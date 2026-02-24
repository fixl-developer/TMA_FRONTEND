"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getBranchById } from "@/shared/services/franchiseService"
import type { Branch } from "@/shared/services/franchiseService"
import { Building2, Lock, BarChart3 } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton, AdminBadge } from "@/shared/components/admin/AdminPageLayout"

const DEMO_TENANT = "tenant_001"

export default function BranchDetailPage() {
  const params = useParams()
  const branchId = params.branchId as string
  const [branch, setBranch] = useState<Branch | null>(null)

  useEffect(() => {
    getBranchById(branchId, DEMO_TENANT).then(setBranch)
  }, [branchId])

  if (!branch) {
    return (
      <AdminPageWrapper>
        <div className="py-12 text-center text-white/60">Loading branch…</div>
      </AdminPageWrapper>
    )
  }

  const lock = branch.policyLock

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title={branch.name}
        subtitle={`${branch.code} · ${branch.city}, ${branch.region}`}
        actions={
          <Link href="/admin/franchise">
            <AdminButton variant="outline">← Branches</AdminButton>
          </Link>
        }
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminCard>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/60">Status</h3>
              <Building2 className="h-5 w-5 text-[#d4ff00]" />
            </div>
            <AdminBadge
              variant={
                branch.status === "ACTIVE" ? "success" :
                branch.status === "PENDING" ? "warning" : "default"
              }
            >
              {branch.status}
            </AdminBadge>
          </AdminCard>
          <AdminCard>
            <h3 className="text-sm font-medium text-white/60 mb-2">Events</h3>
            <p className="text-2xl font-bold text-white">{branch.eventsCount ?? 0}</p>
          </AdminCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-[#d4ff00]" />
              <h3 className="text-lg font-semibold text-white">Policy lock</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-sm text-white">Customize branding</span>
                <span className={lock.canCustomizeBranding ? "text-emerald-400" : "text-white/40"}>
                  {lock.canCustomizeBranding ? "Allowed" : "Locked"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-sm text-white">Override pricing</span>
                <span className={lock.canOverridePricing ? "text-emerald-400" : "text-white/40"}>
                  {lock.canOverridePricing ? "Allowed" : "Locked"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-sm text-white">Add local events</span>
                <span className={lock.canAddLocalEvents ? "text-emerald-400" : "text-white/40"}>
                  {lock.canAddLocalEvents ? "Allowed" : "Locked"}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-[#d4ff00]" />
              <h3 className="text-lg font-semibold text-white">Global reporting</h3>
            </div>
            <p className="text-sm text-white/60 mb-3">
              Branch metrics roll up to tenant dashboard. View events, bookings, and revenue for this branch.
            </p>
            <AdminButton variant="outline" size="sm" disabled>
              View report (coming soon)
            </AdminButton>
          </AdminCard>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
