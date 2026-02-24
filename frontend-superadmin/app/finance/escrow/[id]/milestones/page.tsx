"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getEscrowById } from "@/shared/services/financeService"
import type { EscrowAccount } from "@/shared/lib/types/finance"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"

export default function EscrowMilestonesPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [escrow, setEscrow] = useState<EscrowAccount | undefined>(undefined)

  useEffect(() => { if (id) getEscrowById(id).then(setEscrow) }, [id])

  const milestones = escrow?.milestones ?? []

  return (
    <PageLayout>
      <PageHeader title={`Milestones · ${escrow?._id ?? id}`} description="Add/edit milestones. Seed/UI only." actions={<Button asChild variant="outline" size="sm"><Link href={`/finance/escrow/${id}`}><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Escrow</Link></Button>} />
      <PageSection>
        <Card><CardContent className="pt-4">
          {milestones.length === 0 ? <p className="text-sm text-[#605e5c]">No milestones in seed. Full milestone management will use API.</p> : (
            <ul className="space-y-2">
              {milestones.map((m) => <li key={m.id} className="flex items-center justify-between rounded border border-[#edebe9] px-4 py-2 text-sm"><span>{m.name}</span><span>{formatCurrency(m.amountMinor, escrow?.currency ?? "INR")}</span><span className="rounded border px-2 py-0.5 text-xs">{m.status}</span></li>)}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
