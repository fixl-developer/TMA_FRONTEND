"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getInvoiceById } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, FileText, Receipt } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminInvoiceDetailPage() {
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

  if (!invoice) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p className="text-slate-500">Invoice not found.</p>
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
        title={invoice.invoiceNumber}
        subtitle={invoice.clientName}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-slate-500 hover:text-slate-800">
          <Link href="/admin/finance/invoices" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[invoice.status] ?? ""}`}>
                {invoice.status}
              </span>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-700">Ownership & attribution</p>
                <p className="mt-1 text-xs text-slate-600">
                  Owner: {getOwnerName(invoice.ownerId) ?? invoice.ownerId ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Created by:{" "}
                  {getCreatorName(invoice.createdByUserId ?? invoice.createdBy) ??
                    invoice.createdByUserId ??
                    invoice.createdBy ??
                    "System"}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Created: {formatDateTime(invoice.createdAt)} · Updated: {formatDateTime(invoice.updatedAt)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-slate-500">Client</p>
                  <p className="text-slate-800">{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatCurrency(invoice.amountMinor, invoice.currency)}
                  </p>
                </div>
                {invoice.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">Due date</p>
                    <p className="text-slate-800">{invoice.dueDate}</p>
                  </div>
                )}
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">Paid at</p>
                    <p className="text-slate-800">{invoice.paidAt}</p>
                  </div>
                )}
              </div>
              {invoice.status === "PENDING" && (
                <CapabilityGate capability="ledger.transfer">
                  <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                    <Link href={`/admin/payments/checkout?invoiceId=${invoice._id}`}>
                      Pay via PSP (Razorpay)
                    </Link>
                  </Button>
                </CapabilityGate>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <CapabilityGate capability="exports.generate">
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CapabilityGate>
              {invoice.status === "PAID" && (
                <CapabilityGate capability="exports.generate">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/admin/finance/invoices/${invoice._id}/receipt`} className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      View receipt
                    </Link>
                  </Button>
                </CapabilityGate>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
