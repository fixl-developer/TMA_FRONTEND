"use client"

import { useEffect, useState } from "react"
import { Headphones, Clock, CheckCircle, AlertTriangle, MessageSquare, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { getSupportCases } from "@/shared/services/governanceService"
import { getTenantName } from "@/shared/services/userService"

const PRIORITY_CONFIG: Record<string, { label: string; cls: string }> = {
  critical: { label: "Critical", cls: "border-red-200 bg-red-50 text-red-700" },
  high: { label: "High", cls: "border-orange-200 bg-orange-50 text-orange-700" },
  medium: { label: "Medium", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  low: { label: "Low", cls: "border-slate-200 bg-slate-50 text-slate-600" },
  CRITICAL: { label: "Critical", cls: "border-red-200 bg-red-50 text-red-700" },
  HIGH: { label: "High", cls: "border-orange-200 bg-orange-50 text-orange-700" },
  MEDIUM: { label: "Medium", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  LOW: { label: "Low", cls: "border-slate-200 bg-slate-50 text-slate-600" },
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  OPEN: { label: "Open", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  IN_PROGRESS: { label: "In Progress", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  RESOLVED: { label: "Resolved", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  CLOSED: { label: "Closed", cls: "border-slate-200 bg-slate-50 text-slate-500" },
}

const NOTES_KEY = "sa_support_notes"

export default function SupportPage() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED">("ALL")
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState<Record<string, string[]>>({})

  useEffect(() => {
    getSupportCases().then((data) => {
      setCases(data)
      setLoading(false)
    })
    const stored = localStorage.getItem(NOTES_KEY)
    if (stored) setNotes(JSON.parse(stored))
  }, [])

  function addNote(id: string) {
    if (!note.trim()) return
    const updated = { ...notes, [id]: [...(notes[id] || []), note.trim()] }
    setNotes(updated)
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated))
    setNote("")
  }

  function changeStatus(id: string, status: string) {
    setCases((prev) => prev.map((c) => c._id === id ? { ...c, status } : c))
  }

  function exportCsv() {
    const rows = [
      ["ID", "Tenant", "Subject", "Category", "Priority", "Status"],
      ...cases.map((c) => [c._id, getTenantName(c.tenantId), c.subject, c.category, c.priority, c.status]),
    ]
    const a = document.createElement("a")
    a.href = "data:text/csv," + encodeURIComponent(rows.map((r) => r.join(",")).join("\n"))
    a.download = "support_cases.csv"
    a.click()
  }

  const filtered = filter === "ALL" ? cases : cases.filter((c) => c.status === filter)
  const openCount = cases.filter((c) => c.status === "OPEN").length
  const inProgressCount = cases.filter((c) => c.status === "IN_PROGRESS").length
  const resolvedCount = cases.filter((c) => c.status === "RESOLVED").length
  const criticalCount = cases.filter((c) => ["critical", "CRITICAL"].includes(c.priority)).length

  return (
    <PageLayout>
      <PageHeader
        title="Support Cases"
        description="Platform-wide support cases raised by tenants and their teams."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Headphones className="h-3.5 w-3.5 text-blue-500" />
            Support
          </span>
        }
        actions={
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Open Cases", value: openCount, icon: Clock, color: "text-amber-500" },
            { label: "In Progress", value: inProgressCount, icon: MessageSquare, color: "text-blue-500" },
            { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-emerald-500" },
            { label: "Critical Priority", value: criticalCount, icon: AlertTriangle, color: criticalCount > 0 ? "text-red-500" : "text-slate-400" },
          ].map((item) => (
            <Card key={item.label} className={`transition-colors ${item.label === "Critical Priority" && criticalCount > 0 ? "border-red-200" : "hover:border-blue-300"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${item.label === "Critical Priority" && criticalCount > 0 ? "text-red-600" : "text-slate-900"}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      {/* Status filter tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "ALL", label: "All Cases", count: cases.length },
            { id: "OPEN", label: "Open", count: openCount },
            { id: "IN_PROGRESS", label: "In Progress", count: inProgressCount },
            { id: "RESOLVED", label: "Resolved", count: resolvedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`pb-3 text-sm font-medium transition ${
                filter === tab.id ? "border-b-2 border-blue-500 text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{tab.count}</span>
            </button>
          ))}
        </nav>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Headphones className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-slate-500">No cases found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <>
                    <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{c._id.slice(-6)}</td>
                      <td className="px-4 py-3 text-slate-700">{getTenantName(c.tenantId)}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{c.subject}</td>
                      <td className="px-4 py-3 text-slate-500">{c.category}</td>
                      <td className="px-4 py-3">
                        {PRIORITY_CONFIG[c.priority] && (
                          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${PRIORITY_CONFIG[c.priority].cls}`}>
                            {PRIORITY_CONFIG[c.priority].label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={(e) => changeStatus(c._id, e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                          {Object.keys(STATUS_CONFIG).map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCase(selectedCase === c._id ? null : c._id)}
                          className="h-7 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          Notes ({(notes[c._id] || []).length})
                        </Button>
                      </td>
                    </tr>
                    {selectedCase === c._id && (
                      <tr key={`${c._id}_notes`} className="bg-slate-50">
                        <td colSpan={7} className="px-6 py-3">
                          <div className="space-y-2">
                            {(notes[c._id] || []).map((n, i) => (
                              <p key={i} className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                {n}
                              </p>
                            ))}
                            <div className="flex gap-2">
                              <input
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note…"
                                className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                onKeyDown={(e) => e.key === "Enter" && addNote(c._id)}
                              />
                              <Button size="sm" onClick={() => addNote(c._id)}>Add</Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  )
}
