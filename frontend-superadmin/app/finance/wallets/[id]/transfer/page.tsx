"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getWalletById, getWallets } from "@/shared/services/financeService"
import type { Wallet } from "@/shared/lib/types/finance"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function WalletTransferPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [toWalletId, setToWalletId] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (!id) return
    getWalletById(id).then(setWallet)
    getWallets().then(setWallets)
  }, [id])

  const handleSubmit = async () => {
    const amt = Number(amount)
    if (!toWalletId || !amt || amt <= 0) { showToast("Enter valid to-wallet and amount.", "warning"); return }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      showToast("Transfer submitted (UI only – backend later).", "success")
    } catch { showToast("Transfer failed.", "error") }
    finally { setSubmitting(false) }
  }

  if (!id) return <PageLayout><PageHeader title="Transfer" description="Invalid wallet id." /><Button asChild variant="outline" size="sm"><Link href="/finance/wallets">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader title={`Transfer from ${wallet?.id ?? id}`} description="Amount and reason. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href={`/finance/wallets/${id}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Wallet</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Transfer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>To wallet</Label>
              <select value={toWalletId} onChange={(e) => setToWalletId(e.target.value)} className="w-full max-w-md rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm">
                <option value="">Select wallet</option>
                {wallets.filter((w) => w.id !== id).map((w) => <option key={w.id} value={w.id}>{w.id} ({w.type})</option>)}
              </select>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="amount">Amount (minor units)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10000" />
            </div>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional" />
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting…" : "Submit transfer"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
