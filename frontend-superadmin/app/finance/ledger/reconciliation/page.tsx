"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function LedgerReconciliationPage() {
  return (
    <PageLayout>
      <PageHeader title="Ledger reconciliation" description="Balance verification and entry matching. Seed/API later." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/ledger"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Ledger</Link></Button>} />
      <PageSection>
        <Card><CardContent className="py-8 text-center text-sm text-[#605e5c]">Reconciliation reports and discrepancy detection will use real API. Connect to GET /v1/superadmin/finance/ledger/reconciliation.</CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
