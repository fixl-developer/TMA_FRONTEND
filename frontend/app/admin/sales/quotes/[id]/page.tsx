"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getQuoteById, getAccountById, getQuoteTemplateById, formatCurrency } from "@/shared/services/salesService"
import { FileText } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REVISED: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-red-100 text-red-700",
}

export default function SalesQuoteDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { page } = useDashboardTheme()
  const [quote, setQuote] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getQuoteById(id).then(async (q) => {
      setQuote(q)
      if (q?.accountId) setAccount(await getAccountById(q.accountId))
      if (q?.templateId) setTemplate(await getQuoteTemplateById(q.templateId))
      setLoading(false)
    })
  }, [id])

  if (loading || !quote) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading quote…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={quote.quoteNumber}
        subtitle={account?.name ?? "Account"}
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
        <Link href={`/admin/crm/accounts/${quote.accountId}`}>
          <Button variant="outline" size="sm">View account</Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quote details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[quote.status] ?? "bg-slate-100"}`}>
                {quote.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">Valid until: {quote.validUntil}</p>
            {template && <p className="text-sm text-slate-600">Template: {template.name}</p>}
            {quote.sentAt && <p className="text-sm text-slate-600">Sent: {new Date(quote.sentAt).toLocaleString()}</p>}
            {quote.acceptedAt && <p className="text-sm text-emerald-600">Accepted: {new Date(quote.acceptedAt).toLocaleString()}</p>}
          </CardContent>
        </Card>

        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quote.lineItems?.map((line: any, i: number) => (
                <div key={i} className="flex justify-between rounded-lg border p-3" style={{ borderColor: page.border }}>
                  <div>
                    <p className="font-medium">{line.description}</p>
                    <p className="text-sm text-slate-500">Qty: {line.qty} × {formatCurrency(line.rateMinor, quote.currency)}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(line.amountMinor, quote.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t pt-4" style={{ borderColor: page.border }}>
              <p className="font-semibold">Total</p>
              <p className="font-bold text-amber-600">{formatCurrency(quote.totalMinor, quote.currency)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {quote.status === "DRAFT" && (
        <div className="mt-6 flex gap-3">
          <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">Send to client (coming soon)</Button>
          <Button variant="outline">Revise (coming soon)</Button>
        </div>
      )}
      {quote.status === "SENT" && (
        <div className="mt-6 flex gap-3">
          <Button className="bg-emerald-500 text-white hover:bg-emerald-400">Accept (client) (coming soon)</Button>
          <Button variant="outline">Request revision (coming soon)</Button>
        </div>
      )}
      {quote.status === "ACCEPTED" && (
        <div className="mt-6">
          <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
            <Link href={`/admin/contracts/create?quote=${quote._id}`}>Create contract from quote</Link>
          </Button>
        </div>
      )}
    </AgenciesPage>
  )
}
