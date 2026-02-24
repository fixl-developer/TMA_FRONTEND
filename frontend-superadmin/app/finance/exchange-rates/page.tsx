"use client"

import Link from "next/link"
import { ArrowLeft, LineChart } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import exchangeRates from "@/data/seed/exchangeRates.json"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

type ExchangeRates = typeof exchangeRates
type RateRow = ExchangeRates["rates"][number]

export default function FinanceExchangeRatesPage() {
  const rates = exchangeRates as ExchangeRates

  const columns: Column<RateRow>[] = [
    {
      key: "code",
      header: "Currency",
      render: (v) => <span className="text-sm font-semibold text-[#323130]">{String(v)}</span>,
    },
    {
      key: "rate",
      header: `1 ${rates.baseCurrency} =`,
      render: (v, row) => (
        <span className="text-sm text-[#605e5c]">
          {Number(v).toFixed(4)} {row.code}
        </span>
      ),
    },
    {
      key: "manualOverride",
      header: "Override",
      render: (v) => (
        <span className="text-xs text-[#605e5c]">
          {v ? "Manual override" : "From provider"}
        </span>
      ),
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Exchange rates"
        description="Current rates, sources, update frequency, and history. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <LineChart className="h-3.5 w-3.5 text-[#0078d4]" />
            FX
          </span>
        }
        actions={
          <Link href="/finance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Finance
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            <p>
              Base currency: <span className="font-semibold">{rates.baseCurrency}</span>
            </p>
            <p className="mt-1 text-xs text-[#605e5c]">
              Source: {rates.source} · Last updated{" "}
              {new Date(rates.lastUpdated).toLocaleString("en-IN")} · Frequency: {rates.updateFrequency}
            </p>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Rates">
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={rates.rates}
              columns={columns}
              pageSize={10}
              exportable
              exportFileName="exchange-rates"
              emptyMessage="No exchange rates found."
            />
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

