"use client"

import { useState } from "react"
import { Scale, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const DSR_REQUESTS = [
  { id: "DSR-001", type: "DATA_ACCESS", tenant: "StarCast Agency", subject: "rahul.sharma@gmail.com", submitted: "2025-02-10", due: "2025-03-10", status: "PENDING" },
  { id: "DSR-002", type: "DATA_DELETION", tenant: "TalentPro Mumbai", subject: "priya.m@yahoo.com", submitted: "2025-02-05", due: "2025-03-05", status: "IN_PROGRESS" },
  { id: "DSR-003", type: "CORRECTION", tenant: "ModelMarket", subject: "ananya.k@outlook.com", submitted: "2025-01-20", due: "2025-02-18", status: "COMPLETED" },
  { id: "DSR-004", type: "DATA_PORTABILITY", tenant: "Fashion Forward Studio", subject: "deepak.v@proton.me", submitted: "2025-02-14", due: "2025-03-14", status: "PENDING" },
  { id: "DSR-005", type: "DATA_DELETION", tenant: "EventPro India", subject: "sneha.r@gmail.com", submitted: "2025-02-01", due: "2025-03-01", status: "COMPLETED" },
]

const CONSENT_CONFIGS = [
  { category: "Marketing Emails", enabled: true, tenants: 28, optOutRate: "4.2%" },
  { category: "Analytics Tracking", enabled: true, tenants: 32, optOutRate: "8.1%" },
  { category: "Third-Party Integrations", enabled: true, tenants: 14, optOutRate: "12.3%" },
  { category: "AI Model Training", enabled: false, tenants: 0, optOutRate: "N/A" },
  { category: "Cross-Tenant Data Sharing", enabled: false, tenants: 0, optOutRate: "N/A" },
]

const DSR_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  IN_PROGRESS: { label: "In Progress", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Completed", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
}

const DSR_TYPE: Record<string, string> = {
  DATA_ACCESS: "Access Request",
  DATA_DELETION: "Erasure (GDPR Art. 17)",
  CORRECTION: "Correction",
  DATA_PORTABILITY: "Portability",
}

export default function PrivacyPage() {
  const [requests, setRequests] = useState(DSR_REQUESTS)
  const [consent, setConsent] = useState(CONSENT_CONFIGS)

  const pending = requests.filter((r) => r.status === "PENDING").length
  const inProgress = requests.filter((r) => r.status === "IN_PROGRESS").length
  const completed = requests.filter((r) => r.status === "COMPLETED").length
  const overdue = requests.filter((r) => r.status !== "COMPLETED" && new Date(r.due) < new Date()).length

  function changeStatus(id: string, status: string) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  function toggleConsent(category: string) {
    setConsent((prev) => prev.map((c) => c.category === category ? { ...c, enabled: !c.enabled } : c))
  }

  function exportCsv() {
    const rows = [
      ["ID", "Type", "Tenant", "Subject", "Submitted", "Due", "Status"],
      ...requests.map((r) => [r.id, r.type, r.tenant, r.subject, r.submitted, r.due, r.status]),
    ]
    const a = document.createElement("a")
    a.href = "data:text/csv," + encodeURIComponent(rows.map((row) => row.join(",")).join("\n"))
    a.download = "dsr_requests.csv"
    a.click()
  }

  return (
    <PageLayout>
      <PageHeader
        title="Privacy"
        description="Data Subject Requests (DSR), consent management, and privacy policy compliance."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Scale className="h-3.5 w-3.5 text-blue-500" />
            GDPR / Privacy
          </span>
        }
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Export DSRs
          </Button>
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Pending DSRs", value: pending, icon: Clock, color: "text-amber-500" },
            { label: "In Progress", value: inProgress, icon: Scale, color: "text-blue-500" },
            { label: "Completed", value: completed, icon: CheckCircle, color: "text-emerald-500" },
            { label: "Overdue", value: overdue, icon: AlertTriangle, color: overdue > 0 ? "text-red-500" : "text-slate-400" },
          ].map((item) => (
            <Card key={item.label} className={`transition-colors ${item.label === "Overdue" && overdue > 0 ? "border-red-200" : "hover:border-blue-300"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${item.label === "Overdue" && overdue > 0 ? "text-red-600" : "text-slate-900"}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageSection title="Data Subject Requests">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Due</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.id}</td>
                        <td className="px-4 py-3 text-slate-700">{DSR_TYPE[r.type] ?? r.type}</td>
                        <td className="px-4 py-3 text-slate-600">{r.tenant}</td>
                        <td className={`px-4 py-3 text-xs ${r.status !== "COMPLETED" && new Date(r.due) < new Date() ? "text-red-600 font-medium" : "text-slate-500"}`}>{r.due}</td>
                        <td className="px-4 py-3">
                          <select
                            value={r.status}
                            onChange={(e) => changeStatus(r.id, e.target.value)}
                            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          >
                            {Object.keys(DSR_STATUS).map((s) => (
                              <option key={s} value={s}>{DSR_STATUS[s].label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </PageSection>
        </div>

        <div>
          <PageSection title="Consent Configuration">
            <Card>
              <CardContent className="divide-y divide-slate-100">
                {consent.map((c) => (
                  <div key={c.category} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{c.category}</p>
                      {c.enabled && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {c.tenants} tenants · {c.optOutRate} opt-out
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleConsent(c.category)}
                      className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors ${c.enabled ? "bg-blue-600" : "bg-slate-200"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${c.enabled ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </PageSection>
        </div>
      </div>
    </PageLayout>
  )
}
