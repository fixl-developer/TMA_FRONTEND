"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calculator } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function CommissionCalculatorPage() {
  const [amount, setAmount] = useState("")
  const [rate, setRate] = useState("5")
  const [result, setResult] = useState<number | null>(null)
  const { showToast } = useToast()

  const handleCalculate = () => {
    const a = Number(amount)
    const r = Number(rate)
    if (!a || a <= 0 || r < 0 || r > 100) { showToast("Enter valid amount and rate.", "warning"); return }
    setResult((a * r) / 100)
  }

  return (
    <PageLayout>
      <PageHeader title="Commission calculator" description="Preview calculation. Seed/UI only." badge={<span className="rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Calculator className="inline h-3.5 w-3.5 mr-1 text-[#0078d4]" />Calculator</span>} actions={<Button asChild variant="outline" size="sm"><Link href="/finance/commissions"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Commissions</Link></Button>} />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">Calculation preview</CardTitle><p className="text-sm text-[#605e5c]">Deal amount and rate. Backend POST /commissions/calculate not connected.</p></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Deal amount (₹)</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Commission rate (%)</Label>
                <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" />
              </div>
            </div>
            <Button size="sm" onClick={handleCalculate}>Calculate</Button>
            {result != null && <p className="text-lg font-semibold text-[#107c10]">Commission: ₹{(result / 100).toLocaleString("en-IN")}</p>}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
