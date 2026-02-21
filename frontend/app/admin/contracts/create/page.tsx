"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getContractTemplates, formatCurrency } from "@/shared/services/contractService"
import { getAccounts, getQuoteById } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileSignature } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function ContractCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const { page } = useDashboardTheme()
  const [templates, setTemplates] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [quote, setQuote] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [projectName, setProjectName] = useState("")
  const [amountMinor, setAmountMinor] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const quoteId = searchParams?.get("quote")
  const templateIdFromUrl = searchParams?.get("template")

  useEffect(() => {
    const load = async () => {
      const [t, a] = await Promise.all([
        getContractTemplates(tenantId),
        getAccounts(tenantId),
      ])
      setTemplates(t)
      setAccounts(a)
      if (quoteId) {
        const q = await getQuoteById(quoteId)
        setQuote(q)
        if (q) {
          setAmountMinor(q.totalMinor)
          setProjectName(q.quoteNumber)
        }
      }
      if (templateIdFromUrl && t.some((x) => x._id === templateIdFromUrl)) {
        setSelectedTemplate(templateIdFromUrl)
      }
      setLoading(false)
    }
    load()
  }, [tenantId, quoteId, templateIdFromUrl])

  const handleSubmit = async () => {
    if (!selectedTemplate || !projectName || amountMinor <= 0) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    router.push("/admin/contracts")
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
        title="Create contract"
        subtitle={quote ? `From quote ${quote.quoteNumber}` : "From template"}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/contracts">
          <Button variant="ghost" size="sm">← Contracts</Button>
        </Link>
        {quote && (
          <Link href={`/admin/sales/quotes/${quote._id}`}>
            <Button variant="outline" size="sm">View quote</Button>
          </Link>
        )}
      </div>

      <Card className="mt-6 max-w-2xl" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Contract details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quote && (
            <div className="rounded-lg border p-4 bg-amber-50/50" style={{ borderColor: page.border }}>
              <p className="text-sm font-medium text-amber-800">From quote: {quote.quoteNumber}</p>
              <p className="text-sm text-slate-600">Total: {formatCurrency(quote.totalMinor, quote.currency)}</p>
            </div>
          )}
          <div>
            <Label>Template</Label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
            >
              <option value="">Select template</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Client / Account</Label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="project">Project name</Label>
            <Input id="project" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Spring Lookbook 2024" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" value={amountMinor ? amountMinor / 100 : ""} onChange={(e) => setAmountMinor(Number(e.target.value) * 100)} placeholder="150000" className="mt-2 w-40" />
          </div>
          <div className="flex gap-3">
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" onClick={handleSubmit} disabled={!selectedTemplate || !projectName || amountMinor <= 0 || submitting}>
              {submitting ? "Creating…" : "Create contract"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/contracts">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
