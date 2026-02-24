"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getInvoiceById } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, Receipt } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageWrapper>
        <div className="py-12 text-center text-white/60">Loading…</div>
      </AdminPageWrapper>
    )
  }

  if (!invoice || invoice.status !== "PAID") {
    return (
      <AdminPageWrapper>
        <div className="py-12 text-center">
          <p className="text-white/60">Receipt not available.</p>
          <Link href="/admin/finance/invoices" className="mt-4 inline-block">
            <AdminButton variant="outline">Back to invoices</AdminButton>
          </Link>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Payment receipt"
        subtitle={invoice.invoiceNumber}
        actions={
          <Link href={`/admin/finance/invoices/${id}`}>
            <AdminButton variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to invoice
            </AdminButton>
          </Link>
        }
      >
        <div className="max-w-2xl">
          <AdminCard>
            <div className="flex items-center gap-2 mb-6">
              <Receipt className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Receipt</h3>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 p-4">
                <p className="text-sm font-medium text-emerald-300">Payment successful</p>
                <p className="text-xs text-emerald-400 mt-1">
                  Transaction ID: pay_rzp_{invoice._id.slice(-6)}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-white/60">Invoice</p>
                  <p className="text-white">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Client</p>
                  <p className="text-white">{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Amount paid</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(invoice.amountMinor, invoice.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Date paid</p>
                  <p className="text-white">{invoice.paidAt ?? "—"}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <AdminButton variant="outline">
                  Download receipt
                </AdminButton>
                <Link href="/admin/finance/invoices">
                  <AdminButton variant="outline">Back to invoices</AdminButton>
                </Link>
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
