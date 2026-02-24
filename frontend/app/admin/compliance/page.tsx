"use client"

import { useEffect, useState } from "react"
import { getComplianceStatus, getDsrRequests, getConsents } from "@/shared/services/adminService"
import { useTenant } from "@/shared/context/TenantContext"
import { ShieldCheck, Clock, FileCheck, UserX, Plus, CheckCircle2, XCircle, Shield, Database } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Compliance"
        subtitle="Consent, retention, data subject rights, DPDP/GDPR"
      >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Status"
          value={data?.status ?? "—"}
          subtitle="Compliance status"
          icon={ShieldCheck}
          color="green"
        />
        <AdminStatCard
          label="Consents"
          value={consents.length}
          subtitle={`${grantedConsents} granted`}
          icon={FileCheck}
          color="blue"
        />
        <AdminStatCard
          label="DSR Requests"
          value={dsrRequests.length}
          subtitle={`${pendingDsr} pending`}
          icon={UserX}
          color="purple"
        />
        <AdminStatCard
          label="Frameworks"
          value={data?.frameworks.length ?? 0}
          subtitle="Implemented"
          icon={Shield}
          color="yellow"
        />
      </AdminStatsGrid>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[#edebe9]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? "border-b-2 border-[#0078d4] text-[#0078d4]"
                : "text-[#605e5c] hover:text-[#323130]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <AdminCard title="Compliance Status">
          {loading ? (
            <AdminLoading rows={3} />
          ) : data ? (
            <div className="space-y-6">
              {/* Status Summary */}
              <div className="flex items-center gap-4 rounded border border-[#107c10] bg-[#dff6dd] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-[#107c10] text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#107c10]">Status: {data.status}</p>
                  <p className="text-xs text-[#605e5c]">All frameworks implemented</p>
                </div>
              </div>

              {/* Frameworks */}
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#605e5c]">
                  Compliance Frameworks
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.frameworks.map((f) => (
                    <div
                      key={f.name}
                      className="rounded border border-[#edebe9] bg-white p-4 transition-all hover:shadow-sm"
                    >
                      <p className="text-xs font-semibold text-[#323130]">{f.name}</p>
                      <p className="mt-1 text-xs text-[#605e5c]">
                        {f.implemented}/{f.controls} controls
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f3f2f1]">
                        <div
                          className="h-full bg-[#107c10]"
                          style={{ width: `${(f.implemented / f.controls) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retention Policies */}
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#605e5c]">
                  Retention Policies
                </h4>
                <div className="space-y-2">
                  {data.retentionPolicies.map((r: any) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between rounded border border-[#edebe9] bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-[#8764b8]" />
                        <span className="text-xs text-[#323130]">{r.entityType}</span>
                      </div>
                      <span className="text-xs text-[#605e5c]">{r.retentionMonths} months</span>
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
        <AdminCard title="Consent Tracking">
          {loading ? (
            <AdminLoading rows={3} />
          ) : consents.length === 0 ? (
            <p className="py-12 text-center text-xs text-[#605e5c]">No consent records for this tenant.</p>
          ) : (
            <div className="space-y-2">
              {consents.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-white px-4 py-3 transition-all hover:bg-[#f3f2f1]"
                >
                  <div className="flex items-center gap-3">
                    {c.status === "GRANTED" ? (
                      <CheckCircle2 className="h-5 w-5 text-[#107c10]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[#a19f9d]" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-[#323130]">{c.type}</p>
                      <p className="text-xs text-[#605e5c]">
                        User: {c.userId} · {c.status} · v{c.version}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#605e5c]">
                    {c.status === "GRANTED"
                      ? new Date(c.grantedAt).toLocaleDateString("en-IN")
                      : c.revokedAt
                      ? new Date(c.revokedAt).toLocaleDateString("en-IN")
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
        <AdminCard
          title="Data Subject Rights"
          actions={
            <AdminButton size="sm" onClick={() => setDsrModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Request
            </AdminButton>
          }
        >
          {loading ? (
            <AdminLoading rows={3} />
          ) : dsrRequests.length === 0 ? (
            <p className="py-12 text-center text-xs text-[#605e5c]">No DSR requests yet.</p>
          ) : (
            <div className="space-y-2">
              {dsrRequests.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-white px-4 py-3 transition-all hover:bg-[#f3f2f1]"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#323130]">
                      {DSR_TYPE_LABELS[r.type] ?? r.type}
                    </p>
                    <p className="text-xs text-[#605e5c]">
                      User: {r.userId} · Requested {new Date(r.requestedAt).toLocaleDateString("en-IN")}
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
        <AdminCard title="DPDP / GDPR Readiness">
          <div className="space-y-6">
            <div className="rounded border border-[#107c10] bg-[#dff6dd] p-4">
              <p className="text-xs font-semibold text-[#107c10]">Configuration Complete</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Retention policies, consent tracking, and DSR request flows are configured for DPDP
                (India) and GDPR (EU) compliance.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-[#edebe9] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#8764b8]" />
                  <p className="text-xs font-semibold text-[#323130]">DPDP (India)</p>
                </div>
                <ul className="space-y-2 text-xs text-[#605e5c]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
                    <span>Consent management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
                    <span>Data principal rights (access, erasure, portability)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
                    <span>Retention & purpose limitation</span>
                  </li>
                </ul>
              </div>
              <div className="rounded border border-[#edebe9] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#0078d4]" />
                  <p className="text-xs font-semibold text-[#323130]">GDPR (EU)</p>
                </div>
                <ul className="space-y-2 text-xs text-[#605e5c]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
                    <span>Lawful basis & consent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
                    <span>Data subject rights (Art. 15–20)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#107c10]">•</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded border border-[#edebe9] bg-white p-6 shadow-lg">
            <h3 className="text-base font-semibold text-[#323130]">New DSR Request</h3>
            <p className="mt-2 text-xs text-[#605e5c]">
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
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
