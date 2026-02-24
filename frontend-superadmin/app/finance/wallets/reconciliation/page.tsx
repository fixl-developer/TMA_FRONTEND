"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { getWallets } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"

export default function WalletReconciliationPage() {
  const [wallets, setWallets] = useState<Awaited<ReturnType<typeof getWallets>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getWallets().then(setWallets).finally(() => setLoading(false)) }, [])

  return (
    <PageLayout>
      <PageHeader title="Wallet reconciliation" description="Balance verification and discrepancy detection. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/wallets"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Wallets</Link></Button>} />
      <PageSection title="Verification status">
        <Card>
          <CardHeader><CardTitle className="text-sm">Balance verification</CardTitle><p className="text-xs text-[#605e5c]">Reconciliation reports will use real API. Seed shows wallet list.</p></CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-[#605e5c]">Loading…</p> : (
              <ul className="space-y-2">
                {wallets.map((w) => (
                  <li key={w.id} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-4 py-2 text-sm">
                    <span className="font-mono">{w.id}</span>
                    <span className="font-semibold">{formatCurrency(w.balanceMinor, w.currency)}</span>
                    <span className="inline-flex items-center gap-1 text-[#107c10]"><CheckCircle className="h-4 w-4" />OK</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
