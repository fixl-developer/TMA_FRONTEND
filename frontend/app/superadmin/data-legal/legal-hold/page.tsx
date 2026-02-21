"use client"

import { useState } from "react"
import { Scale, Lock, AlertTriangle, CheckCircle, Plus, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

const HOLD_KEY = "sa_legal_holds"

const DEFAULT_HOLDS = [
  {
    id: "LH-001",
    title: "Dispute: StarCast Agency vs Talent Deepak V",
    tenant: "StarCast Agency",
    scope: "User data, Booking #BK-1821, Escrow #ESC-44",
    createdBy: "Legal Team",
    created: "2025-01-12",
    expires: "2025-07-12",
    status: "ACTIVE",
    notes: "Related to payment dispute filed in Bombay HC.",
  },
  {
    id: "LH-002",
    title: "SEBI Inquiry — Wallet Transactions (Q3)",
    tenant: "TalentPro Mumbai",
    scope: "All wallet transactions Jul–Sep 2024",
    createdBy: "Compliance",
    created: "2024-12-01",
    expires: "2025-06-01",
    status: "ACTIVE",
    notes: "Regulatory inquiry under SEBI (Intermediary) Regulations.",
  },
  {
    id: "LH-003",
    title: "GDPR SAR Hold — ModelMarket user",
    tenant: "ModelMarket",
    scope: "User profile ID: u_9923",
    createdBy: "Privacy Officer",
    created: "2025-02-01",
    expires: "2025-04-01",
    status: "ACTIVE",
    notes: "Data subject access request pending dispute.",
  },
  {
    id: "LH-004",
    title: "Resolved: EventPro contract breach",
    tenant: "EventPro India",
    scope: "Contracts, comms, payments Jan–Mar 2024",
    createdBy: "Legal Team",
    created: "2024-04-10",
    expires: "2024-10-10",
    status: "RELEASED",
    notes: "Settlement reached. Hold released.",
  },
]

function getStatusBadge(status: string) {
  return status === "ACTIVE"
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-700"
}

export default function LegalHoldPage() {
  const [holds, setHolds] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(HOLD_KEY)
      if (stored) return JSON.parse(stored)
    }
    return DEFAULT_HOLDS
  })
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: "", tenant: "", scope: "", expires: "", notes: "" })

  function createHold() {
    if (!form.title.trim() || !form.tenant.trim()) return
    const newHold = {
      id: `LH-${String(holds.length + 1).padStart(3, "0")}`,
      ...form,
      createdBy: "Super Admin",
      created: new Date().toISOString().slice(0, 10),
      status: "ACTIVE",
    }
    const updated = [newHold, ...holds]
    setHolds(updated)
    localStorage.setItem(HOLD_KEY, JSON.stringify(updated))
    setShowCreate(false)
    setForm({ title: "", tenant: "", scope: "", expires: "", notes: "" })
  }

  function releaseHold(id: string) {
    const updated = holds.map((h) => h.id === id ? { ...h, status: "RELEASED" } : h)
    setHolds(updated)
    localStorage.setItem(HOLD_KEY, JSON.stringify(updated))
  }

  const activeHolds = holds.filter((h) => h.status === "ACTIVE").length
  const releasedHolds = holds.filter((h) => h.status === "RELEASED").length

  return (
    <PageLayout>
      <PageHeader
        title="Legal Hold"
        description="Manage legal holds to preserve data for litigation, regulatory inquiries, and compliance matters."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Scale className="h-3.5 w-3.5 text-blue-500" />
            Litigation & Compliance
          </span>
        }
        actions={
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> New Hold
          </Button>
        }
      />

      <PageSection>
        <MetricsGrid>
          {[
            { label: "Active Holds", value: activeHolds, icon: Lock, color: "text-red-500", alert: activeHolds > 0 },
            { label: "Released Holds", value: releasedHolds, icon: CheckCircle, color: "text-emerald-500", alert: false },
            { label: "Total Holds", value: holds.length, icon: Scale, color: "text-blue-500", alert: false },
            { label: "Expiring Soon", value: holds.filter((h) => h.status === "ACTIVE" && new Date(h.expires) < new Date(Date.now() + 30 * 86400000)).length, icon: AlertTriangle, color: "text-amber-500", alert: false },
          ].map((item) => (
            <Card key={item.label} className={`transition-colors ${item.alert ? "border-red-200 hover:border-red-300" : "hover:border-blue-300"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${item.alert ? "text-red-600" : "text-slate-900"}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </MetricsGrid>
      </PageSection>

      {/* Create Hold Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create Legal Hold</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCreate(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Title / Case Name", field: "title", placeholder: "e.g. Dispute: Agency vs Talent" },
                { label: "Affected Tenant", field: "tenant", placeholder: "e.g. StarCast Agency" },
                { label: "Scope", field: "scope", placeholder: "e.g. User data, Bookings, Transactions" },
                { label: "Notes / Reference", field: "notes", placeholder: "e.g. Court case number, regulatory ref" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
                  <input
                    value={(form as any)[field]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Expires</label>
                <input
                  type="date"
                  value={form.expires}
                  onChange={(e) => setForm((prev) => ({ ...prev, expires: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={createHold}>Create Hold</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <PageSection title="Legal Holds">
        <div className="space-y-4">
          {holds.map((hold) => (
            <Card key={hold.id} className={`transition-colors ${hold.status === "ACTIVE" ? "border-red-100 hover:border-red-200" : "opacity-70"}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Lock className={`h-4 w-4 shrink-0 ${hold.status === "ACTIVE" ? "text-red-500" : "text-slate-400"}`} />
                      <h3 className="font-semibold text-slate-800">{hold.title}</h3>
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusBadge(hold.status)}`}>{hold.status}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 pl-7 text-sm">
                      <div className="text-slate-500">Tenant: <span className="text-slate-700">{hold.tenant}</span></div>
                      <div className="text-slate-500">Created: <span className="text-slate-700">{hold.created}</span></div>
                      <div className="text-slate-500">Expires: <span className={`${hold.status === "ACTIVE" && new Date(hold.expires) < new Date() ? "text-red-600 font-medium" : "text-slate-700"}`}>{hold.expires || "—"}</span></div>
                      <div className="text-slate-500">By: <span className="text-slate-700">{hold.createdBy}</span></div>
                      <div className="col-span-2 text-slate-500">Scope: <span className="text-slate-700">{hold.scope}</span></div>
                      {hold.notes && <div className="col-span-2 text-slate-400 text-xs italic">{hold.notes}</div>}
                    </div>
                  </div>
                  {hold.status === "ACTIVE" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => releaseHold(hold.id)}
                      className="shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Release Hold
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}
