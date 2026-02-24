"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getInvoiceById, payInvoice } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { CreditCard, Wallet, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

const DEMO_FEE = { amountMinor: 15000, currency: "INR", description: "Pageant registration fee" }

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const invoiceId = searchParams.get("invoiceId")
  const [invoice, setInvoice] = useState<{ amountMinor: number; currency: string; invoiceNumber: string; clientName: string } | null>(null)
  const [method, setMethod] = useState<"card" | "wallet">("card")
  const [discountCode, setDiscountCode] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (invoiceId) {
      getInvoiceById(invoiceId, tenantId).then((inv) => {
        if (inv) setInvoice(inv)
      })
    }
  }, [invoiceId, tenantId])

  const fee = invoice ?? DEMO_FEE
  const description = invoice ? `Invoice ${invoice.invoiceNumber} · ${invoice.clientName}` : DEMO_FEE.description

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (invoiceId) {
      await payInvoice(invoiceId, tenantId)
    }
    setSubmitted(true)
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Payment"
        subtitle="Checkout"
        action={
          <Link href="/admin/wallet">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </AdminButton>
          </Link>
        }
      />

      <div className="mx-auto max-w-xl">
        {submitted ? (
          <AdminCard>
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-emerald-400">Payment successful</p>
              <p className="mt-1 text-sm text-white/60">Demo mode: No actual charge.</p>
              <div className="mt-4 flex gap-2 justify-center">
                {invoiceId && (
                  <Link href={`/admin/finance/invoices/${invoiceId}/receipt`}>
                    <AdminButton variant="primary">View receipt</AdminButton>
                  </Link>
                )}
                <Link href={invoiceId ? `/admin/finance/invoices/${invoiceId}` : "/admin/wallet"}>
                  <AdminButton variant="secondary">
                    {invoiceId ? "Back to invoice" : "Back to wallet"}
                  </AdminButton>
                </Link>
              </div>
            </div>
          </AdminCard>
        ) : (
          <form onSubmit={handleSubmit}>
            <AdminCard className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Fee breakdown</h3>
              <div className="flex justify-between">
                <span className="text-white/60">{description}</span>
                <span className="font-semibold text-white">{formatCurrency(fee.amountMinor, fee.currency)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <AdminButton type="button" variant="secondary">Apply</AdminButton>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 flex justify-between">
                <span className="font-medium text-white">Total</span>
                <span className="text-xl font-bold text-[#d4ff00]">{formatCurrency(fee.amountMinor, fee.currency)}</span>
              </div>
            </AdminCard>
            <AdminCard className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Payment method</h3>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${method === "card" ? "border-[#d4ff00] bg-[#d4ff00]/10" : "border-white/10 bg-white/5"}`}>
                  <input type="radio" name="method" checked={method === "card"} onChange={() => setMethod("card")} className="text-[#d4ff00]" />
                  <CreditCard className="h-5 w-5 text-[#d4ff00]" />
                  <span className="text-white">Card</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${method === "wallet" ? "border-[#d4ff00] bg-[#d4ff00]/10" : "border-white/10 bg-white/5"}`}>
                  <input type="radio" name="method" checked={method === "wallet"} onChange={() => setMethod("wallet")} className="text-[#d4ff00]" />
                  <Wallet className="h-5 w-5 text-[#d4ff00]" />
                  <span className="text-white">Wallet balance</span>
                </label>
              </div>
            </AdminCard>
            <AdminButton type="submit" variant="primary" className="w-full py-6">
              Pay {formatCurrency(fee.amountMinor, fee.currency)}
            </AdminButton>
          </form>
        )}
      </div>
    </AdminPageWrapper>
  )
}
