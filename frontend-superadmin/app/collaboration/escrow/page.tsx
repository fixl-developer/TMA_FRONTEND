"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { getCollaborationEscrow } from "@/shared/services/collaborationService"
import type { CollaborationEscrow } from "@/shared/lib/types/collaboration"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function CollaborationEscrowPage() {
  const [escrow, setEscrow] = useState<CollaborationEscrow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCollaborationEscrow().then(setEscrow).finally(() => setLoading(false)) }, [])

  const columns: Column<CollaborationEscrow>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "roomId", header: "Room", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "amountMinor", header: "Amount", render: (v, row) => <span className="font-semibold text-[#107c10]">{formatCurrency(Number(v), row.currency)}</span> },
    { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "SETTLED" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"}`}>{String(v)}</span> },
    { key: "createdAt", header: "Created", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span> },
    { key: "id", header: "Actions", sortable: false, render: (_v, row) => <Link href={`/collaboration/rooms/${row.roomId}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">View room</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Cross-tenant escrow"
        description="Escrow accounts for collaborations. Multi-party releases, dispute handling. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="h-3.5 w-3.5 text-[#0078d4]" />Escrow</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rooms</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={escrow} columns={columns} pageSize={10} exportable exportFileName="collaboration-escrow" emptyMessage="No escrow accounts in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
