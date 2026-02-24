"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Wallet2 } from "lucide-react"
import type { Wallet } from "@/shared/lib/types/finance"
import { getWalletById } from "@/shared/services/financeService"
import { getRecentTransactions } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function WalletDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [transactions, setTransactions] = useState<Awaited<ReturnType<typeof getRecentTransactions>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getWalletById(id).then(setWallet)
    getRecentTransactions().then((tx) => setTransactions(tx.slice(0, 15))).finally(() => setLoading(false))
  }, [id])

  if (!id) return <PageLayout><PageHeader title="Wallet" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/finance/wallets">Back</Link></Button></PageLayout>
  if (!wallet && !loading) return <PageLayout><PageHeader title={`Wallet ${id}`} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/finance/wallets">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={wallet?.id ?? id}
        description={`${wallet?.type ?? "—"} · ${wallet?.ownerId ?? "—"}. Seed data only.`}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Wallet2 className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{wallet?.status ?? "—"}</span>}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/finance/wallets"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Wallets</Link></Button>
            <Link href={`/finance/wallets/${id}/transfer`}><Button size="sm">Transfer</Button></Link>
          </div>
        }
      />
      <PageSection title="Balance & status">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Balance</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loading || !wallet ? "—" : formatCurrency(wallet.balanceMinor, wallet.currency)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className={`rounded border px-2 py-1 text-sm ${wallet?.status === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1]"}`}>{wallet?.status ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Frozen</CardTitle></CardHeader><CardContent><p className="text-lg font-medium">{wallet?.frozen ? "Yes" : "No"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Currency</CardTitle></CardHeader><CardContent><p className="text-lg font-medium">{wallet?.currency ?? "—"}</p></CardContent></Card>
        </div>
      </PageSection>
      <PageSection title="Recent transactions">
        <Card><CardContent className="p-0">
          {loading ? <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div> : (
            <ul className="divide-y divide-[#edebe9]">
              {transactions.map((t) => (
                <li key={t._id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div><p className="font-medium">{t.description || t.type}</p><p className="text-xs text-[#605e5c]">{t.createdAt ? format(new Date(t.createdAt), "PPp") : "—"}</p></div>
                  <span className={t.direction === "INBOUND" ? "text-[#107c10]" : t.direction === "OUTBOUND" ? "text-[#a80000]" : "text-[#605e5c]"}>{formatCurrency(t.amountMinor, t.currency)}</span>
                </li>
              ))}
              {transactions.length === 0 && <li className="px-4 py-8 text-center text-[#605e5c]">No transactions in seed.</li>}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
