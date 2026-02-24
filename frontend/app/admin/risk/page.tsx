"use client"

import { useEffect, useState } from "react"
import { getTenantRisk } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { ShieldCheck, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminBadge,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function AdminRiskPage() {
  const { tenantId } = useTenant()
  const [risk, setRisk] = useState<Awaited<ReturnType<typeof getTenantRisk>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantRisk(tenantId).then((d) => {
      setRisk(d)
      setLoading(false)
    })
  }, [tenantId])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "green"
      case "MEDIUM":
        return "yellow"
      case "HIGH":
        return "pink"
      default:
        return "purple"
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "LOW":
        return "success"
      case "MEDIUM":
        return "warning"
      case "HIGH":
        return "danger"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Risk View"
        subtitle="Tenant risk assessment and security factors"
      >
      <AdminStatsGrid columns={4}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </>
        ) : risk ? (
          <>
            <AdminStatCard
              label="Risk Level"
              value={risk.level}
              subtitle="Current assessment"
              icon={risk.level === "LOW" ? ShieldCheck : risk.level === "HIGH" ? ShieldAlert : AlertTriangle}
              color={getRiskColor(risk.level) as any}
            />
            <AdminStatCard
              label="Risk Score"
              value={`${risk.score}/100`}
              subtitle="Overall score"
              icon={ShieldCheck}
              color="blue"
            />
            <AdminStatCard
              label="Factors Checked"
              value={risk.factors.length}
              subtitle="Security factors"
              icon={CheckCircle}
              color="purple"
            />
            <AdminStatCard
              label="Status"
              value={risk.factors.filter((f) => f.status === "OK").length}
              subtitle="Passed checks"
              icon={CheckCircle}
              color="green"
            />
          </>
        ) : null}
      </AdminStatsGrid>

      {/* Risk Assessment Details */}
      <AdminCard title="Risk Assessment">
        {loading ? (
          <AdminLoading rows={3} />
        ) : risk ? (
          <div className="space-y-6">
            {/* Risk Level Summary */}
            <div className="flex items-center gap-4 rounded border border-[#edebe9] bg-white p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded bg-[#8764b8] text-white">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold text-[#323130]">Risk Level:</p>
                  <AdminBadge variant={getRiskBadgeVariant(risk.level) as any}>
                    {risk.level}
                  </AdminBadge>
                </div>
                <p className="mt-1 text-xs text-[#605e5c]">
                  Overall risk score: {risk.score}/100
                </p>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#605e5c]">
                Security Factors
              </h4>
              <div className="space-y-2">
                {risk.factors.map((factor) => (
                  <div
                    key={factor.name}
                    className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-[#107c10] p-2 text-white">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-[#323130]">{factor.name}</span>
                    </div>
                    <AdminBadge variant="success">{factor.status}</AdminBadge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
