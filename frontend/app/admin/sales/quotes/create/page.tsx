"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getQuoteTemplates, getRateCards, getAccounts, formatCurrency } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, ChevronRight, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminTableSkeleton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function SalesQuoteCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Create quote"
        subtitle="Select template, account, and line items"
        action={
          <div className="flex gap-2">
            <Link href="/admin/sales/quotes">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Quotes
              </AdminButton>
            </Link>
            <Link href="/admin/sales">
              <AdminButton variant="ghost" size="sm">Sales</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="mb-6 flex gap-2">
        <AdminButton variant={step === 1 ? "primary" : "secondary"} size="sm" onClick={() => setStep(1)}>1. Template</AdminButton>
        <AdminButton variant={step === 2 ? "primary" : "secondary"} size="sm" onClick={() => setStep(2)}>2. Account</AdminButton>
        <AdminButton variant={step === 3 ? "primary" : "secondary"} size="sm" onClick={() => setStep(3)}>3. Line items</AdminButton>
      </div>

      <AdminCard>
        <h2 className="mb-4 text-lg font-semibold text-white">
          {step === 1 && "Select template"}
          {step === 2 && "Select account"}
          {step === 3 && "Line items & totals"}
        </h2>
        {step === 1 && (
          <div className="space-y-3">
            {templates.map((t) => (
              <button
                key={t._id}
                type="button"
                onClick={() => { setSelectedTemplate(t._id); setValidDays(t.defaultValidDays ?? 14); setStep(2) }}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${selectedTemplate === t._id ? "border-[#d4ff00] bg-[#d4ff00]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <div>
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-sm text-white/60">{t.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/40" />
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
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${selectedAccount === a._id ? "border-[#d4ff00] bg-[#d4ff00]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <div>
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-sm text-white/60">{a.type} · {a.industry}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/40" />
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Valid for (days)</label>
              <input
                type="number"
                value={validDays}
                onChange={(e) => setValidDays(Number(e.target.value))}
                min={1}
                max={90}
                className="w-24 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Add line items from rate cards</label>
              <div className="space-y-2">
                {rateCards.map((r) => (
                  <div key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div>
                      <p className="font-medium text-white">{r.name}</p>
                      <p className="text-sm text-white/60">{r.category} · {formatCurrency(r.rateMinor, r.currency)}/{r.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRateCards.find((s) => s.id === r._id) && (
                        <span className="text-sm text-white/70">Qty: {selectedRateCards.find((s) => s.id === r._id)!.qty}</span>
                      )}
                      <AdminButton variant="secondary" size="sm" onClick={() => handleAddLine(r._id)}>Add</AdminButton>
                      {selectedRateCards.find((s) => s.id === r._id) && (
                        <AdminButton variant="ghost" size="sm" onClick={() => handleRemoveLine(r._id)}>Remove</AdminButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedRateCards.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-lg font-semibold text-white">Total: {formatCurrency(totalMinor, "INR")}</p>
                <p className="text-sm text-white/60">Valid for {validDays} days</p>
              </div>
            )}
            <div className="flex gap-3">
              <AdminButton variant="secondary" onClick={() => setStep(2)}>Back</AdminButton>
              <AdminButton variant="primary" onClick={handleSubmit} disabled={selectedRateCards.length === 0 || submitting}>
                {submitting ? "Creating…" : "Create quote"}
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
