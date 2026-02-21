"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getBranchById } from "@/shared/services/franchiseService"
import type { Branch } from "@/shared/services/franchiseService"
import { Building2, Lock, BarChart3 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageLoading } from "@/shared/components/ui/page-loading"

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
      <AgenciesPage>
        <PageBanner title="Branch" variant="admin" backgroundImage="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80" />
        <PageLoading message="Loading branch…" />
      </AgenciesPage>
    )
  }

  const lock = branch.policyLock

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/franchise">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
            ← Branches
          </Button>
        </Link>
        <PageBanner
          title={branch.name}
          subtitle={`${branch.code} · ${branch.city}, ${branch.region}`}
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80"
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status</CardTitle>
            <Building2 className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <span
              className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${
                branch.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                branch.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {branch.status}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">{branch.eventsCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Policy lock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <span className="text-sm">Customize branding</span>
                <span className={lock.canCustomizeBranding ? "text-emerald-600" : "text-slate-400"}>
                  {lock.canCustomizeBranding ? "Allowed" : "Locked"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <span className="text-sm">Override pricing</span>
                <span className={lock.canOverridePricing ? "text-emerald-600" : "text-slate-400"}>
                  {lock.canOverridePricing ? "Allowed" : "Locked"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <span className="text-sm">Add local events</span>
                <span className={lock.canAddLocalEvents ? "text-emerald-600" : "text-slate-400"}>
                  {lock.canAddLocalEvents ? "Allowed" : "Locked"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Global reporting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Branch metrics roll up to tenant dashboard. View events, bookings, and revenue for this branch.
            </p>
            <Button variant="outline" size="sm" className="mt-3" disabled>
              View report (coming soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </AgenciesPage>
  )
}
