"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DollarSign, ArrowLeft, List, Calculator, CreditCard } from "lucide-react"
import { getCommissionRules, getCommissionSettlements } from "@/shared/services/financeService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { formatCurrency } from "@/shared/lib/utils"

export default function FinanceCommissionsPage() {
  const [rules, setRules] = useState<Awaited<ReturnType<typeof getCommissionRules>>>([])
  const [settlements, setSettlements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCommissionRules(), getCommissionSettlements()]).then(([r, s]) => {
      setRules(r)
      setSettlements(s)
    }).finally(() => setLoading(false))
  }, [])

  const totalCommission = settlements.reduce((s, x) => s + (x.totalCommission ?? 0), 0)
  const pending = settlements.filter((x) => x.status === "pending_approval" || x.status === "in_progress").length

  return (
    <PageLayout>
      <PageHeader
        title="Commissions"
        description="Commission rules, calculation preview, and payout scheduling. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><DollarSign className="h-3.5 w-3.5 text-[#0078d4]" />Commissions</span>}
        actions={<Link href="/finance"><Button variant="outline" size="sm">Finance</Button></Link>}
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Active rules</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loading ? "—" : rules.length}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total commission (seed)</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loading ? "—" : formatCurrency(totalCommission, "INR")}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Pending settlements</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#ff8c00]">{loading ? "—" : pending}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Quick links">
        <div className="flex flex-wrap gap-2">
          <Link href="/finance/commissions/rules"><Button variant="outline" size="sm" className="gap-1.5"><List className="h-3.5 w-3.5" />Rules</Button></Link>
          <Link href="/finance/commissions/calculator"><Button variant="outline" size="sm" className="gap-1.5"><Calculator className="h-3.5 w-3.5" />Calculator</Button></Link>
          <Link href="/finance/commissions/payouts"><Button variant="outline" size="sm" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" />Payouts</Button></Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
