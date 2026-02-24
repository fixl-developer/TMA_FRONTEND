"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, List } from "lucide-react"
import type { CommissionRule } from "@/shared/lib/types/finance"
import { getCommissionRules } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function CommissionRulesPage() {
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCommissionRules().then(setRules).finally(() => setLoading(false)) }, [])

  const columns: Column<CommissionRule>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
    { key: "blueprint", header: "Blueprint", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "commissionType", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "rate", header: "Rate", render: (v, row) => <span className="text-sm">{row.rate != null ? `${row.rate}%` : row.tiers ? "tiered" : "—"}</span> },
    { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "active" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"}`}>{String(v)}</span> },
    { key: "id", header: "Actions", sortable: false, render: (_v, row) => <Link href={`/finance/commissions/rules/${row.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader title="Commission rules" description="All commission rules. Seed data only." badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><List className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />Rules</span>} actions={<Button asChild variant="outline" size="sm"><Link href="/finance/commissions"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Commissions</Link></Button>} />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={rules} columns={columns} pageSize={10} exportable exportFileName="commission-rules" emptyMessage="No rules in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
