"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getInvoiceById } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { ArrowLeft, FileText, Receipt } from "lucide-react"
import { getCreatorName, getOwnerName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
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
      <AdminPageWrapper>
        <div className="py-12 text-center text-white/60">Loading…</div>
      </AdminPageWrapper>
    )
  }

  if (!invoice) {
    return (
      <AdminPageWrapper>
        <div className="py-12 text-center">
          <p className="text-white/60">Invoice not found.</p>
          <Link href="/admin/finance/invoices" className="mt-4 inline-block">
            <AdminButton variant="secondary">Back to invoices</AdminButton>
          </Link>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={invoice.invoiceNumber}
        subtitle={invoice.clientName}
        action={
          <Link href="/admin/finance/invoices">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to invoices
            </AdminButton>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCard>
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-white/60" />
              <h2 className="text-lg font-semibold text-white">Invoice details</h2>
            </div>
            <div className="space-y-4">
              <AdminBadge variant={
                invoice.status === "PAID" ? "success" :
                invoice.status === "PENDING" ? "warning" : "default"
              }>
                {invoice.status}
              </AdminBadge>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs font-medium text-white/80">Ownership & attribution</p>
                <p className="mt-1 text-xs text-white/60">
                  Owner: {getOwnerName(invoice.ownerId) ?? invoice.ownerId ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Created by:{" "}
                  {getCreatorName(invoice.createdByUserId ?? invoice.createdBy) ??
                    invoice.createdByUserId ??
                    invoice.createdBy ??
                    "System"}
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Created: {formatDateTime(invoice.createdAt)} · Updated: {formatDateTime(invoice.updatedAt)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-white/60">Client</p>
                  <p className="text-white">{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Amount</p>
                  <p className="text-xl font-bold text-[#d4ff00]">
                    {formatCurrency(invoice.amountMinor, invoice.currency)}
                  </p>
                </div>
                {invoice.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-white/60">Due date</p>
                    <p className="text-white">{invoice.dueDate}</p>
                  </div>
                )}
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm font-medium text-white/60">Paid at</p>
                    <p className="text-white">{invoice.paidAt}</p>
                  </div>
                )}
              </div>
              {invoice.status === "PENDING" && (
                <CapabilityGate capability="ledger.transfer">
                  <Link href={`/admin/payments/checkout?invoiceId=${invoice._id}`}>
                    <AdminButton variant="primary">Pay via PSP (Razorpay)</AdminButton>
                  </Link>
                </CapabilityGate>
              )}
            </div>
          </AdminCard>
        </div>

        <div>
          <AdminCard>
            <h2 className="mb-4 text-lg font-semibold text-white">Actions</h2>
            <div className="space-y-2">
              <CapabilityGate capability="exports.generate">
                <AdminButton variant="secondary" className="w-full">
                  Download PDF
                </AdminButton>
              </CapabilityGate>
              {invoice.status === "PAID" && (
                <CapabilityGate capability="exports.generate">
                  <Link href={`/admin/finance/invoices/${invoice._id}/receipt`} className="block">
                    <AdminButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <Receipt className="h-4 w-4" />
                      View receipt
                    </AdminButton>
                  </Link>
                </CapabilityGate>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
