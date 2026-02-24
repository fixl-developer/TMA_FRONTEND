"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getLedgerAccounts } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"
import type { LedgerAccount } from "@/shared/lib/types/finance"

export default function LedgerAccountsPage() {
  const [accounts, setAccounts] = useState<LedgerAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getLedgerAccounts().then(setAccounts).finally(() => setLoading(false)) }, [])

  const columns: Column<LedgerAccount>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
    { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "balanceMinor", header: "Balance", render: (v, row) => <span className="font-semibold">{formatCurrency(Number(v), row.currency)}</span> },
    { key: "id", header: "Actions", sortable: false, render: (_v, row) => <Link href={`/finance/ledger/entries?account=${row.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Entries</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader title="Ledger accounts" description="All ledger accounts. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/ledger"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Ledger</Link></Button>} />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={accounts} columns={columns} pageSize={10} exportable exportFileName="ledger-accounts" emptyMessage="No accounts in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
