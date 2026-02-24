"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"
import type { Policy } from "@/shared/lib/types/rbac"
import { getPolicies } from "@/shared/services/rbacService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getPolicies().then(setPolicies).finally(() => setLoading(false)) }, [])

  const columns: Column<Policy>[] = [
    { key: "id", header: "ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: "name", header: "Policy", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
    { key: "blueprint", header: "Blueprint", render: (v) => <span className="text-sm">{String(v)}</span> },
    { key: "type", header: "Type", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "deny" ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]" : v === "allow" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#0078d4] bg-[#deecf9] text-[#0078d4]"}`}>{String(v)}</span> },
    { key: "status", header: "Status", render: (v) => <span className={`rounded border px-2 py-0.5 text-xs font-medium ${v === "active" ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]" : "border-[#edebe9] bg-[#f3f2f1] text-[#605e5c]"}`}>{String(v)}</span> },
    { key: "priority", header: "Priority", render: (v) => <span className="text-sm">{Number(v)}</span> },
    { key: "id", header: "Actions", sortable: false, render: (_v, row) => <Link href={`/rbac/policies/${row.id}`}><Button size="sm" variant="ghost" className="h-7 text-xs text-[#0078d4]">Details</Button></Link> },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="ABAC policy builder"
        description="Policy list, editor, condition builder. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><FileText className="h-3.5 w-3.5 text-[#0078d4]" />Policies</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/rbac/roles"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Roles</Link></Button>}
      />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={policies} columns={columns} pageSize={10} exportable exportFileName="rbac-policies" emptyMessage="No policies in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
