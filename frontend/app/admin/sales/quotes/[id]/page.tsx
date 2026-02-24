"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getQuoteById, getAccountById, getQuoteTemplateById, formatCurrency } from "@/shared/services/salesService"
import { FileText, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function SalesQuoteDetailPage() {
  const params = useParams()
  const id = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading quote…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={quote.quoteNumber}
        subtitle={account?.name ?? "Account"}
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
            <Link href={`/admin/crm/accounts/${quote.accountId}`}>
              <AdminButton variant="secondary" size="sm">View account</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Quote details</h2>
          </div>
          <div className="space-y-3">
            <AdminBadge variant={
              quote.status === "ACCEPTED" ? "success" :
              quote.status === "SENT" ? "info" :
              quote.status === "EXPIRED" ? "danger" :
              quote.status === "REVISED" ? "warning" : "default"
            }>
              {quote.status}
            </AdminBadge>
            <p className="text-sm text-white/70">Valid until: {quote.validUntil}</p>
            {template && <p className="text-sm text-white/70">Template: {template.name}</p>}
            {quote.sentAt && <p className="text-sm text-white/70">Sent: {new Date(quote.sentAt).toLocaleString()}</p>}
            {quote.acceptedAt && <p className="text-sm text-emerald-400">Accepted: {new Date(quote.acceptedAt).toLocaleString()}</p>}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Line items</h2>
          <div className="space-y-3">
            {quote.lineItems?.map((line: any, i: number) => (
              <div key={i} className="flex justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium text-white">{line.description}</p>
                  <p className="text-sm text-white/60">Qty: {line.qty} × {formatCurrency(line.rateMinor, quote.currency)}</p>
                </div>
                <span className="font-semibold text-white">{formatCurrency(line.amountMinor, quote.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
            <p className="font-semibold text-white">Total</p>
            <p className="font-bold text-[#d4ff00]">{formatCurrency(quote.totalMinor, quote.currency)}</p>
          </div>
        </AdminCard>
      </div>

      {quote.status === "DRAFT" && (
        <div className="flex gap-3">
          <AdminButton variant="primary">Send to client (coming soon)</AdminButton>
          <AdminButton variant="secondary">Revise (coming soon)</AdminButton>
        </div>
      )}
      {quote.status === "SENT" && (
        <div className="flex gap-3">
          <AdminButton variant="primary">Accept (client) (coming soon)</AdminButton>
          <AdminButton variant="secondary">Request revision (coming soon)</AdminButton>
        </div>
      )}
      {quote.status === "ACCEPTED" && (
        <Link href={`/admin/contracts/create?quote=${quote._id}`}>
          <AdminButton variant="primary">Create contract from quote</AdminButton>
        </Link>
      )}
    </AdminPageWrapper>
  )
}
