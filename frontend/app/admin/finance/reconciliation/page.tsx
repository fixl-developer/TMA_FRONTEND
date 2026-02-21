"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  getReconciliationSummary,
  getWebhookEvents,
} from "@/shared/services/paymentService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  Calculator,
  CheckCircle2,
  XCircle,
  Webhook,
  AlertTriangle,
  Download,
  RefreshCcw,
} from "lucide-react"
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
import { format } from "date-fns"

function formatCurrency(amountMinor: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amountMinor / 100)
}

const BATCH_KEY = "talentos_recon_batches"

interface ReconBatch {
  id: string
  period: string
  invoicesMatched: number
  invoicesTotal: number
  discrepancies: number
  status: "PENDING" | "IN_REVIEW" | "RECONCILED"
  createdAt: string
}

function getBatches(): ReconBatch[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(BATCH_KEY) || "[]") } catch { return [] }
}

function saveBatches(b: ReconBatch[]) {
  localStorage.setItem(BATCH_KEY, JSON.stringify(b))
}

const SEED_BATCHES: ReconBatch[] = [
  { id: "batch_001", period: "2024-06", invoicesMatched: 38, invoicesTotal: 42, discrepancies: 4, status: "IN_REVIEW", createdAt: "2024-07-01T09:00:00.000Z" },
  { id: "batch_002", period: "2024-07", invoicesMatched: 51, invoicesTotal: 51, discrepancies: 0, status: "RECONCILED", createdAt: "2024-08-01T09:00:00.000Z" },
  { id: "batch_003", period: "2024-08", invoicesMatched: 29, invoicesTotal: 35, discrepancies: 6, status: "PENDING", createdAt: "2024-09-01T09:00:00.000Z" },
  { id: "batch_004", period: "2024-09", invoicesMatched: 44, invoicesTotal: 44, discrepancies: 0, status: "RECONCILED", createdAt: "2024-10-01T09:00:00.000Z" },
  { id: "batch_005", period: "2024-10", invoicesMatched: 18, invoicesTotal: 23, discrepancies: 5, status: "PENDING", createdAt: "2024-11-01T09:00:00.000Z" },
]

