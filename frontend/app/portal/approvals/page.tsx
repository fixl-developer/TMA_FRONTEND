"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getPendingApprovals,
  getApprovalStatusColor,
  getObjectTypeLabel,
} from "@/shared/services/commsService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { CheckSquare, XCircle, CheckCircle2, Clock, Filter } from "lucide-react"
import { format } from "date-fns"

const OVERRIDES_KEY = "talentos_approval_overrides"

function getApprovalOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}") } catch { return {} }
}

function saveApprovalOverride(id: string, patch: any) {
  const ov = getApprovalOverrides()
  ov[id] = { ...(ov[id] || {}), ...patch }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov))
}

const TYPE_ICON: Record<string, string> = {
  CONTENT: "📸",
  QUOTE: "📋",
  CONTRACT: "📄",
  DELIVERABLE: "🎯",
  MILESTONE: "🏁",
}

export default function PortalApprovalsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("PENDING")
  const [actionId, setActionId] = useState<string | null>(null)
  const [commentMap, setCommentMap] = useState<Record<string, string>>({})

  const loadData = async () => {
    const data = await getPendingApprovals(tenantId)
    const ov = getApprovalOverrides()
    setApprovals((data as any[]).map((a: any) => ov[a._id] ? { ...a, ...ov[a._id] } : a))
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleApprove = (id: string) => {
    const patch = { status: "APPROVED", approvedAt: new Date().toISOString(), comment: commentMap[id] || undefined }
    saveApprovalOverride(id, patch)
    setApprovals((prev) => prev.map((a) => a._id === id ? { ...a, ...patch } : a))
    showToast("Approved!", "success")
    setActionId(null)
  }

  const handleReject = (id: string) => {
    if (!commentMap[id]?.trim()) {
      showToast("Please provide a reason for rejection.", "error")
      return
    }
    const patch = { status: "REJECTED", rejectedAt: new Date().toISOString(), comment: commentMap[id] }
    saveApprovalOverride(id, patch)
    setApprovals((prev) => prev.map((a) => a._id === id ? { ...a, ...patch } : a))
    showToast("Rejected.", "info")
    setActionId(null)
  }

  const filtered = approvals.filter((a) => statusFilter === "ALL" || a.status === statusFilter)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/portal" className="text-white/50 hover:text-white text-sm">← Portal</Link>
          <h1 className="text-2xl font-bold text-white">Approvals</h1>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex gap-2">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                statusFilter === s ? "bg-purple-500 text-white" : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {s === "ALL" ? "All" : s}
              <span className="ml-1.5 text-xs opacity-60">
                ({s === "ALL" ? approvals.length : approvals.filter((a) => a.status === s).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
            <p className="text-white/60">No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} approvals.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a) => (
              <div key={a._id} className={`rounded-2xl border p-5 transition-all ${
                a.status === "PENDING" ? "border-amber-400/30 bg-amber-500/5" :
                a.status === "APPROVED" ? "border-emerald-400/30 bg-emerald-500/5" :
                "border-rose-400/30 bg-rose-500/5"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                    {TYPE_ICON[a.objectType] ?? "📋"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-white">{a.title}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        a.status === "PENDING" ? "bg-amber-500/20 text-amber-400" :
                        a.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-rose-500/20 text-rose-400"
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/60">{a.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
                      <span>{getObjectTypeLabel ? getObjectTypeLabel(a.objectType) : a.objectType}</span>
                      {a.dueDate && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Due {format(new Date(a.dueDate), "MMM d, yyyy")}</span>}
                      {a.requestedAt && <span>Requested {format(new Date(a.requestedAt), "MMM d, yyyy")}</span>}
                    </div>
                    {a.comment && (
                      <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <p className="text-xs text-white/50">Comment: {a.comment}</p>
                      </div>
                    )}
                    {a.status === "PENDING" && (
                      <div className="mt-4 space-y-2">
                        {actionId === a._id ? (
                          <div className="space-y-2">
                            <textarea
                              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none"
                              placeholder="Add a comment (required for rejection)…"
                              value={commentMap[a._id] || ""}
                              onChange={(e) => setCommentMap((m) => ({ ...m, [a._id]: e.target.value }))}
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(a._id)}
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600"
                              >
                                <CheckCircle2 className="h-4 w-4" />Approve
                              </button>
                              <button
                                onClick={() => handleReject(a._id)}
                                className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-600"
                              >
                                <XCircle className="h-4 w-4" />Reject
                              </button>
                              <button
                                onClick={() => setActionId(null)}
                                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/60 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActionId(a._id)}
                            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                          >
                            <CheckSquare className="h-4 w-4" />
                            Review & Decide
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
