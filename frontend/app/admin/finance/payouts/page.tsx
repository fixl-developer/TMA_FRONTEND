"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import {
  getTenantPayouts,
  markPayoutReviewed,
  approvePayout,
  rejectPayout,
} from "@/shared/services/tenantFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowUpRight, ShieldCheck, XCircle } from "lucide-react"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { useToast } from "@/shared/components/ui/toast"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-600 border-amber-500/40",
  PENDING_APPROVAL: "bg-sky-100 text-sky-600 border-sky-500/40",
  SETTLED: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  REJECTED: "bg-red-100 text-red-600 border-red-500/40",
}

export default function AdminPayoutsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reason, setReason] = useState("")
  const [role, setRole] = useState<"REVIEWER" | "APPROVER">("REVIEWER")
  const [actionId, setActionId] = useState<string | null>(null)

  const loadPayouts = () => {
    getTenantPayouts(tenantId).then((data) => {
      setPayouts(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    setLoading(true)
    loadPayouts()
  }, [tenantId])

  const pending = payouts.filter((p) => p.status === "PENDING" || p.status === "PENDING_APPROVAL")
  const settled = payouts.filter((p) => p.status === "SETTLED")
  const reviewQueue = payouts.filter((p) => p.status === "PENDING")
  const approverQueue = payouts.filter((p) => p.status === "PENDING_APPROVAL")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/wallet">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Back</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Payout management</h1>
            <p className="mt-2 text-base text-white/60">Pending payouts, history.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <h3 className="text-sm font-medium text-white/60">Pending approval</h3>
              <p className="mt-2 text-3xl font-bold text-amber-400">{pending.length}</p>
              <p className="mt-1 text-sm text-white/50">Awaiting maker-checker approval</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <h3 className="text-sm font-medium text-white/60">Settled</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-400">{settled.length}</p>
              <p className="mt-1 text-sm text-white/50">Completed</p>
            </div>
          </div>
        </div>

        {/* Maker-Checker Controls */}
        <div className="mb-6 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-4 text-lg font-bold text-white">Maker-checker controls</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={role === "REVIEWER" ? "default" : "outline"}
                onClick={() => setRole("REVIEWER")}
                className={role === "REVIEWER" ? "bg-[#d4ff00] text-black hover:bg-[#b8e600]" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}
              >
                Reviewer
              </Button>
              <Button
                size="sm"
                variant={role === "APPROVER" ? "default" : "outline"}
                onClick={() => setRole("APPROVER")}
                className={role === "APPROVER" ? "bg-[#d4ff00] text-black hover:bg-[#b8e600]" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}
              >
                Approver
              </Button>
              <p className="text-xs text-white/50">
                Queue: {reviewQueue.length} for review · {approverQueue.length} ready for approval
              </p>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason / note for review or approval"
              className="min-h-[72px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
            />
          </div>
        </div>

        {/* Payouts List */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Payouts</h3>
            <Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">Request payout</Button>
          </div>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : payouts.length === 0 ? (
            <p className="py-8 text-center text-white/60">No payouts yet.</p>
          ) : (
            <div className="space-y-3">
              {payouts.map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                      <ArrowUpRight className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{p.description}</p>
                      <p className="text-xs text-white/50">{p.requestedAt ? new Date(p.requestedAt).toLocaleDateString("en-IN") : "—"}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === "PENDING" ? "bg-amber-500/20 text-amber-300" :
                      p.status === "PENDING_APPROVAL" ? "bg-sky-500/20 text-sky-300" :
                      p.status === "SETTLED" ? "bg-emerald-500/20 text-emerald-300" :
                      p.status === "REJECTED" ? "bg-red-500/20 text-red-300" :
                      "bg-slate-500/20 text-slate-300"
                    }`}>{p.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(p.status === "PENDING" || p.status === "PENDING_APPROVAL") && (
                      <CapabilityGate capability="escrow.release">
                        <div className="flex gap-1">
                          {p.status === "PENDING" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-sky-400/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
                              disabled={role !== "REVIEWER" || actionId === p._id || reason.trim().length < 6}
                              onClick={async () => {
                                setActionId(p._id)
                                await markPayoutReviewed(p._id, reason, "finance.reviewer@talentos.io")
                                setReason("")
                                showToast("Payout reviewed and moved to approver queue.", "success")
                                loadPayouts()
                                setActionId(null)
                              }}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" /> Mark reviewed
                            </Button>
                          )}
                          {p.status === "PENDING_APPROVAL" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                disabled={role !== "APPROVER" || actionId === p._id || reason.trim().length < 6}
                                onClick={async () => {
                                  setActionId(p._id)
                                  await approvePayout(p._id, reason, "finance.approver@talentos.io")
                                  setReason("")
                                  showToast("Payout approved.", "success")
                                  loadPayouts()
                                  setActionId(null)
                                }}
                              >
                                <ShieldCheck className="h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                disabled={role !== "APPROVER" || actionId === p._id || reason.trim().length < 6}
                                onClick={async () => {
                                  setActionId(p._id)
                                  await rejectPayout(p._id, reason, "finance.approver@talentos.io")
                                  setReason("")
                                  showToast("Payout rejected.", "info")
                                  loadPayouts()
                                  setActionId(null)
                                }}
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </CapabilityGate>
                    )}
                    <p className="font-semibold text-rose-400">-{formatCurrency(p.amountMinor, p.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
