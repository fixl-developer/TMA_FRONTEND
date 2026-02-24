"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Globe2 } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import financeCurrencies from "@/data/seed/financeCurrencies.json"
import exchangeRates from "@/data/seed/exchangeRates.json"

type Currency = (typeof financeCurrencies)[number]
type ExchangeRates = typeof exchangeRates

export default function FinanceCurrencyDetailPage() {
  const params = useParams<{ code: string }>()
  const code = (params?.code ?? "").toUpperCase()
  const currencies = financeCurrencies as Currency[]
  const rates = exchangeRates as ExchangeRates

  const currency = currencies.find((c) => c.code === code)
  const rateInfo = rates.rates.find((r) => r.code === code)

  if (!currency) {
    return (
      <PageLayout>
        <PageHeader title={`Currency ${code}`} description="Not found in seed data." />
        <Button asChild variant="outline" size="sm">
          <Link href="/finance/currencies">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to currencies
          </Link>
        </Button>
      </PageLayout>
    )
  }

  const tenantsCount = currency.tenantsUsing.length

  return (
    <PageLayout>
      <PageHeader
        title={`${currency.code} · ${currency.name}`}
        description="Currency information, exchange rate history, usage statistics, and configuration options. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Globe2 className="h-3.5 w-3.5 text-[#0078d4]" />
            {currency.region}
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/finance/currencies">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Currencies
            </Link>
          </Button>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Status</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{currency.status}</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                {currency.enabledForNewTenants ? "Enabled for new tenants" : "Off by default"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Region</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{currency.region}</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Defaults for: {currency.defaultForCountries.join(", ")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Tenants</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4]">{tenantsCount}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Using this currency</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Precision</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">{currency.precision} decimals</p>
              <p className="mt-1 text-xs text-[#605e5c]">Wallet & pricing rounding</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Exchange rate (vs INR)">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            {rateInfo ? (
              <>
                <p>
                  1 {currency.code} = {(1 / rateInfo.rate).toFixed(2)} INR · 1 INR = {rateInfo.rate.toFixed(4)}{" "}
                  {currency.code}
                </p>
                <p className="mt-1 text-xs text-[#605e5c]">
                  Source: {rates.source} · Last updated{" "}
                  {new Date(rates.lastUpdated).toLocaleString("en-IN")}
                </p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-[#605e5c] mb-1">Recent history</p>
                  <ul className="space-y-0.5 text-xs text-[#605e5c]">
                    {rateInfo.history.slice(-5).map((h) => (
                      <li key={h.date}>
                        {h.date}: 1 INR = {h.rate.toFixed(4)} {currency.code}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>No exchange rate data available in seed for this currency.</p>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

