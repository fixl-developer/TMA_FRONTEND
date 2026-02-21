"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getEscrowsByTenant } from "@/shared/services/escrowService"
import { Lock, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"
import { format } from "date-fns"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

const STATUS_LABEL: Record<string, string> = {
  CREATED: "Created", FUNDED: "Funded", IN_PROGRESS: "In Progress", LOCKED: "Locked",
  DELIVERY_SUBMITTED: "Delivery Submitted", DELIVERY_APPROVED: "Delivery Approved",
  SETTLED: "Settled", RELEASED: "Released", DISPUTED: "Disputed",
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  CREATED: "default", FUNDED: "info", IN_PROGRESS: "info", LOCKED: "warning",
  DELIVERY_SUBMITTED: "warning", DELIVERY_APPROVED: "success",
  SETTLED: "success", RELEASED: "success", DISPUTED: "danger",
}

const STATE_STEPS = ["CREATED", "FUNDED", "IN_PROGRESS", "DELIVERY_SUBMITTED", "DELIVERY_APPROVED", "RELEASED"]

const STORAGE_KEY = "talentos_escrow_overrides"
function getEscrowOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}

export default function EscrowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [escrow, setEscrow] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEscrowsByTenant("tenant_001").then((list: any[]) => {
      const found = list.find((e) => e._id === id)
      if (found) {
        const overrides = getEscrowOverrides()
        setEscrow(overrides[found._id] ? { ...found, ...overrides[found._id] } : found)
      }
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <AdminPageWrapper>
      <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />)}</div>
    </AdminPageWrapper>
  )

  if (!escrow) return (
    <AdminPageWrapper>
      <AdminCard>
        <p className="text-center text-white/50">Escrow not found.</p>
        <div className="mt-4 text-center">
          <Link href="/admin/finance/escrows"><AdminButton variant="ghost">← Back to escrows</AdminButton></Link>
        </div>
      </AdminCard>
    </AdminPageWrapper>
  )

  const stepIdx = STATE_STEPS.indexOf(escrow.status)

  const events: { label: string; time: string; color: string }[] = [
    escrow.createdAt && { label: "Escrow created", time: escrow.createdAt, color: "bg-white/30" },
    escrow.fundedAt && { label: "Funded", time: escrow.fundedAt, color: "bg-blue-400" },
    escrow.lockedAt && { label: "Locked", time: escrow.lockedAt, color: "bg-amber-400" },
    escrow.disputedAt && { label: "Dispute raised", time: escrow.disputedAt, color: "bg-rose-400" },
    escrow.releasedAt && { label: "Funds released", time: escrow.releasedAt, color: "bg-emerald-400" },
    escrow.settledAt && { label: "Settled", time: escrow.settledAt, color: "bg-purple-400" },
  ].filter(Boolean) as any[]
  events.sort((a, b) => a.time.localeCompare(b.time))

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Escrow: ${escrow.referenceType}/${escrow.referenceId}`}
        subtitle={escrow._id}
        action={
          <Link href="/admin/finance/escrows">
            <AdminButton variant="ghost">← Escrows</AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Summary */}
        <div className="space-y-6 lg:col-span-1">
          <AdminCard>
            <p className="text-sm text-white/50">Amount</p>
            <p className="mt-1 text-3xl font-bold text-white">{formatCurrency(escrow.amountMinor, escrow.currency)}</p>
            <div className="mt-3">
              <AdminBadge variant={STATUS_VARIANT[escrow.status] ?? "default"}>
                {STATUS_LABEL[escrow.status] ?? escrow.status}
              </AdminBadge>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-white/50">Timeline</h3>
            <div className="relative space-y-4 pl-4">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10" />
              {events.map((ev, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${ev.color}`} />
                  <div className="pl-4">
                    <p className="text-sm font-medium text-white">{ev.label}</p>
                    <p className="text-xs text-white/40">{format(new Date(ev.time), "MMM d, yyyy HH:mm")}</p>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* State machine progress */}
        <div className="space-y-6 lg:col-span-2">
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">State Machine Progress</h3>
            <div className="space-y-3">
              {STATE_STEPS.map((step, i) => {
                const isActive = escrow.status === step
                const isDone = stepIdx > i && escrow.status !== "DISPUTED"
                const isDisputed = escrow.status === "DISPUTED" && i <= 2
                return (
                  <div key={step} className={`flex items-center gap-4 rounded-xl border p-3 transition-colors ${
                    isActive ? "border-purple-400/50 bg-purple-500/10" :
                    isDone ? "border-emerald-400/30 bg-emerald-500/5" :
                    isDisputed ? "border-rose-400/30 bg-rose-500/5" :
                    "border-white/10 bg-white/5"
                  }`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isActive ? "bg-purple-400 text-black" :
                      isDone ? "bg-emerald-400/20 text-emerald-400" :
                      isDisputed ? "bg-rose-400/20 text-rose-400" :
                      "bg-white/10 text-white/30"
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : isDisputed ? <AlertTriangle className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isActive ? "text-white" : isDone ? "text-white/70" : "text-white/40"}`}>
                        {STATUS_LABEL[step] ?? step}
                      </p>
                    </div>
                    {i < STATE_STEPS.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-white/20" />}
                  </div>
                )
              })}

              {escrow.status === "DISPUTED" && (
                <div className="flex items-center gap-4 rounded-xl border border-rose-400/50 bg-rose-500/10 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-400 text-black">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-rose-300">Disputed</p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
