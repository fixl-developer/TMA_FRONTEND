"use client"

import { useState } from "react"
import { FileText, Archive, Clock, AlertTriangle, Save } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const RETENTION_STORAGE_KEY = "sa_retention_policies"

const DEFAULT_POLICIES = [
  { id: "ret_001", entity: "User Profiles", category: "PII", retentionDays: 1095, deleteAction: "ANONYMIZE", framework: "GDPR", active: true },
  { id: "ret_002", entity: "Booking Records", category: "FINANCIAL", retentionDays: 2555, deleteAction: "ARCHIVE", framework: "IT Act", active: true },
  { id: "ret_003", entity: "Payment Transactions", category: "FINANCIAL", retentionDays: 2555, deleteAction: "ARCHIVE", framework: "RBI", active: true },
  { id: "ret_004", entity: "Content Posts", category: "CONTENT", retentionDays: 365, deleteAction: "DELETE", framework: "Platform", active: true },
  { id: "ret_005", entity: "Audit Logs", category: "COMPLIANCE", retentionDays: 3650, deleteAction: "ARCHIVE", framework: "ISO 27001", active: true },
  { id: "ret_006", entity: "Support Cases", category: "OPERATIONAL", retentionDays: 730, deleteAction: "ARCHIVE", framework: "Platform", active: true },
  { id: "ret_007", entity: "Chat Messages", category: "COMMUNICATION", retentionDays: 180, deleteAction: "DELETE", framework: "Platform", active: false },
  { id: "ret_008", entity: "AI Training Data", category: "AI", retentionDays: 0, deleteAction: "DELETE", framework: "EU AI Act", active: false },
]

const DELETE_ACTIONS = ["ANONYMIZE", "ARCHIVE", "DELETE"]
const FRAMEWORKS = ["GDPR", "IT Act", "RBI", "ISO 27001", "EU AI Act", "Platform"]

function getActionBadge(action: string) {
  const map: Record<string, string> = {
    ANONYMIZE: "border-purple-200 bg-purple-50 text-purple-700",
    ARCHIVE: "border-blue-200 bg-blue-50 text-blue-700",
    DELETE: "border-red-200 bg-red-50 text-red-700",
  }
  return map[action] || "border-slate-200 bg-slate-50 text-slate-600"
}

function getCategoryBadge(cat: string) {
  const map: Record<string, string> = {
    PII: "border-amber-200 bg-amber-50 text-amber-700",
    FINANCIAL: "border-emerald-200 bg-emerald-50 text-emerald-700",
    COMPLIANCE: "border-blue-200 bg-blue-50 text-blue-700",
    CONTENT: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OPERATIONAL: "border-slate-200 bg-slate-50 text-slate-600",
    COMMUNICATION: "border-cyan-200 bg-cyan-50 text-cyan-700",
    AI: "border-rose-200 bg-rose-50 text-rose-700",
  }
  return map[cat] || "border-slate-200 bg-slate-50 text-slate-600"
}

export default function RetentionPage() {
  const [policies, setPolicies] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RETENTION_STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    }
    return DEFAULT_POLICIES
  })
  const [dirty, setDirty] = useState(false)

  function updatePolicy(id: string, field: string, value: any) {
    setPolicies((prev: any[]) => prev.map((p: any) => p.id === id ? { ...p, [field]: value } : p))
    setDirty(true)
  }

  function save() {
    localStorage.setItem(RETENTION_STORAGE_KEY, JSON.stringify(policies))
    setDirty(false)
  }

  const activeCount = policies.filter((p: any) => p.active).length
  const avgDays = Math.round(policies.filter((p: any) => p.active && p.retentionDays > 0).reduce((s: number, p: any) => s + p.retentionDays, 0) / activeCount)
  const withDelete = policies.filter((p: any) => p.deleteAction === "DELETE").length
  const frameworks = [...new Set(policies.map((p: any) => p.framework))].length

  return (
    <PageLayout>
      <PageHeader
        title="Data Retention"
        description="Configure data retention periods, deletion actions, and compliance framework mappings."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Archive className="h-3.5 w-3.5 text-blue-500" />
            Retention Policies
          </span>
        }
        actions={
          dirty ? (
            <Button size="sm" onClick={save}>
              <Save className="mr-1.5 h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              <Save className="mr-1.5 h-4 w-4" /> Saved
            </Button>
          )
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Active Policies", value: activeCount, icon: FileText, color: "text-blue-500" },
            { label: "Avg Retention", value: `${Math.round(avgDays / 365)}y ${Math.round((avgDays % 365) / 30)}m`, icon: Clock, color: "text-indigo-500" },
            { label: "Hard Delete Rules", value: withDelete, icon: AlertTriangle, color: "text-red-500" },
            { label: "Compliance Frameworks", value: frameworks, icon: Archive, color: "text-emerald-500" },
          ].map((item) => (
            <Card key={item.label} className="transition-colors hover:border-blue-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      <PageSection title="Retention Policies">
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Entity</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Retention (days)</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">After Expiry</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Framework</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Active</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p: any) => (
                  <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 ${!p.active ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.entity}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getCategoryBadge(p.category)}`}>{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={p.retentionDays}
                        onChange={(e) => updatePolicy(p.id, "retentionDays", parseInt(e.target.value) || 0)}
                        className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-center text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        min={0}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.deleteAction}
                        onChange={(e) => updatePolicy(p.id, "deleteAction", e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        {DELETE_ACTIONS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={p.framework}
                        onChange={(e) => updatePolicy(p.id, "framework", e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        {FRAMEWORKS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updatePolicy(p.id, "active", !p.active)}
                        className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors ${p.active ? "bg-blue-600" : "bg-slate-200"}`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
