"use client"

import { useEffect, useState } from "react"
import { getComplianceStatus, getDsrRequests, getConsents } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { ShieldCheck, Clock, FileCheck, UserX, Plus, CheckCircle2, XCircle, Shield, Database } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import { cn } from "@/shared/lib/utils"

type TabId = "overview" | "consent" | "dsr" | "readiness"

const DSR_TYPE_LABELS: Record<string, string> = {
  ACCESS: "Data access",
  ERASURE: "Right to erasure",
  PORTABILITY: "Data portability",
  RECTIFICATION: "Rectification",
}

export default function AdminCompliancePage() {
  const { tenantId } = useTenant()
  const [data, setData] = useState<Awaited<ReturnType<typeof getComplianceStatus>> | null>(null)
  const [dsrRequests, setDsrRequests] = useState<any[]>([])
  const [consents, setConsents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [dsrModalOpen, setDsrModalOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      getComplianceStatus(),
      getDsrRequests(tenantId),
      getConsents(tenantId),
    ]).then(([d, dsr, cons]) => {
      setData(d)
      setDsrRequests(dsr)
      setConsents(cons)
      setLoading(false)
    })
  }, [tenantId])

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "consent", label: "Consent" },
    { id: "dsr", label: "DSR Requests" },
    { id: "readiness", label: "DPDP / GDPR" },
  ]

  const grantedConsents = consents.filter((c) => c.status === "GRANTED").length
  const pendingDsr = dsrRequests.filter((r) => r.status === "PENDING").length

  const getDsrBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success"
      case "PENDING":
        return "warning"
      case "IN_PROGRESS":
        return "info"
      case "REJECTED":
        return "danger"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Compliance"
        subtitle="Consent, retention, data subject rights, DPDP/GDPR"
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Status"
          value={data?.status ?? "—"}
          subtitle="Compliance status"
          icon={ShieldCheck}
          color="green"
        />
        <AdminStatCard
          title="Consents"
          value={consents.length}
          subtitle={`${grantedConsents} granted`}
          icon={FileCheck}
          color="blue"
        />
        <AdminStatCard
          title="DSR Requests"
          value={dsrRequests.length}
          subtitle={`${pendingDsr} pending`}
          icon={UserX}
          color="purple"
        />
        <AdminStatCard
          title="Frameworks"
          value={data?.frameworks.length ?? 0}
          subtitle="Implemented"
          icon={Shield}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === t.id
                ? "border-[#d4ff00] text-[#d4ff00]"
                : "border-transparent text-white/50 hover:text-white/70"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <AdminCard>
          <h3 className="mb-6 text-lg font-bold text-white">Compliance Status</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Status Summary */}
              <div className="flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-400">Status: {data.status}</p>
                  <p className="text-sm text-emerald-400/70">All frameworks implemented</p>
                </div>
              </div>

              {/* Frameworks */}
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
                  Compliance Frameworks
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.frameworks.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                    >
                      <p className="font-medium text-white">{f.name}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {f.implemented}/{f.controls} controls
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-[#d4ff00]"
                          style={{ width: `${(f.implemented / f.controls) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retention Policies */}
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
                  Retention Policies
                </h4>
                <div className="space-y-2">
                  {data.retentionPolicies.map((r: any) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-white">{r.entityType}</span>
                      </div>
                      <span className="text-sm text-white/60">{r.retentionMonths} months</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </AdminCard>
      )}

      {/* Consent Tab */}
      {activeTab === "consent" && (
        <AdminCard>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <FileCheck className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Consent Tracking</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : consents.length === 0 ? (
            <p className="py-12 text-center text-white/50">No consent records for this tenant.</p>
          ) : (
            <div className="space-y-3">
              {consents.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    {c.status === "GRANTED" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-white/40" />
                    )}
                    <div>
                      <p className="font-medium text-white">{c.type}</p>
                      <p className="text-xs text-white/50">
                        User: {c.userId} · {c.status} · v{c.version}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-white/50">
                    {c.status === "GRANTED"
                      ? new Date(c.grantedAt).toLocaleDateString()
                      : c.revokedAt
                      ? new Date(c.revokedAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* DSR Tab */}
      {activeTab === "dsr" && (
        <AdminCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <UserX className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Data Subject Rights</h3>
            </div>
            <AdminButton size="sm" onClick={() => setDsrModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </AdminButton>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : dsrRequests.length === 0 ? (
            <p className="py-12 text-center text-white/50">No DSR requests yet.</p>
          ) : (
            <div className="space-y-3">
              {dsrRequests.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">
                      {DSR_TYPE_LABELS[r.type] ?? r.type}
                    </p>
                    <p className="text-xs text-white/50">
                      User: {r.userId} · Requested {new Date(r.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <AdminBadge variant={getDsrBadgeVariant(r.status) as any}>
                    {r.status}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Readiness Tab */}
      {activeTab === "readiness" && (
        <AdminCard>
          <h3 className="mb-6 text-lg font-bold text-white">DPDP / GDPR Readiness</h3>
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
              <p className="font-medium text-emerald-400">Configuration Complete</p>
              <p className="mt-1 text-sm text-emerald-400/70">
                Retention policies, consent tracking, and DSR request flows are configured for DPDP
                (India) and GDPR (EU) compliance.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  <p className="font-medium text-white">DPDP (India)</p>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Consent management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Data principal rights (access, erasure, portability)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Retention & purpose limitation</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <p className="font-medium text-white">GDPR (EU)</p>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Lawful basis & consent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Data subject rights (Art. 15–20)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d4ff00]">•</span>
                    <span>Retention & accountability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* DSR Modal */}
      {dsrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0b2e] to-[#3d1f47] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">New DSR Request</h3>
            <p className="mt-2 text-sm text-white/70">
              Data subject rights requests (access, erasure, portability) are submitted by users. As
              an admin, you can view and process them here.
            </p>
            <div className="mt-6 flex justify-end">
              <AdminButton variant="secondary" onClick={() => setDsrModalOpen(false)}>
                Close
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </AdminPageWrapper>
  )
}
