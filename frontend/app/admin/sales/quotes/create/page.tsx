"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getQuoteTemplates, getRateCards, getAccounts, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function SalesQuoteCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [step, setStep] = useState(1)
  const [templates, setTemplates] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [rateCards, setRateCards] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [selectedRateCards, setSelectedRateCards] = useState<{ id: string; qty: number }[]>([])
  const [validDays, setValidDays] = useState(14)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      getQuoteTemplates(tenantId),
      getAccounts(tenantId),
      getRateCards(tenantId),
    ]).then(([t, a, r]) => {
      setTemplates(t)
      setAccounts(a)
      setRateCards(r)
      const templateId = searchParams?.get("template")
      if (templateId && t.some((x) => x._id === templateId)) {
        setSelectedTemplate(templateId)
        setStep(2)
        const tmpl = t.find((x) => x._id === templateId)
        if (tmpl?.defaultValidDays) setValidDays(tmpl.defaultValidDays)
      }
      setLoading(false)
    })
  }, [tenantId, searchParams])

  const template = templates.find((t) => t._id === selectedTemplate)
  const totalMinor = selectedRateCards.reduce((sum, sel) => {
    const rc = rateCards.find((r) => r._id === sel.id)
    return sum + (rc ? rc.rateMinor * sel.qty : 0)
  }, 0)

  const handleAddLine = (rateCardId: string) => {
    const existing = selectedRateCards.find((s) => s.id === rateCardId)
    if (existing) {
      setSelectedRateCards(selectedRateCards.map((s) => s.id === rateCardId ? { ...s, qty: s.qty + 1 } : s))
    } else {
      setSelectedRateCards([...selectedRateCards, { id: rateCardId, qty: 1 }])
    }
  }

  const handleRemoveLine = (rateCardId: string) => {
    setSelectedRateCards(selectedRateCards.filter((s) => s.id !== rateCardId))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    router.push("/admin/sales/quotes")
    setSubmitting(false)
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="Create quote"
        subtitle="Select template, account, and line items."
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/sales/quotes">
          <Button variant="ghost" size="sm">← Quotes</Button>
        </Link>
        <Link href="/admin/sales">
          <Button variant="ghost" size="sm">Sales</Button>
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant={step === 1 ? "default" : "outline"} size="sm" onClick={() => setStep(1)}>1. Template</Button>
        <Button variant={step === 2 ? "default" : "outline"} size="sm" onClick={() => setStep(2)}>2. Account</Button>
        <Button variant={step === 3 ? "default" : "outline"} size="sm" onClick={() => setStep(3)}>3. Line items</Button>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select template"}
            {step === 2 && "Select account"}
            {step === 3 && "Line items & totals"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => { setSelectedTemplate(t._id); setValidDays(t.defaultValidDays ?? 14); setStep(2) }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${selectedTemplate === t._id ? "border-amber-500 bg-amber-50" : "hover:bg-slate-50"}`}
                  style={{ borderColor: selectedTemplate === t._id ? undefined : page.border }}
                >
                  <div>
                    <p className="font-medium" style={{ color: page.text }}>{t.name}</p>
                    <p className="text-sm text-slate-500">{t.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {accounts.map((a) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => { setSelectedAccount(a._id); setStep(3) }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${selectedAccount === a._id ? "border-amber-500 bg-amber-50" : "hover:bg-slate-50"}`}
                  style={{ borderColor: selectedAccount === a._id ? undefined : page.border }}
                >
                  <div>
                    <p className="font-medium" style={{ color: page.text }}>{a.name}</p>
                    <p className="text-sm text-slate-500">{a.type} · {a.industry}</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Valid for (days)</Label>
                <Input type="number" value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} min={1} max={90} className="w-24" />
              </div>
              <div>
                <Label className="mb-2 block">Add line items from rate cards</Label>
                <div className="space-y-2">
                  {rateCards.map((r) => (
                    <div key={r._id} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: page.border }}>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-slate-500">{r.category} · {formatCurrency(r.rateMinor, r.currency)}/{r.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedRateCards.find((s) => s.id === r._id) && (
                          <span className="text-sm text-slate-600">Qty: {selectedRateCards.find((s) => s.id === r._id)!.qty}</span>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleAddLine(r._id)}>Add</Button>
                        {selectedRateCards.find((s) => s.id === r._id) && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveLine(r._id)}>Remove</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedRateCards.length > 0 && (
                <div className="rounded-lg border p-4" style={{ borderColor: page.border }}>
                  <p className="text-lg font-semibold">Total: {formatCurrency(totalMinor, "INR")}</p>
                  <p className="text-sm text-slate-500">Valid for {validDays} days</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" onClick={handleSubmit} disabled={selectedRateCards.length === 0 || submitting}>
                  {submitting ? "Creating…" : "Create quote"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
