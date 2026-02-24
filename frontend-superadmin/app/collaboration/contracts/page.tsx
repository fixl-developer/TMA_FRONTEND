"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import { getCollaborationContracts } from "@/shared/services/collaborationService"
import type { CollaborationContract } from "@/shared/lib/types/collaboration"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import { format } from "date-fns"

export default function CollaborationContractsPage() {
  const [contracts, setContracts] = useState<CollaborationContract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getCollaborationContracts().then(setContracts).finally(() => setLoading(false)) }, [])

  const columns: Column<CollaborationContract>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "title", header: "Contract", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
    { key: "roomName", header: "Room", render: (v) => <span className="text-sm">{String(v ?? "—")}</span> },
    {
      key: "tenantNames",
      header: "Parties",
      render: (_v, row) => <span className="text-sm">{row.tenantNames?.join(", ") ?? row.tenantIds.join(", ")}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const s = String(v)
        const cls = s === "ACTIVE" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : s === "COMPLETED" ? "border-[#0078d4] bg-[#deecf9] text-[#0078d4]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"
        return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
      },
    },
    { key: "createdAt", header: "Created", render: (v) => <span className="text-xs text-[#605e5c]">{v ? format(new Date(v as string), "PPp") : "—"}</span> },
    { key: "id", header: "Actions", sortable: false, render: (_v, row) => <Link href={`/collaboration/contracts/${row.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Cross-tenant contracts"
        description="All collaboration contracts. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><FileText className="h-3.5 w-3.5 text-[#0078d4]" />Contracts</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/collaboration/rooms"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rooms</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={contracts} columns={columns} pageSize={10} exportable exportFileName="collaboration-contracts" emptyMessage="No contracts in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
