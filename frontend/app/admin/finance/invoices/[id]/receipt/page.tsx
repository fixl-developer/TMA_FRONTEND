"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getInvoiceById } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, Receipt } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

export default function InvoiceReceiptPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const id = params.id as string
  const [invoice, setInvoice] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getInvoiceById(id, tenantId).then((inv) => {
      setInvoice(inv ?? null)
      setLoading(false)
    })
  }, [id, tenantId])

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center text-slate-500">Loading…</div>
      </AgenciesPage>
    )
  }

  if (!invoice || invoice.status !== "PAID") {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p className="text-slate-500">Receipt not available.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/finance/invoices">Back to invoices</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="Payment receipt"
        subtitle={invoice.invoiceNumber}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-500 hover:text-slate-800">
          <Link href={`/admin/finance/invoices/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to invoice
          </Link>
        </Button>
      </div>

      <div className="mt-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">Payment successful</p>
              <p className="text-xs text-emerald-600 mt-1">
                Transaction ID: pay_rzp_{invoice._id.slice(-6)}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-500">Invoice</p>
                <p className="text-slate-800">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Client</p>
                <p className="text-slate-800">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Amount paid</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(invoice.amountMinor, invoice.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Date paid</p>
                <p className="text-slate-800">{invoice.paidAt ?? "—"}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="border-slate-200">
                Download receipt
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/finance/invoices">Back to invoices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AgenciesPage>
  )
}
