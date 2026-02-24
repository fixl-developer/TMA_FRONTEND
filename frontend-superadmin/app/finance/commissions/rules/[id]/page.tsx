"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { CommissionRule } from "@/shared/lib/types/finance"
import { getCommissionRuleById } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

export default function CommissionRuleDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [rule, setRule] = useState<CommissionRule | undefined>(undefined)

  useEffect(() => { if (id) getCommissionRuleById(id).then(setRule) }, [id])

  if (!id) return <PageLayout><PageHeader title="Rule" description="Invalid id." /><Button asChild variant="outline" size="sm"><Link href="/finance/commissions/rules">Back</Link></Button></PageLayout>
  if (!rule) return <PageLayout><PageHeader title={id} description="Not found." /><Button asChild variant="outline" size="sm"><Link href="/finance/commissions/rules">Back</Link></Button></PageLayout>

  return (
    <PageLayout>
      <PageHeader title={rule.name} description={rule.description ?? "Commission rule details. Seed data only." actions={<Button asChild variant="outline" size="sm"><Link href="/finance/commissions/rules"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Rules</Link></Button>} />
      <PageSection title="Configuration">
        <Card><CardContent className="pt-4 space-y-2 text-sm">
          <p><strong>Blueprint:</strong> {rule.blueprint}</p>
          <p><strong>Role type:</strong> {rule.roleType}</p>
          <p><strong>Commission type:</strong> {rule.commissionType}</p>
          {rule.rate != null && <p><strong>Rate:</strong> {rule.rate}%</p>}
          {rule.tiers && rule.tiers.length > 0 && <p><strong>Tiers:</strong> {rule.tiers.map((t) => `${t.min}-${t.max ?? "∞"} @ ${t.rate}%`).join(", ")}</p>}
          <p><strong>Applicable on:</strong> {rule.applicableOn}</p>
          <p><strong>Status:</strong> {rule.status}</p>
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
