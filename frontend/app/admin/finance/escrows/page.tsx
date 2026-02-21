"use client"

import { useEffect, useState } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { getEscrowsByTenant } from "@/shared/services/escrowService"
import type { Escrow } from "@/shared/services/escrowService"
import { Lock, AlertTriangle, CheckCircle2, DollarSign, Clock, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { format } from "date-fns"

const DEMO_TENANT = "tenant_001"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

const STATUS_ORDER = ["CREATED", "FUNDED", "IN_PROGRESS", "DELIVERY_SUBMITTED", "DELIVERY_APPROVED", "SETTLED", "DISPUTED", "RELEASED"]

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  CREATED: "default",
  FUNDED: "info",
  IN_PROGRESS: "info",
  LOCKED: "warning",
  DELIVERY_SUBMITTED: "warning",
  DELIVERY_APPROVED: "success",
  SETTLED: "success",
  RELEASED: "success",
  DISPUTED: "danger",
}

const STATUS_LABEL: Record<string, string> = {
  CREATED: "Created",
  FUNDED: "Funded",
  IN_PROGRESS: "In Progress",
  LOCKED: "Locked",
  DELIVERY_SUBMITTED: "Delivery Submitted",
  DELIVERY_APPROVED: "Delivery Approved",
  SETTLED: "Settled",
  RELEASED: "Released",
  DISPUTED: "Disputed",
}

const NEXT_ACTIONS: Record<string, { label: string; nextStatus: string; variant: "secondary" | "danger" | "primary" }[]> = {
  CREATED: [{ label: "Fund", nextStatus: "FUNDED", variant: "secondary" }],
  FUNDED: [{ label: "Mark In Progress", nextStatus: "IN_PROGRESS", variant: "secondary" }],
  LOCKED: [{ label: "Mark In Progress", nextStatus: "IN_PROGRESS", variant: "secondary" }],
  IN_PROGRESS: [{ label: "Submit Delivery", nextStatus: "DELIVERY_SUBMITTED", variant: "secondary" }, { label: "Raise Dispute", nextStatus: "DISPUTED", variant: "danger" }],
  DELIVERY_SUBMITTED: [{ label: "Approve Delivery", nextStatus: "DELIVERY_APPROVED", variant: "secondary" }, { label: "Raise Dispute", nextStatus: "DISPUTED", variant: "danger" }],
  DELIVERY_APPROVED: [{ label: "Release Funds", nextStatus: "RELEASED", variant: "primary" }],
  RELEASED: [],
  SETTLED: [],
  DISPUTED: [{ label: "Resolve → Release", nextStatus: "RELEASED", variant: "secondary" }],
}

const STORAGE_KEY = "talentos_escrow_overrides"

function getEscrowOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}

