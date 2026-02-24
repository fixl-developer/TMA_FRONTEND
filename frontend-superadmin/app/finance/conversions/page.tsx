"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRightLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import conversionHistory from "@/data/seed/conversionHistory.json"
import exchangeRates from "@/data/seed/exchangeRates.json"

type Conversion = (typeof conversionHistory)[number]
type ExchangeRates = typeof exchangeRates

export default function FinanceConversionsPage() {
  const conversions = conversionHistory as Conversion[]
  const rates = exchangeRates as ExchangeRates

  const [fromCurrency, setFromCurrency] = useState("INR")
  const [toCurrency, setToCurrency] = useState("USD")
  const [amount, setAmount] = useState("100000")

  const rate = useMemo(() => {
    if (fromCurrency === rates.baseCurrency) {
      const r = rates.rates.find((r) => r.code === toCurrency)
      return r?.rate ?? null
    }
    return null // keep simple in seed mode
  }, [fromCurrency, toCurrency, rates])

  const estimated = useMemo(() => {
    const amt = Number(amount || "0")
    if (!rate || isNaN(amt)) return null
    return amt * rate
  }, [amount, rate])

  const columns: Column<Conversion>[] = [
    {
      key: "_id",
      header: "Conversion",
      render: (v, row) => (
        <div>
          <p className="text-sm font-semibold text-[#323130]">{String(v)}</p>
          <p className="text-xs text-[#605e5c]">
            {new Date(String(row.createdAt)).toLocaleString("en-IN")}
          </p>
        </div>
      ),
    },
    {
      key: "fromCurrency",
      header: "From",
      render: (_v, row) => (
        <span className="text-sm text-[#605e5c]">
          {row.amountFrom.toLocaleString()} {row.fromCurrency}
        </span>
      ),
    },
    {
      key: "toCurrency",
      header: "To",
      render: (_v, row) => (
        <span className="text-sm text-[#605e5c]">
          {row.amountTo.toLocaleString()} {row.toCurrency}
        </span>
      ),
    },
    {
      key: "rateUsed",
      header: "Rate",
      render: (v, row) => (
        <span className="text-sm text-[#605e5c]">
          1 {rates.baseCurrency} = {v} {row.toCurrency}
        </span>
      ),
    },
    {
      key: "feePercent",
      header: "Fee",
      render: (v, row) => (
        <span className="text-sm text-[#605e5c]">
          {v}% ({row.feeAmount})
        </span>
      ),
    },
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Currency conversions"
        description="Conversion calculator, conversion history, and fee configuration (seed UI only)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <ArrowRightLeft className="h-3.5 w-3.5 text-[#0078d4]" />
            FX conversions
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

      <PageSection title="Conversion calculator">
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-3 text-sm text-[#323130]">
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">Amount (INR)</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">From</p>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                >
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">To</p>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                >
                  {rates.rates.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-[#323130]">
              {estimated != null && rate != null ? (
                <p>
                  {amount || 0} {fromCurrency} ≈{" "}
                  <span className="font-semibold">
                    {estimated.toFixed(2)} {toCurrency}
                  </span>{" "}
                  at rate {rate.toFixed(4)} ({rates.baseCurrency} → {toCurrency})
                </p>
              ) : (
                <p className="text-xs text-[#605e5c]">
                  Calculator currently supports {rates.baseCurrency} as the source currency (seed mode).
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Conversion history">
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={conversions}
              columns={columns}
              pageSize={10}
              exportable
              exportFileName="currency-conversions"
              emptyMessage="No conversion history in seed data."
            />
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

