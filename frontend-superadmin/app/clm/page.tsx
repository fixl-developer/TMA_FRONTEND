/**
 * Contract Lifecycle Management (CLM) Dashboard - Super Admin
 *
 * Overview of all contracts, templates, renewals, and compliance.
 * Phase 2: Contract management with comprehensive tracking.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
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
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import Link from "next/link"

type Contract = {
  _id: string
  templateName: string
  tenantId: string
  tenantName: string
  partyA: string
  partyB: string
  status: string
  signedDate: string | null
  effectiveDate: string
  expiryDate: string
  value: number
  currency: string
  complianceStatus: string
  autoRenewal: boolean
}

const statusColors = {
  ACTIVE: "bg-[#107c10] text-white border-[#107c10]",
  PENDING_SIGNATURE: "bg-[#ffb900] text-[#323130] border-[#ffb900]",
  EXPIRED: "bg-[#a19f9d] text-white border-[#a19f9d]",
  TERMINATED: "bg-[#d13438] text-white border-[#d13438]",
}

const complianceColors = {
  COMPLIANT: "bg-[#107c10] text-white border-[#107c10]",
  REVIEW_REQUIRED: "bg-[#ffb900] text-[#323130] border-[#ffb900]",
  PENDING: "bg-[#0078d4] text-white border-[#0078d4]",
  EXPIRED: "bg-[#a19f9d] text-white border-[#a19f9d]",
}

export default function CLMDashboard() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setContracts(clmData.activeContracts as Contract[])
    setLoading(false)
  }, [])

  const metrics = useMemo(() => {
    const analytics = clmData.analytics
    const expiringIn30Days = contracts.filter(c => {
      const daysUntilExpiry = Math.floor((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30
    }).length

    const expiringIn90Days = contracts.filter(c => {
      const daysUntilExpiry = Math.floor((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry > 0 && daysUntilExpiry <= 90
    }).length

    return {
      ...analytics,
      expiringIn30Days,
      expiringIn90Days,
    }
  }, [contracts])

  const contractsByStatus = useMemo(() => {
    return Object.entries(metrics.contractsByStatus).map(([status, count]) => ({
      label: status.replace(/_/g, " "),
      value: count as number,
    }))
  }, [metrics])

  const contractsByCategory = useMemo(() => {
    return Object.entries(metrics.contractsByCategory).map(([category, count]) => ({
      label: category.replace(/_/g, " "),
      value: count as number,
    }))
  }, [metrics])

  return (
    <PageLayout>
      <PageHeader
        title="Contract Lifecycle Management"
        description="Manage contracts, templates, renewals, and compliance across all tenants."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            CLM
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Active contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.totalActiveContracts}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Currently active across all tenants
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total contract value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : formatCurrency(metrics.totalContractValue * 100, "INR")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Combined value of active contracts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expiring soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.expiringIn90Days}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Contracts expiring in next 90 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compliance rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-blue-600">
                {loading ? "—" : `${(metrics.complianceRate * 100).toFixed(0)}%`}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Contracts meeting compliance standards
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Quick actions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/clm/templates">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-slate-800">Templates</p>
                <p className="text-xs text-slate-500">{clmData.contractTemplates.length} templates</p>
              </div>
            </Button>
          </Link>
          <Link href="/clm/active">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <p className="font-medium text-slate-800">Active contracts</p>
                <p className="text-xs text-slate-500">{metrics.totalActiveContracts} active</p>
              </div>
            </Button>
          </Link>
          <Link href="/clm/renewals">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <div className="text-left">
                <p className="font-medium text-slate-800">Renewals</p>
                <p className="text-xs text-slate-500">{clmData.renewalPipeline.length} in pipeline</p>
              </div>
            </Button>
          </Link>
          <Link href="/clm/compliance">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <div className="text-left">
                <p className="font-medium text-slate-800">Compliance</p>
                <p className="text-xs text-slate-500">{clmData.complianceChecks.length} checks</p>
              </div>
            </Button>
          </Link>
        </div>
      </PageSection>

      <PageSection title="Contract distribution">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>By status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <RechartsPie data={contractsByStatus} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>By category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-slate-500">Loading…</p>
              ) : (
                <RechartsPie data={contractsByCategory} />
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Recent contracts">
        <Card>
          <CardHeader>
            <CardTitle>Latest contract activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-3">
                {contracts.slice(0, 5).map((contract) => (
                  <div
                    key={contract._id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-800">{contract.templateName}</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          statusColors[contract.status as keyof typeof statusColors]
                        }`}>
                          {contract.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {contract.partyA} ↔ {contract.partyB}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>Tenant: {getTenantName(contract.tenantId)}</span>
                        <span>Value: {formatCurrency(contract.value * 100, contract.currency)}</span>
                        <span>Expires: {new Date(contract.expiryDate).toLocaleDateString()}</span>
                        {contract.autoRenewal && <span className="text-emerald-600">Auto-renewal</span>}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                      complianceColors[contract.complianceStatus as keyof typeof complianceColors]
                    }`}>
                      {contract.complianceStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Upcoming renewals">
        <Card>
          <CardHeader>
            <CardTitle>Renewal pipeline</CardTitle>
            <p className="text-sm text-slate-500">
              Contracts requiring renewal attention
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-2">
                {clmData.renewalPipeline
                  .filter(r => r.status !== "EXPIRED")
                  .slice(0, 4)
                  .map((renewal) => (
                    <div
                      key={renewal._id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{renewal.contractName}</p>
                        <p className="text-xs text-slate-500">
                          Expires: {new Date(renewal.currentExpiryDate).toLocaleDateString()} · 
                          Probability: {renewal.renewalProbability}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatCurrency(renewal.proposedValue * 100, "INR")}
                        </p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          renewal.status === "NEGOTIATION" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                          "bg-[#0078d4] text-white border-[#0078d4]"
                        }`}>
                          {renewal.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Compliance alerts">
        <Card>
          <CardHeader>
            <CardTitle>Pending compliance checks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-2">
                {clmData.complianceChecks.map((check) => (
                  <div
                    key={check._id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-800">{check.checkType.replace(/_/g, " ")}</p>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          check.status === "OVERDUE" ? "bg-[#d13438] text-white border-[#d13438]" :
                          check.status === "PENDING" ? "bg-[#ffb900] text-[#323130] border-[#ffb900]" :
                          "bg-[#0078d4] text-white border-[#0078d4]"
                        }`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">
                        Scheduled: {new Date(check.scheduledDate).toLocaleDateString()} · 
                        Assigned to: {check.assignedTo}
                      </p>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {check.checkpoints.slice(0, 2).map((checkpoint, idx) => (
                          <li key={idx}>• {checkpoint}</li>
                        ))}
                        {check.checkpoints.length > 2 && (
                          <li className="text-slate-500">+ {check.checkpoints.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                    <span className={`shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${
                      check.priority === "HIGH" ? "bg-[#d13438] text-white border-[#d13438]" :
                      "bg-[#ffb900] text-[#323130] border-[#ffb900]"
                    }`}>
                      {check.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
