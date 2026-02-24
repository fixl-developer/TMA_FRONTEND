"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Wallet2, Plus, ArrowLeft } from "lucide-react"
import type { Wallet } from "@/shared/lib/types/finance"
import { getWallets } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"

export default function FinanceWalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWallets().then(setWallets).finally(() => setLoading(false))
  }, [])

  const metrics = {
    total: wallets.length,
    active: wallets.filter((w) => w.status === "ACTIVE").length,
    frozen: wallets.filter((w) => w.frozen).length,
    totalBalance: wallets.reduce((s, w) => s + w.balanceMinor, 0),
  }

  const columns: Column<Wallet>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "ownerId", header: "Owner", render: (v) => <span className="text-sm font-mono">{String(v)}</span> },
    {
      key: "balanceMinor",
      header: "Balance",
      render: (v, row) => <span className="font-semibold text-[#107c10]">{formatCurrency(Number(v), row.currency)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span className={`rounded border px-2 py-0.5 text-xs font-medium ${
          v === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" :
          v === "FROZEN" ? "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]" :
          "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
        }`}>{String(v)}</span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      sortable: false,
      render: (_v, row) => (
        <div className="flex gap-1">
          <Link href={`/finance/wallets/${row.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button></Link>
          <Link href={`/finance/wallets/${row.id}/transfer`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#605e5c]">Transfer</Button></Link>
        </div>
      ),
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Wallets"
        description="Platform, tenant, and talent wallets. Filter by type, status. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Wallet2 className="h-3.5 w-3.5 text-[#0078d4]" />Wallets</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/finance"><Button variant="outline" size="sm">Finance</Button></Link>
            <Link href="/finance/wallets/create"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create wallet</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Total wallets</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : metrics.total}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#107c10]">{loading ? "—" : metrics.active}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Frozen</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : metrics.frozen}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total balance</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#0078d4]">{loading ? "—" : formatCurrency(metrics.totalBalance, "INR")}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Wallets">
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : (
            <DataTable data={wallets} columns={columns} pageSize={10} exportable exportFileName="wallets" emptyMessage="No wallets in seed." />
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
