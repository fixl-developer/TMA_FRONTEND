"use client"

import { useEffect, useState } from "react"
import { getTenantRisk } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { ShieldCheck, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

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
      <AdminSectionHeader
        title="Risk View"
        subtitle="Tenant risk assessment and security factors"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </>
        ) : risk ? (
          <>
            <AdminStatCard
              title="Risk Level"
              value={risk.level}
              subtitle="Current assessment"
              icon={risk.level === "LOW" ? ShieldCheck : risk.level === "HIGH" ? ShieldAlert : AlertTriangle}
              color={getRiskColor(risk.level) as any}
            />
            <AdminStatCard
              title="Risk Score"
              value={`${risk.score}/100`}
              subtitle="Overall score"
              icon={ShieldCheck}
              color="blue"
            />
            <AdminStatCard
              title="Factors Checked"
              value={risk.factors.length}
              subtitle="Security factors"
              icon={CheckCircle}
              color="purple"
            />
            <AdminStatCard
              title="Status"
              value={risk.factors.filter((f) => f.status === "OK").length}
              subtitle="Passed checks"
              icon={CheckCircle}
              color="green"
            />
          </>
        ) : null}
      </div>

      {/* Risk Assessment Details */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white">Risk Assessment</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : risk ? (
          <div className="space-y-6">
            {/* Risk Level Summary */}
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/10">
                <ShieldCheck className="h-8 w-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold text-white">Risk Level:</p>
                  <AdminBadge variant={getRiskBadgeVariant(risk.level) as any}>
                    {risk.level}
                  </AdminBadge>
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Overall risk score: {risk.score}/100
                </p>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
                Security Factors
              </h4>
              <div className="space-y-3">
                {risk.factors.map((factor) => (
                  <div
                    key={factor.name}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-emerald-500/10 p-2">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="font-medium text-white">{factor.name}</span>
                    </div>
                    <AdminBadge variant="success">{factor.status}</AdminBadge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </AdminCard>
    </AdminPageWrapper>
  )
}
