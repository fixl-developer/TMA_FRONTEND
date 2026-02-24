"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { getLedgerAccounts, getLedgerEntries } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function LedgerOverviewPage() {
  const [accounts, setAccounts] = useState<Awaited<ReturnType<typeof getLedgerAccounts>>>([])
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof getLedgerEntries>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getLedgerAccounts(), getLedgerEntries()]).then(([a, e]) => {
      setAccounts(a)
      setEntries(e)
    }).finally(() => setLoading(false))
  }, [])

  const totalBalance = accounts.reduce((s, a) => s + a.balanceMinor, 0)
  const recentEntries = entries.slice(0, 10)

  return (
    <PageLayout>
      <PageHeader title="Ledger overview" description="Account balances and recent entries. Seed data only." badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><BookOpen className="h-3.5 w-3.5 text-[#0078d4]" />Ledger</span>} actions={<Link href="/finance"><Button variant="outline" size="sm">Finance</Button></Link>} />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Accounts</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : accounts.length}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Entries</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : entries.length}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total balance (asset)</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#0078d4]">{loading ? "—" : formatCurrency(totalBalance, "INR")}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Recent entries">
        <Card><CardContent className="p-0">
          {loading ? <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div> : (
            <ul className="divide-y divide-[#edebe9]">
              {recentEntries.map((e) => <li key={e.id} className="flex items-center justify-between px-4 py-3 text-sm"><div><p className="font-medium">{e.description ?? e.type}</p><p className="text-xs text-[#605e5c]">{format(new Date(e.createdAt), "PPp")}</p></div><span className={e.type === "CREDIT" ? "text-[#107c10]" : "text-[#a80000]"}>{e.type} {formatCurrency(e.amountMinor, e.currency)}</span></li>)}
            </ul>
          )}
          <div className="border-t border-[#edebe9] px-4 py-2"><Link href="/finance/ledger/entries"><Button size="sm" variant="outline">View all entries</Button></Link></div>
        </CardContent></Card>
      </PageSection>
      <PageSection title="Quick links">
        <div className="flex flex-wrap gap-2">
          <Link href="/finance/ledger/accounts"><Button variant="outline" size="sm">Ledger accounts</Button></Link>
          <Link href="/finance/ledger/entries"><Button variant="outline" size="sm">Journal entries</Button></Link>
          <Link href="/finance/ledger/reconciliation"><Button variant="outline" size="sm">Reconciliation</Button></Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
