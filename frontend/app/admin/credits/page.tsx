"use client"

import { useEffect, useState } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import {
  getCreditsAccount,
  getCreditsLedger,
  issueCredits,
} from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { CreditCard, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

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
    <AgenciesPage>
      <PageBanner
        title="Credits"
        subtitle="Issue and manage platform credits"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80"
      />
      <section className="mt-8">
        <Card className="border-[#E7E5E4]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="text-[#1C1917]">Credits</CardTitle>
              <Button
                className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                onClick={() => setIssueModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Issue credits
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-24 w-full rounded-xl" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl border border-[#E7E5E4] bg-[#F5F3FF] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EDE9FE]">
                    <CreditCard className="h-6 w-6 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Current balance</p>
                    <p className="text-2xl font-bold text-[#1C1917]">{balance} credits</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 font-medium text-[#1C1917]">Recent activity</h3>
                  {ledger.length === 0 ? (
                    <p className="text-sm text-slate-500">No activity yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {ledger.slice(0, 10).map((entry, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-[#E7E5E4] p-3"
                        >
                          <span className="font-medium text-[#1C1917]">{entry.type}</span>
                          <span className={entry.amount > 0 ? "text-emerald-600" : "text-rose-600"}>
                            {entry.amount > 0 ? "+" : ""}{entry.amount}
                          </span>
                          <span className="text-sm text-slate-500">{entry.description}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog open={issueModalOpen} onOpenChange={setIssueModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue credits</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-2">Amount</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2"
                placeholder="e.g. 1000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-[#E7E5E4] px-3 py-2"
                rows={2}
                placeholder="e.g. Promotional credits"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIssueModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                disabled={actionLoading || !amount || parseInt(amount, 10) <= 0}
              >
                Issue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
