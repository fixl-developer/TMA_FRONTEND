"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getDisputeById,
  getDisputeEvidence,
  addDisputeEvidence,
  assignDispute,
  resolveDispute,
  closeDispute,
  type Dispute,
  type DisputeEvidence,
} from "@/shared/services/modellingDisputeService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, AlertCircle, FileText, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700",
  EVIDENCE: "bg-blue-100 text-blue-700",
  ASSIGNED: "bg-slate-100 text-slate-600",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-500",
}

export default function DisputeDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }
  const id = params.id as string
  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [evidence, setEvidence] = useState<DisputeEvidence[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAddEvidence, setShowAddEvidence] = useState(false)
  const [evidenceDesc, setEvidenceDesc] = useState("")
  const [evidenceType, setEvidenceType] = useState("DOCUMENT")
  const [assigneeId, setAssigneeId] = useState("")
  const [resolution, setResolution] = useState("")

  const load = () => {
    if (!id) return
    Promise.all([
      getDisputeById(id, tenantId),
      getDisputeEvidence(id, tenantId),
    ]).then(([d, ev]) => {
      setDispute(d ?? null)
      setEvidence(ev)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [id, tenantId])

  const handleAddEvidence = async () => {
    if (!evidenceDesc.trim()) return
    setActionLoading(true)
    const ev = await addDisputeEvidence(id, evidenceDesc.trim(), evidenceType, tenantId)
    setEvidence((prev) => [ev, ...prev])
    setEvidenceDesc("")
    setShowAddEvidence(false)
    showToast("Evidence added (mock)", "success")
    setActionLoading(false)
  }

  const handleAssign = async () => {
    if (!assigneeId.trim()) return
    setActionLoading(true)
    await assignDispute(id, assigneeId.trim(), tenantId)
    setDispute((prev) => (prev ? { ...prev, status: "ASSIGNED", assignedTo: assigneeId } : null))
    setAssigneeId("")
    showToast("Dispute assigned (mock)", "success")
    setActionLoading(false)
  }

  const handleResolve = async () => {
    if (!resolution.trim()) return
    setActionLoading(true)
    await resolveDispute(id, resolution.trim(), tenantId)
    setDispute((prev) =>
      prev ? { ...prev, status: "RESOLVED", resolution, resolvedAt: new Date().toISOString() } : null
    )
    setResolution("")
    showToast("Dispute resolved (mock)", "success")
    setActionLoading(false)
  }

  const handleClose = async () => {
    setActionLoading(true)
    await closeDispute(id, tenantId)
    setDispute((prev) => (prev ? { ...prev, status: "CLOSED" } : null))
    showToast("Dispute closed (mock)", "success")
    setActionLoading(false)
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!dispute) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Dispute not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/disputes">Back to disputes</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  const canAct = !["RESOLVED", "CLOSED"].includes(dispute.status)

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Dispute {dispute.referenceType}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{dispute.referenceId}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/disputes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to disputes
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Dispute details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[dispute.status] ?? ""}`}
                >
                  {dispute.status}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Amount</p>
                  <p className="text-xl font-bold text-[#B8860B]">
                    {formatCurrency(dispute.amountMinor, dispute.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Reference</p>
                  <p style={{ color: theme.text }}>
                    {dispute.referenceType} · {dispute.referenceId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Reason</p>
                  <p style={{ color: theme.text }}>{dispute.reason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Raised by</p>
                  <p style={{ color: theme.text }}>{dispute.raisedBy}</p>
                </div>
              </div>
              {dispute.resolution && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-sm font-medium text-emerald-800">Resolution</p>
                  <p className="text-sm text-emerald-700">{dispute.resolution}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: theme.text }}>Evidence</CardTitle>
                {canAct && (
                  <Button
                    size="sm"
                    className="bg-[#B8860B] hover:bg-[#9A7209]"
                    onClick={() => setShowAddEvidence(true)}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add evidence
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showAddEvidence && (
                <div className="mb-4 rounded-lg border p-4" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Description</label>
                  <textarea
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                    rows={2}
                    placeholder="Describe the evidence..."
                  />
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                  >
                    <option value="DOCUMENT">Document</option>
                    <option value="IMAGE">Image</option>
                  </select>
                  <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>Upload placeholder: file selection not implemented.</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#B8860B] hover:bg-[#9A7209]"
                      onClick={handleAddEvidence}
                      disabled={actionLoading || !evidenceDesc.trim()}
                    >
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="border" style={{ borderColor: theme.border }} onClick={() => setShowAddEvidence(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {evidence.length === 0 ? (
                <p className="py-4 text-sm" style={{ color: theme.textSecondary }}>No evidence yet.</p>
              ) : (
                <div className="space-y-2">
                  {evidence.map((ev) => (
                    <div
                      key={ev._id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                      style={{ borderColor: theme.border }}
                    >
                      <FileText className="h-5 w-5 shrink-0 text-[#B8860B]" />
                      <div>
                        <p className="font-medium" style={{ color: theme.text }}>{ev.description}</p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {ev.type} · {new Date(ev.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canAct && (
                <>
                  {!dispute.assignedTo && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Assign to</label>
                      <input
                        type="text"
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        placeholder="User ID"
                        className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="border"
                        style={{ borderColor: theme.border }}
                        onClick={handleAssign}
                        disabled={actionLoading || !assigneeId.trim()}
                      >
                        Assign
                      </Button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Resolution</label>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter resolution..."
                      className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                      rows={2}
                    />
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleResolve}
                      disabled={actionLoading || !resolution.trim()}
                    >
                      Resolve
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border"
                    style={{ borderColor: theme.border }}
                    onClick={handleClose}
                    disabled={actionLoading}
                  >
                    Close
                  </Button>
                </>
              )}
              {!canAct && (
                <p className="text-sm" style={{ color: theme.textSecondary }}>This dispute is {dispute.status.toLowerCase()}.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
