"use client"

import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import paymentAnalytics from "@/data/seed/paymentAnalytics.json"

type PaymentAnalytics = typeof paymentAnalytics

export default function PaymentsAnalyticsPage() {
  const stats = paymentAnalytics as PaymentAnalytics
  const totals = stats.totals

  return (
    <PageLayout>
      <PageHeader
        title="Payment analytics"
        description="Transaction volume, success rates, and gateway performance (seed data only)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <BarChart3 className="h-3.5 w-3.5 text-[#0078d4]" />
            Payments
          </span>
        }
        actions={
          <Link href="/integrations/payments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Payments
            </Button>
          </Link>
        }
      />

      <PageSection title="Key metrics">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Transactions</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{totals.transactions.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Volume (minor)</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{totals.volumeMinor.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Success rate</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#107c10]">{totals.successRatePercent}%</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Refund / chargeback</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ff8c00]">{totals.refundRatePercent}%</p>
              <p className="mt-1 text-xs text-[#605e5c]">Chargebacks: {totals.chargebackRatePercent}%</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="By gateway">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            <div className="space-y-3">
              {stats.byGateway.map((g) => (
                <div
                  key={g.provider}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#323130]">{g.name}</p>
                    <p className="text-xs text-[#605e5c]">{g.transactions.toLocaleString()} tx</p>
                  </div>
                  <div className="text-right text-xs text-[#605e5c]">
                    <p>Volume: {g.volumeMinor.toLocaleString()}</p>
                    <p>Success: {g.successRatePercent}%</p>
                    <p>Refunds: {g.refundRatePercent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

