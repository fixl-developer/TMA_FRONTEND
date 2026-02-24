"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { getEscrowAccounts } from "@/shared/services/financeService"
import { getTenantName } from "@/shared/services/userService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"
import type { EscrowAccount } from "@/shared/lib/types/finance"

export default function FinanceEscrowPage() {
  const [accounts, setAccounts] = useState<EscrowAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getEscrowAccounts().then(setAccounts).finally(() => setLoading(false)) }, [])

  const metrics = {
    total: accounts.length,
    inProgress: accounts.filter((a) => a.status === "IN_PROGRESS" || a.status === "ESCROW_FUNDED").length,
    settled: accounts.filter((a) => a.status === "SETTLED").length,
    inDispute: accounts.filter((a) => a.status === "IN_DISPUTE").length,
    totalAmount: accounts.reduce((s, a) => s + a.amountMinor, 0),
  }

  const columns: Column<EscrowAccount>[] = [
    { key: "_id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "tenantId", header: "Tenant", render: (v) => <span className="text-sm">{getTenantName(String(v))}</span> },
    { key: "referenceType", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "amountMinor", header: "Amount", render: (v, row) => <span className="font-semibold">{formatCurrency(Number(v), row.currency)}</span> },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls = s === "SETTLED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : s === "IN_DISPUTE" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" : "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
    { key: "_id", header: "Actions", sortable: false, render: (v, row) => <Link href={`/finance/escrow/${row._id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader title="Escrow accounts" description="All escrow accounts. Filter by status, tenant. Seed data only." badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="h-3.5 w-3.5 text-[#0078d4]" />Escrow</span>} actions={<Link href="/finance"><Button variant="outline" size="sm">Finance</Button></Link>} />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>In progress</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#0078d4]">{loading ? "—" : metrics.inProgress}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Settled</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.settled}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total amount</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#0078d4]">{loading ? "—" : formatCurrency(metrics.totalAmount, "INR")}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Escrow accounts">
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={accounts} columns={columns} pageSize={10} exportable exportFileName="escrow" emptyMessage="No escrow in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
