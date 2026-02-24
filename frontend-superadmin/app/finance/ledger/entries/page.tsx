"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getLedgerEntries } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"
import type { LedgerEntry } from "@/shared/lib/types/finance"

export default function LedgerEntriesPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getLedgerEntries().then(setEntries).finally(() => setLoading(false)) }, [])

  const columns: Column<LedgerEntry>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "accountId", header: "Account", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "type", header: "Type", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "CREDIT" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#a80000] bg-[#fde7e9] text-[#a80000]"}`}>{String(v)}</span> },
    { key: "amountMinor", header: "Amount", render: (v, row) => <span className="font-semibold">{formatCurrency(Number(v), row.currency)}</span> },
    { key: "description", header: "Description", render: (v) => <span className="text-sm">{String(v ?? "—")}</span> },
    { key: "createdAt", header: "Date", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span> },
  ]

  return (
    <PageLayout>
      <PageHeader title="Journal entries" description="Append-only ledger entries. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/ledger"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Ledger</Link></Button>} />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={entries} columns={columns} pageSize={10} exportable exportFileName="ledger-entries" emptyMessage="No entries in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
