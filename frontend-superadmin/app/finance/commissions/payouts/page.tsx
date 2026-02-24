"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { getCommissionSettlements } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"

export default function CommissionPayoutsPage() {
  const [settlements, setSettlements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCommissionSettlements().then(setSettlements).finally(() => setLoading(false)) }, [])

  const columns: Column<any>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "tenantName", header: "Tenant", render: (v) => <span className="text-sm">{String(v ?? "—")}</span> },
    { key: "periodLabel", header: "Period", render: (v) => <span className="text-sm">{String(v ?? "—")}</span> },
    { key: "netPayable", header: "Net payable", render: (v, row) => <span className="font-semibold">{formatCurrency(Number(v ?? 0), row.currency ?? "INR")}</span> },
    { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "completed" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#ff8c00] bg-[#fff4ce] text-[#ff8c00]"}`}>{String(v)}</span> },
  ]

  return (
    <PageLayout>
      <PageHeader title="Payout scheduling" description="Scheduled payouts and batch processing. Seed data only." badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><CreditCard className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />Payouts</span>} actions={<Button asChild variant="outline" size="sm"><Link href="/finance/commissions"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Commissions</Link></Button>} />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={settlements} columns={columns} pageSize={10} exportable exportFileName="commission-payouts" emptyMessage="No payouts in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
