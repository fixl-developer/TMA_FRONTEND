"use client"

import { useEffect, useState } from "react"
import {
  getCreditsAccount,
  getCreditsLedger,
  issueCredits,
} from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { CreditCard, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"

export default function AdminCreditsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [account, setAccount] = useState<{ balance: number } | null>(null)
  const [ledger, setLedger] = useState<{ type: string; amount: number; description: string; createdAt: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const load = () => {
    Promise.all([
      getCreditsAccount(tenantId),
      getCreditsLedger(tenantId),
    ]).then(([a, l]) => {
      setAccount(a ?? null)
      setLedger(l)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [tenantId])

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseInt(amount, 10)
    if (isNaN(amt) || amt <= 0) {
      showToast("Enter a valid amount", "warning")
      return
    }
    setActionLoading(true)
    await issueCredits(tenantId || "tenant_001", amt, reason || "Credits issued by admin", tenantId)
    setAccount((prev) => (prev ? { balance: prev.balance + amt } : { balance: amt }))
    setLedger((prev) => [
      { type: "ISSUE", amount: amt, description: reason || "Credits issued", createdAt: new Date().toISOString() },
      ...prev,
    ])
    showToast(`${amt} credits issued (mock)`, "success")
    setIssueModalOpen(false)
    setAmount("")
    setReason("")
    setActionLoading(false)
  }

  const balance = account?.balance ?? 0

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Credits"
        subtitle="Issue and manage platform credits"
        actions={
          <AdminButton onClick={() => setIssueModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Issue credits
          </AdminButton>
        }
      >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Current Balance"
          value={balance}
          subtitle="Available credits"
          icon={CreditCard}
          color="purple"
        />
        <AdminStatCard
          label="Total Issued"
          value={ledger.filter((l) => l.type === "ISSUE").reduce((sum, l) => sum + l.amount, 0)}
          subtitle="All time"
          icon={CreditCard}
          color="green"
        />
        <AdminStatCard
          label="Total Used"
          value={Math.abs(ledger.filter((l) => l.type === "DEBIT").reduce((sum, l) => sum + l.amount, 0))}
          subtitle="All time"
          icon={CreditCard}
          color="blue"
        />
        <AdminStatCard
          label="Transactions"
          value={ledger.length}
          subtitle="Total activity"
          icon={CreditCard}
          color="yellow"
        />
      </AdminStatsGrid>

      <AdminCard title="Recent Activity" subtitle={`${ledger.length} total transactions`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : ledger.length === 0 ? (
          <AdminEmptyState
            icon={CreditCard}
            title="No activity yet"
            description="Issue credits to get started"
            action={
              <AdminButton onClick={() => setIssueModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Issue credits
              </AdminButton>
            }
          />
        ) : (
          <div className="space-y-2">
            {ledger.slice(0, 10).map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <span className="text-xs font-semibold text-white">{entry.type}</span>
                <span className={`text-xs font-semibold ${entry.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {entry.amount > 0 ? "+" : ""}{entry.amount}
                </span>
                <span className="text-xs text-white/70">{entry.description}</span>
                <span className="text-xs text-white/40">
                  {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <Dialog open={issueModalOpen} onOpenChange={setIssueModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue credits</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Amount</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#d4ff00] focus:outline-none backdrop-blur-md"
                placeholder="e.g. 1000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#d4ff00] focus:outline-none backdrop-blur-md"
                rows={2}
                placeholder="e.g. Promotional credits"
              />
            </div>
            <DialogFooter>
              <AdminButton type="button" variant="secondary" onClick={() => setIssueModalOpen(false)}>
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                disabled={actionLoading || !amount || parseInt(amount, 10) <= 0}
              >
                Issue
              </AdminButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
