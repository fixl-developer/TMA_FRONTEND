"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getEscrowById } from "@/shared/services/financeService"
import type { EscrowAccount } from "@/shared/lib/types/finance"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"
import { formatCurrency } from "@/shared/lib/utils"

export default function EscrowReleasePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [escrow, setEscrow] = useState<EscrowAccount | undefined>(undefined)
  const [amount, setAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => { if (id) getEscrowById(id).then(setEscrow) }, [id])

  const handleRelease = async () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) { showToast("Enter valid amount.", "warning"); return }
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Release submitted (UI only – backend later).", "success")
    } catch { showToast("Release failed.", "error") }
    finally { setSubmitting(false) }
  }

  if (!id) return <PageLayout><PageHeader title="Release" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/finance/escrow">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader title={`Release · ${escrow?._id ?? id}`} description="Release amount and confirmation. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href={`/finance/escrow/${id}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Escrow</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Release funds</CardTitle><p className="text-sm text-[#605e5c]">Escrow balance: {escrow ? formatCurrency(escrow.amountMinor, escrow.currency) : "—"}</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="amount">Amount (minor)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={escrow?.amountMinor?.toString()} />
            </div>
            <Button size="sm" onClick={handleRelease} disabled={submitting}>{submitting ? "Submitting…" : "Confirm release"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
