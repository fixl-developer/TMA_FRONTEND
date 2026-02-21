"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getEscrowById,
  getEscrowEvents,
  fundEscrow,
  lockEscrow,
  releaseEscrow,
  disputeEscrow,
  type Escrow,
  type EscrowEvent,
  STATUS_ORDER,
} from "@/shared/services/modellingEscrowService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  CREATED: "bg-slate-100 text-slate-600",
  FUNDED: "bg-[#FEF3C7] text-[#B8860B]",
  LOCKED: "bg-amber-100 text-amber-700",
  RELEASED: "bg-emerald-100 text-emerald-700",
  DISPUTED: "bg-rose-100 text-rose-600",
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function EscrowDetailPage() {
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
  }
  const id = params.id as string
  const [escrow, setEscrow] = useState<Escrow | null>(null)
  const [events, setEvents] = useState<EscrowEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getEscrowById(id, tenantId),
      getEscrowEvents(id, tenantId),
    ]).then(([e, ev]) => {
      setEscrow(e ?? null)
      setEvents(ev)
      setLoading(false)
    })
  }, [id, tenantId])

  const runAction = async (
    action: () => Promise<void>,
    nextStatus: string,
    msg: string
  ) => {
    setActionLoading(true)
    await action()
    setEscrow((prev) => (prev ? { ...prev, status: nextStatus } : null))
    setEvents((prev) => [
      ...prev,
      { _id: `evt_${Date.now()}`, escrowId: id, event: nextStatus, createdAt: new Date().toISOString() },
    ])
    showToast(`${msg} (mock)`, "success")
    setActionLoading(false)
  }

  const handleFund = () => runAction(() => fundEscrow(id, tenantId), "FUNDED", "Escrow funded")
  const handleLock = () => runAction(() => lockEscrow(id, tenantId), "LOCKED", "Escrow locked")
  const handleRelease = () => runAction(() => releaseEscrow(id, tenantId), "RELEASED", "Escrow released")
  const handleDispute = () => runAction(() => disputeEscrow(id, tenantId), "DISPUTED", "Escrow disputed")

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!escrow) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Escrow not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/finance/escrows">Back to escrows</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  const currentIndex = STATUS_ORDER.indexOf(escrow.status)
  const isDisputed = escrow.status === "DISPUTED"

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Escrow {escrow.referenceType}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{escrow.referenceId}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/finance/escrows" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to escrows
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Escrow details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[escrow.status] ?? ""}`}
                >
                  {escrow.status}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Amount</p>
                  <p className="text-xl font-bold text-[#B8860B]">
                    {formatCurrency(escrow.amountMinor, escrow.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Reference</p>
                  <p style={{ color: theme.text }}>
                    {escrow.referenceType} · {escrow.referenceId}
                  </p>
                </div>
              </div>

              {!isDisputed && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {escrow.status === "CREATED" && (
                    <CapabilityGate capability="escrow.create">
                      <Button
                        className="bg-[#B8860B] hover:bg-[#9A7209]"
                        onClick={handleFund}
                        disabled={actionLoading}
                      >
                        Fund
                      </Button>
                    </CapabilityGate>
                  )}
                  {escrow.status === "FUNDED" && (
                    <CapabilityGate capability="escrow.lock">
                      <Button
                        className="bg-[#B8860B] hover:bg-[#9A7209]"
                        onClick={handleLock}
                        disabled={actionLoading}
                      >
                        Lock
                      </Button>
                    </CapabilityGate>
                  )}
                  {escrow.status === "LOCKED" && (
                    <>
                      <CapabilityGate capability="escrow.release">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleRelease}
                          disabled={actionLoading}
                        >
                          Release
                        </Button>
                      </CapabilityGate>
                      <CapabilityGate capability="disputes.raise">
                        <Button
                          variant="outline"
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={handleDispute}
                          disabled={actionLoading}
                        >
                          Dispute
                        </Button>
                      </CapabilityGate>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Status timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {!isDisputed ? (
                <div className="flex items-center gap-2">
                  {STATUS_ORDER.map((status, i) => {
                    const isActive = currentIndex >= i
                    const isCurrent = escrow.status === status
                    return (
                      <div key={status} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isActive ? "bg-[#B8860B] text-white" : "text-[#57534E]"
                            } ${isCurrent ? "ring-2 ring-[#B8860B] ring-offset-2" : ""}`}
                            style={!isActive ? { backgroundColor: theme.border } : {}}
                          >
                            {isActive ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-xs">{i + 1}</span>
                            )}
                          </div>
                          <span
                            className={`mt-1 text-xs ${isCurrent ? "font-medium" : ""}`}
                            style={{ color: isCurrent ? theme.text : theme.textSecondary }}
                          >
                            {status}
                          </span>
                        </div>
                        {i < STATUS_ORDER.length - 1 && (
                          <div
                            className={`mx-1 h-0.5 flex-1 ${isActive ? "bg-[#B8860B]/50" : ""}`}
                            style={!isActive ? { backgroundColor: theme.border } : {}}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((ev) => (
                    <div
                      key={ev._id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                      style={{ borderColor: theme.border }}
                    >
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ev.event === "DISPUTED" ? "bg-rose-100 text-rose-600" : "bg-[#FEF3C7] text-[#B8860B]"
                        }`}
                      >
                        {ev.event}
                      </span>
                      <span className="text-sm" style={{ color: theme.textSecondary }}>
                        {new Date(ev.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Ownership & attribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm" style={{ color: theme.textSecondary }}>
              <p>Owner: Finance operations</p>
              <p>
                Created by:{" "}
                {getCreatorName((escrow as any).createdByUserId ?? (escrow as any).createdBy) ??
                  (escrow as any).createdByUserId ??
                  (escrow as any).createdBy ??
                  "Escrow system"}
              </p>
              <p>
                Created: {formatDateTime(escrow.createdAt)} · Updated:{" "}
                {formatDateTime(
                  escrow.releasedAt ??
                    escrow.disputedAt ??
                    escrow.lockedAt ??
                    escrow.fundedAt ??
                    null
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="py-4 text-sm" style={{ color: theme.textSecondary }}>No events yet.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((ev) => (
                    <div
                      key={ev._id}
                      className="flex items-center justify-between rounded-lg border p-2 text-sm"
                      style={{ borderColor: theme.border }}
                    >
                      <span className="font-medium" style={{ color: theme.text }}>{ev.event}</span>
                      <span style={{ color: theme.textSecondary }}>
                        {new Date(ev.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
