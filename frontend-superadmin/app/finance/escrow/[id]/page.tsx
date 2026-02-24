"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, List, Send } from "lucide-react"
import type { EscrowAccount } from "@/shared/lib/types/finance"
import { getEscrowById } from "@/shared/services/financeService"
import { getTenantName } from "@/shared/services/userService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function EscrowDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [escrow, setEscrow] = useState<EscrowAccount | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (id) getEscrowById(id).then(setEscrow).finally(() => setLoading(false)) }, [id])

  if (!id) return <PageLayout><PageHeader title="Escrow" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/finance/escrow">Back</Link></Button></PageLayout>
  if (!escrow && !loading) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/finance/escrow">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader
        title={escrow?._id ?? id}
        description={`${escrow?.referenceType ?? "—"} · ${getTenantName(escrow?.tenantId ?? "")}. Seed data only.`}
        badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Shield className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />{escrow?.status ?? "—"}</span>}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/finance/escrow"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Escrow</Link></Button>
            <Link href={`/finance/escrow/${id}/milestones`}><Button variant="outline" size="sm" className="gap-1.5"><List className="h-3.5 w-3.5" />Milestones</Button></Link>
            <Link href={`/finance/escrow/${id}/release`}><Button size="sm" className="gap-1.5"><Send className="h-3.5 w-3.5" />Release</Button></Link>
          </div>
        }
      />
      <PageSection title="Account">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardHeader><CardTitle>Amount</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{escrow ? formatCurrency(escrow.amountMinor, escrow.currency) : "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className="rounded border px-2 py-1 text-sm font-medium border-[#0078d4] bg-[#deecf9] text-[#0078d4]">{escrow?.status ?? "—"}</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Reference</CardTitle></CardHeader><CardContent><p className="text-sm font-mono">{escrow?.referenceType ?? "—"} · {escrow?.referenceId ?? "—"}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Funded</CardTitle></CardHeader><CardContent><p className="text-sm">{escrow?.fundedAt ? format(new Date(escrow.fundedAt), "PPp") : "—"}</p></CardContent></Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
