/**
 * Renewal Pipeline - Super Admin
 *
 * Track and manage contract renewals.
 */

"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Calendar } from "lucide-react"
import clmData from "@/data/seed/clm.json"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getTenantName } from "@/shared/services/userService"
import { formatCurrency } from "@/shared/lib/utils"

type Renewal = {
  _id: string
  contractName: string
  tenantId: string
  currentExpiryDate: string
  renewalDueDate: string
  daysUntilExpiry: number
  status: string
  autoRenewal: boolean
  currentValue: number
  proposedValue: number
  renewalProbability: string
  ownerEmail: string
  notes: string
}

const statusColors = {
  UPCOMING: "bg-blue-50 text-blue-700 border-blue-200",
  NEGOTIATION: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
}

const probabilityColors = {
  HIGH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-rose-50 text-rose-700 border-rose-200",
}

export default function RenewalPipeline() {
  const [renewals, setRenewals] = useState<Renewal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setRenewals(clmData.renewalPipeline as Renewal[])
    setLoading(false)
  }, [])

  const metrics = {
    total: renewals.length,
    upcoming: renewals.filter(r => r.status === "UPCOMING").length,
    negotiation: renewals.filter(r => r.status === "NEGOTIATION").length,
    totalValue: renewals.reduce((sum, r) => sum + r.proposedValue, 0),
  }

  return (
    <PageLayout>
      <PageHeader
        title="Renewal Pipeline"
        description="Track and manage contract renewals across all tenants."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            {renewals.filter(r => r.status !== "EXPIRED").length} Active
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                In renewal pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-blue-600">
                {loading ? "—" : metrics.upcoming}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Scheduled for renewal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In negotiation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.negotiation}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Active negotiations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pipeline value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : formatCurrency(metrics.totalValue * 100, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Total proposed value
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Renewal pipeline">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <div className="space-y-4">
            {renewals.map((renewal) => (
              <Card key={renewal._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{renewal.contractName}</CardTitle>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          statusColors[renewal.status as keyof typeof statusColors]
                        }`}>
                          {renewal.status}
                        </span>
                        {renewal.autoRenewal && (
                          <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Auto-renewal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        Tenant: {getTenantName(renewal.tenantId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-800">
                        {formatCurrency(renewal.proposedValue * 100, "INR")}
                      </p>
                      <p className="text-xs text-slate-500">
                        Current: {formatCurrency(renewal.currentValue * 100, "INR")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Timeline</p>
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <p>Expires: {new Date(renewal.currentExpiryDate).toLocaleDateString()}</p>
                          <p>Renewal due: {new Date(renewal.renewalDueDate).toLocaleDateString()}</p>
                          <p className={renewal.daysUntilExpiry < 0 ? "text-rose-600 font-medium" : ""}>
                            {renewal.daysUntilExpiry < 0 
                              ? `Expired ${Math.abs(renewal.daysUntilExpiry)} days ago`
                              : `${renewal.daysUntilExpiry} days until expiry`
                            }
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Renewal probability</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          probabilityColors[renewal.renewalProbability as keyof typeof probabilityColors]
                        }`}>
                          {renewal.renewalProbability}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Owner</p>
                        <p className="text-xs text-slate-600">{renewal.ownerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Notes</p>
                        <p className="text-xs text-slate-600">{renewal.notes}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View contract
                        </Button>
                        <Button size="sm" className="flex-1">
                          Start renewal
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