function saveEscrowOverride(id: string, patch: Partial<any>) {
  const overrides = getEscrowOverrides()
  overrides[id] = { ...(overrides[id] || {}), ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

const STATE_MACHINE_STEPS = [
  { status: "CREATED", label: "Created" },
  { status: "FUNDED", label: "Funded" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "DELIVERY_SUBMITTED", label: "Submitted" },
  { status: "DELIVERY_APPROVED", label: "Approved" },
  { status: "RELEASED", label: "Released" },
]

export default function AdminEscrowsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [escrows, setEscrows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEscrow, setSelectedEscrow] = useState<any | null>(null)
  const [disputeNotes, setDisputeNotes] = useState("")
  const [actionConfirm, setActionConfirm] = useState<{ escrowId: string; label: string; nextStatus: string } | null>(null)

  const loadData = async () => {
    const raw = await getEscrowsByTenant(tenantId || DEMO_TENANT)
    const overrides = getEscrowOverrides()
    const merged = (raw as any[]).map((e: any) => overrides[e._id] ? { ...e, ...overrides[e._id] } : e)
    setEscrows(merged)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleAction = (escrowId: string, nextStatus: string, label: string) => {
    setActionConfirm({ escrowId, label, nextStatus })
  }

  const confirmAction = () => {
    if (!actionConfirm) return
    const patch: any = { status: actionConfirm.nextStatus }
    if (actionConfirm.nextStatus === "FUNDED") patch.fundedAt = new Date().toISOString()
    if (actionConfirm.nextStatus === "RELEASED") patch.releasedAt = new Date().toISOString()
    if (actionConfirm.nextStatus === "SETTLED") patch.settledAt = new Date().toISOString()
    if (actionConfirm.nextStatus === "DISPUTED") patch.disputedAt = new Date().toISOString()
    saveEscrowOverride(actionConfirm.escrowId, patch)
    setEscrows((prev) => prev.map((e) => e._id === actionConfirm.escrowId ? { ...e, ...patch } : e))
    if (selectedEscrow?._id === actionConfirm.escrowId) setSelectedEscrow((e: any) => ({ ...e, ...patch }))
    showToast(`Escrow updated to ${STATUS_LABEL[actionConfirm.nextStatus]}.`, "success")
    setActionConfirm(null)
    setDisputeNotes("")
  }

  const totalFunded = escrows.filter((e) => ["FUNDED", "IN_PROGRESS", "DELIVERY_SUBMITTED", "DELIVERY_APPROVED"].includes(e.status)).reduce((s, e) => s + e.amountMinor, 0)
  const totalDisputed = escrows.filter((e) => e.status === "DISPUTED").reduce((s, e) => s + e.amountMinor, 0)
  const totalReleased = escrows.filter((e) => ["RELEASED", "SETTLED"].includes(e.status)).reduce((s, e) => s + e.amountMinor, 0)

  function getStepIndex(status: string) {
    return STATE_MACHINE_STEPS.findIndex((s) => s.status === status)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Escrows"
        subtitle="Contract & booking escrow lifecycle: CREATED → FUNDED → IN_PROGRESS → DELIVERY → RELEASED"
        action={
          <div className="flex gap-2">
            <Link href="/admin/finance/payouts">
              <AdminButton variant="secondary">Payouts</AdminButton>
            </Link>
            <Link href="/admin/finance/invoices">
              <AdminButton variant="ghost">Invoices</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Escrows" value={escrows.length} subtitle="All statuses" icon={Lock} color="purple" />
        <AdminStatCard title="In Escrow" value={formatCurrency(totalFunded, "INR")} subtitle="Funded / active" icon={DollarSign} color="yellow" />
        <AdminStatCard title="Disputed" value={formatCurrency(totalDisputed, "INR")} subtitle="Under dispute" icon={AlertTriangle} color="purple" />
        <AdminStatCard title="Released" value={formatCurrency(totalReleased, "INR")} subtitle="Settled / released" icon={CheckCircle2} color="green" />
      </div>

      {/* State machine visual */}
      <AdminCard className="mb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">Escrow State Machine</h3>
        <div className="flex flex-wrap items-center gap-2">
          {STATE_MACHINE_STEPS.map((step, i) => (
            <div key={step.status} className="flex items-center gap-2">
              <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                {step.label}
              </div>
              {i < STATE_MACHINE_STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-white/30" />}
            </div>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <div className="text-white/30">|</div>
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400">Disputed</div>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h3 className="mb-4 font-bold text-white">Escrow Accounts</h3>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />)}</div>
        ) : escrows.length === 0 ? (
          <AdminEmptyState icon={Lock} title="No escrows" description="Escrows are created when contracts are signed or bookings confirmed." />
        ) : (
          <AdminTable headers={["Reference", "Amount", "Timeline", "Status", "Actions"]}>
            {escrows.map((e) => {
              const stepIdx = getStepIndex(e.status)
              const actions = NEXT_ACTIONS[e.status] ?? []
              return (
                <AdminTableRow key={e._id} onClick={() => setSelectedEscrow(e)}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{e.referenceType}/{e.referenceId}</p>
                    <p className="text-xs text-white/50">
                      {e.createdAt ? format(new Date(e.createdAt), "MMM d, yyyy") : "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-white">
                    {formatCurrency(e.amountMinor, e.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {STATE_MACHINE_STEPS.map((step, i) => (
                        <div key={step.status} title={step.label} className={`h-2 w-6 rounded-full transition-colors ${
                          e.status === "DISPUTED" ? (i <= 2 ? "bg-rose-400" : "bg-white/10") :
                          i <= stepIdx ? "bg-purple-400" : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AdminBadge variant={STATUS_VARIANT[e.status] ?? "default"}>
                      {STATUS_LABEL[e.status] ?? e.status}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-4" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex flex-wrap gap-1">
                      {actions.map((action) => (
                        <AdminButton
                          key={action.nextStatus}
                          size="sm"
                          variant={action.variant}
                          onClick={() => handleAction(e._id, action.nextStatus, action.label)}
                        >
                          {action.label}
                        </AdminButton>
                      ))}
                    </div>
                  </td>
                </AdminTableRow>
              )
            })}
          </AdminTable>
        )}
      </AdminCard>

      {/* Escrow Detail Modal */}
      <Dialog open={!!selectedEscrow} onOpenChange={(o) => !o && setSelectedEscrow(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Escrow Detail</DialogTitle>
          </DialogHeader>
          {selectedEscrow && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-white">{selectedEscrow.referenceType}/{selectedEscrow.referenceId}</p>
                    <p className="text-2xl font-bold text-purple-300">{formatCurrency(selectedEscrow.amountMinor, selectedEscrow.currency)}</p>
                  </div>
                  <AdminBadge variant={STATUS_VARIANT[selectedEscrow.status] ?? "default"}>
                    {STATUS_LABEL[selectedEscrow.status] ?? selectedEscrow.status}
                  </AdminBadge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {selectedEscrow.createdAt && <div className="flex justify-between"><span className="text-white/50">Created</span><span className="text-white">{format(new Date(selectedEscrow.createdAt), "MMM d, yyyy HH:mm")}</span></div>}
                {selectedEscrow.fundedAt && <div className="flex justify-between"><span className="text-white/50">Funded</span><span className="text-white">{format(new Date(selectedEscrow.fundedAt), "MMM d, yyyy HH:mm")}</span></div>}
                {selectedEscrow.lockedAt && <div className="flex justify-between"><span className="text-white/50">Locked</span><span className="text-white">{format(new Date(selectedEscrow.lockedAt), "MMM d, yyyy HH:mm")}</span></div>}
                {selectedEscrow.disputedAt && <div className="flex justify-between"><span className="text-rose-400">Disputed</span><span className="text-rose-300">{format(new Date(selectedEscrow.disputedAt), "MMM d, yyyy HH:mm")}</span></div>}
                {selectedEscrow.releasedAt && <div className="flex justify-between"><span className="text-white/50">Released</span><span className="text-emerald-300">{format(new Date(selectedEscrow.releasedAt), "MMM d, yyyy HH:mm")}</span></div>}
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-white/50">State machine progress</p>
                <div className="flex items-center gap-1">
                  {STATE_MACHINE_STEPS.map((step, i) => {
                    const idx = getStepIndex(selectedEscrow.status)
                    return (
                      <div key={step.status} className="flex-1 text-center">
                        <div className={`mx-auto mb-1 h-3 w-3 rounded-full ${
                          selectedEscrow.status === "DISPUTED" ? (i <= 2 ? "bg-rose-400" : "bg-white/10") :
                          i <= idx ? "bg-purple-400" : "bg-white/10"
                        }`} />
                        <p className="text-[10px] text-white/40">{step.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(NEXT_ACTIONS[selectedEscrow.status] ?? []).map((action) => (
                  <AdminButton
                    key={action.nextStatus}
                    variant={action.variant}
                    onClick={() => { handleAction(selectedEscrow._id, action.nextStatus, action.label); setSelectedEscrow(null) }}
                  >
                    {action.label}
                  </AdminButton>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Action Modal */}
      <Dialog open={!!actionConfirm} onOpenChange={(o) => !o && setActionConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm: {actionConfirm?.label}</DialogTitle>
          </DialogHeader>
          {actionConfirm && (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Change escrow status to <strong className="text-white">{STATUS_LABEL[actionConfirm.nextStatus]}</strong>?
              </p>
              {actionConfirm.nextStatus === "DISPUTED" && (
                <div className="space-y-2">
                  <Label>Dispute reason (optional)</Label>
                  <textarea
                    className="min-h-[80px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none"
                    placeholder="Describe the dispute..."
                    value={disputeNotes}
                    onChange={(e) => setDisputeNotes(e.target.value)}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActionConfirm(null)}>Cancel</Button>
                <Button onClick={confirmAction}>Confirm</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
