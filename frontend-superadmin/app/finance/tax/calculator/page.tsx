"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calculator } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import taxConfig from "@/data/seed/taxConfig.json"

type TaxConfig = typeof taxConfig

export default function FinanceTaxCalculatorPage() {
  const cfg = taxConfig as TaxConfig
  const [amount, setAmount] = useState("100000")
  const [jurisdictionCode, setJurisdictionCode] = useState(cfg.defaultJurisdiction)
  const [category, setCategory] = useState("standard")

  const jurisdiction = useMemo(
    () => cfg.jurisdictions.find((j) => j.code === jurisdictionCode) ?? cfg.jurisdictions[0],
    [cfg.jurisdictions, jurisdictionCode]
  )

  const rate = useMemo(() => {
    if (category === "reduced") return jurisdiction.reducedRatePercent
    if (category === "zero") return jurisdiction.zeroRatePercent
    return jurisdiction.standardRatePercent
  }, [jurisdiction, category])

  const result = useMemo(() => {
    const base = Number(amount || "0")
    if (isNaN(base)) return null
    const tax = (base * rate) / 100
    const total = base + tax
    return { base, tax, total }
  }, [amount, rate])

  return (
    <PageLayout>
      <PageHeader
        title="Tax calculator"
        description="Input transaction details and calculate tax by jurisdiction with a simple seed-mode calculator."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Calculator className="h-3.5 w-3.5 text-[#0078d4]" />
            Calculator
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

      <PageSection title="Input">
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-3 text-sm text-[#323130]">
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">Amount (base currency)</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">Jurisdiction</p>
                <select
                  value={jurisdictionCode}
                  onChange={(e) => setJurisdictionCode(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                >
                  {cfg.jurisdictions.map((j) => (
                    <option key={j.code} value={j.code}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-[#605e5c]">Category</p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#323130] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
                >
                  <option value="standard">Standard rate</option>
                  <option value="reduced">Reduced rate</option>
                  <option value="zero">Zero-rated</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Result">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            {result ? (
              <>
                <p>
                  Tax rate:{" "}
                  <span className="font-semibold">
                    {rate}% ({jurisdiction.name})
                  </span>
                </p>
                <p className="mt-2">
                  Base amount: <span className="font-semibold">{result.base.toFixed(2)}</span>
                </p>
                <p>
                  Tax amount: <span className="font-semibold">{result.tax.toFixed(2)}</span>
                </p>
                <p>
                  Total incl. tax: <span className="font-semibold">{result.total.toFixed(2)}</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-[#605e5c]">
                Enter a valid amount to see the calculated tax.
              </p>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

