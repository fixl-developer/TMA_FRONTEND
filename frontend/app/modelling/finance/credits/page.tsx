"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
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
  revokeCredits,
} from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { CreditCard, Plus, Minus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ModellingCreditsPage() {
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
  const [account, setAccount] = useState<{ balance: number } | null>(null)
  const [ledger, setLedger] = useState<{ type: string; amount: number; description: string; createdAt: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [actionModalOpen, setActionModalOpen] = useState<"issue" | "revoke" | null>(null)
  const [actionAmount, setActionAmount] = useState("")
  const [actionReason, setActionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    Promise.all([getCreditsAccount(tenantId), getCreditsLedger(tenantId)]).then(
      ([a, l]) => {
        setAccount(a ?? null)
        setLedger(l)
        setLoading(false)
      }
    )
  }, [tenantId])

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(actionAmount, 10)
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "warning")
      return
    }
    setActionLoading(true)
    await issueCredits(tenantId || "tenant_001", amount, actionReason, tenantId)
    setAccount((prev) => (prev ? { balance: prev.balance + amount } : { balance: amount }))
    setLedger((prev) => [
      { type: "ISSUE", amount, description: actionReason || "Credits issued", createdAt: new Date().toISOString() },
      ...prev,
    ])
    showToast(`${amount} credits issued (mock)`, "success")
    setActionModalOpen(null)
    setActionAmount("")
    setActionReason("")
    setActionLoading(false)
  }

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(actionAmount, 10)
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "warning")
      return
    }
    const balance = account?.balance ?? 0
    if (amount > balance) {
      showToast("Amount exceeds balance", "warning")
      return
    }
    setActionLoading(true)
    await revokeCredits(tenantId || "tenant_001", amount, actionReason, tenantId)
    setAccount((prev) => (prev ? { balance: prev.balance - amount } : { balance: 0 }))
    setLedger((prev) => [
      { type: "REVOKE", amount: -amount, description: actionReason || "Credits revoked", createdAt: new Date().toISOString() },
      ...prev,
    ])
    showToast(`${amount} credits revoked (mock)`, "success")
    setActionModalOpen(null)
    setActionAmount("")
    setActionReason("")
    setActionLoading(false)
  }

  const balance = account?.balance ?? 0

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Credits</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Platform credits, issue & revoke</p>
      </div>
      <section className="mt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: theme.text }}>Credits balance</CardTitle>
              <CreditCard className="h-5 w-5 text-[#B8860B]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSkeleton className="h-10 w-32" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-[#B8860B]">{balance.toLocaleString()}</p>
                  <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Platform credits</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#B8860B] hover:bg-[#9A7209]"
                      onClick={() => setActionModalOpen("issue")}
                    >
                      <Plus className="mr-1.5 h-4 w-4" />
                      Issue
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border"
                      style={{ borderColor: theme.border }}
                      onClick={() => setActionModalOpen("revoke")}
                    >
                      <Minus className="mr-1.5 h-4 w-4" />
                      Revoke
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
              <CardHeader>
                <CardTitle style={{ color: theme.text }}>Credits ledger</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSkeleton className="h-32 w-full rounded-lg" />
                ) : ledger.length === 0 ? (
                  <p className="py-8 text-center" style={{ color: theme.textSecondary }}>No credits activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {ledger.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: theme.border }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>{entry.description}</p>
                          <p className="text-xs" style={{ color: theme.textSecondary }}>
                            {entry.type} · {new Date(entry.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <p
                          className={`font-semibold ${
                            entry.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {entry.amount >= 0 ? "+" : ""}{entry.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={actionModalOpen !== null} onOpenChange={() => setActionModalOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionModalOpen === "issue" ? "Issue credits" : "Revoke credits"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={actionModalOpen === "issue" ? handleIssue : handleRevoke}
            className="space-y-4"
          >
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
                placeholder="e.g. 100"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}
                required
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Input
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Platform bonus"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActionModalOpen(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className={actionModalOpen === "revoke" ? "bg-rose-600 hover:bg-rose-700" : "bg-[#B8860B] hover:bg-[#9A7209]"}
                disabled={actionLoading}
              >
                {actionModalOpen === "issue" ? "Issue" : "Revoke"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
