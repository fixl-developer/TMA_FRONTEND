"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getEscrowAccounts } from "@/shared/services/financeService"
import { getTenantName } from "@/shared/services/userService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"

export default function EscrowDisputesPage() {
  const [accounts, setAccounts] = useState<Awaited<ReturnType<typeof getEscrowAccounts>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { getEscrowAccounts().then(setAccounts).finally(() => setLoading(false)) }, [])

  const inDispute = accounts.filter((a) => a.status === "IN_DISPUTE")

  return (
    <PageLayout>
      <PageHeader title="Escrow disputes" description="Escrow accounts in dispute. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/escrow"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Escrow</Link></Button>} />
      <PageSection>
        <Card><CardContent className="p-0">
          {loading ? <div className="py-8 text-center text-sm text-[#605e5c]">Loading…</div> : inDispute.length === 0 ? <p className="p-4 text-sm text-[#605e5c]">No escrow in dispute in seed.</p> : (
            <ul className="divide-y divide-[#edebe9]">
              {inDispute.map((e) => <li key={e._id} className="flex items-center justify-between px-4 py-3"><div><p className="font-mono text-sm">{e._id}</p><p className="text-xs text-[#605e5c]">{getTenantName(e.tenantId)} · {e.referenceType}</p></div><span className="font-semibold">{formatCurrency(e.amountMinor, e.currency)}</span><Link href={`/finance/escrow/${e._id}`}><Button size="sm" variant="ghost" className="text-[#0078d4]">View</Button></Link></li>)}
            </ul>
          )}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