export default function AdminReconciliationPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [summary, setSummary] = useState<any>(null)
  const [webhookEvents, setWebhookEvents] = useState<any[]>([])
  const [batches, setBatches] = useState<ReconBatch[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const [s, w] = await Promise.all([
      getReconciliationSummary(tenantId),
      getWebhookEvents(tenantId, { limit: 20 }),
    ])
    setSummary(s)
    setWebhookEvents(w)
    const stored = getBatches()
    setBatches(stored.length > 0 ? stored : SEED_BATCHES)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [tenantId])

  const handleBatchAction = (batchId: string, newStatus: ReconBatch["status"]) => {
    const updated = batches.map((b) => b.id === batchId ? { ...b, status: newStatus } : b)
    setBatches(updated)
    saveBatches(updated)
    showToast(`Batch ${batchId} updated to ${newStatus}.`, "success")
  }

  const handleRunBatch = () => {
    const now = new Date()
    const period = format(now, "yyyy-MM")
    const newBatch: ReconBatch = {
      id: `batch_${Date.now()}`,
      period,
      invoicesMatched: Math.floor(Math.random() * 30) + 20,
      invoicesTotal: Math.floor(Math.random() * 10) + 30,
      discrepancies: Math.floor(Math.random() * 5),
      status: "PENDING",
      createdAt: now.toISOString(),
    }
    const updated = [newBatch, ...batches]
    setBatches(updated)
    saveBatches(updated)
    showToast("New reconciliation batch created.", "success")
  }

  const pendingBatches = batches.filter((b) => b.status !== "RECONCILED").length
  const totalDiscrepancies = batches.reduce((s, b) => s + (b.status !== "RECONCILED" ? b.discrepancies : 0), 0)

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Reconciliation"
        subtitle="Match invoices to payments, flag discrepancies, manage reconciliation batches"
        action={
          <div className="flex gap-2">
            <Link href="/admin/wallet">
              <AdminButton variant="ghost">← Finance</AdminButton>
            </Link>
            <AdminButton variant="secondary" onClick={handleRunBatch}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Run Batch
            </AdminButton>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Captured" value={summary ? formatCurrency(summary.totalCaptured) : "—"} subtitle="Payments received" icon={CheckCircle2} color="green" />
        <AdminStatCard title="Total Failed" value={summary ? formatCurrency(summary.totalFailed) : "—"} subtitle="Failed payments" icon={XCircle} color="purple" />
        <AdminStatCard title="Total Refunded" value={summary ? formatCurrency(summary.totalRefunded) : "—"} subtitle="Refunds issued" icon={Calculator} color="yellow" />
        <AdminStatCard title="Open Discrepancies" value={totalDiscrepancies} subtitle={`${pendingBatches} batches pending`} icon={AlertTriangle} color="yellow" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Batches */}
        <div className="lg:col-span-2">
          <AdminCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Reconciliation Batches</h3>
              <AdminButton size="sm" variant="secondary" onClick={() => {
                const csv = ["Period,Matched,Total,Discrepancies,Status", ...batches.map((b) => `${b.period},${b.invoicesMatched},${b.invoicesTotal},${b.discrepancies},${b.status}`)].join("\n")
                const blob = new Blob([csv], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a"); a.href = url; a.download = "reconciliation.csv"; a.click()
              }}>
                <Download className="mr-1.5 h-3.5 w-3.5" />Export
              </AdminButton>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />)}</div>
            ) : (
              <AdminTable headers={["Period", "Progress", "Discrepancies", "Status", "Actions"]}>
                {batches.map((b) => (
                  <AdminTableRow key={b.id}>
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-white">{b.period}</p>
                      <p className="text-xs text-white/40">{b.createdAt ? format(new Date(b.createdAt), "MMM d, yyyy") : ""}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full bg-white/10">
                          <div
                            className="h-1.5 rounded-full bg-purple-400"
                            style={{ width: `${Math.round((b.invoicesMatched / b.invoicesTotal) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/60">{b.invoicesMatched}/{b.invoicesTotal}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {b.discrepancies > 0 ? (
                        <span className="text-sm font-bold text-amber-400">{b.discrepancies} flagged</span>
                      ) : (
                        <span className="text-sm text-emerald-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge variant={b.status === "RECONCILED" ? "success" : b.status === "IN_REVIEW" ? "warning" : "default"}>
                        {b.status.replace("_", " ")}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4">
                      {b.status === "PENDING" && (
                        <AdminButton size="sm" variant="secondary" onClick={() => handleBatchAction(b.id, "IN_REVIEW")}>
                          Start Review
                        </AdminButton>
                      )}
                      {b.status === "IN_REVIEW" && (
                        <AdminButton size="sm" variant="primary" onClick={() => handleBatchAction(b.id, "RECONCILED")}>
                          Mark Reconciled
                        </AdminButton>
                      )}
                    </td>
                  </AdminTableRow>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        </div>

        {/* Webhook Events */}
        <div>
          <AdminCard>
            <div className="mb-4 flex items-center gap-2">
              <Webhook className="h-4 w-4 text-white/50" />
              <h3 className="font-bold text-white">Webhook Events</h3>
            </div>
            {loading ? (
              <div className="space-y-2">{[1,2,3,4].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />)}</div>
            ) : webhookEvents.length === 0 ? (
              <AdminEmptyState icon={Webhook} title="No webhook events" />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {webhookEvents.map((e) => (
                  <div key={e._id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {e.status === "DELIVERED"
                      ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      : <XCircle className="h-4 w-4 shrink-0 text-rose-400" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">{e.event}</p>
                      <p className="truncate text-xs text-white/40">{e.payloadId}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      e.status === "DELIVERED" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {e.responseCode ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
