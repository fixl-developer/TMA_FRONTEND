"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getInvoiceById } from "@/shared/services/modellingInvoiceService"
import { payInvoice } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { CreditCard, Wallet } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

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
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/wallet">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">← Back</Button>
          </Link>
          <PageBanner title="Payment" subtitle="Checkout" variant="admin" backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80" />
        </div>

        <div className="mx-auto max-w-xl">
          {submitted ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-lg font-semibold text-emerald-600">Payment successful</p>
                <p className="mt-1 text-sm text-slate-500">Demo mode: No actual charge.</p>
                <div className="mt-4 flex gap-2 justify-center">
                  {invoiceId && (
                    <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                      <Link href={`/admin/finance/invoices/${invoiceId}/receipt`}>View receipt</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link href={invoiceId ? `/admin/finance/invoices/${invoiceId}` : "/admin/wallet"}>
                      {invoiceId ? "Back to invoice" : "Back to wallet"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader><CardTitle>Fee breakdown</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{description}</span>
                    <span className="font-semibold text-slate-800">{formatCurrency(fee.amountMinor, fee.currency)}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Discount code"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 placeholder-slate-500"
                    />
                    <Button type="button" variant="outline" className="border-slate-200 text-slate-800">Apply</Button>
                  </div>
                  <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between">
                    <span className="font-medium text-slate-800">Total</span>
                    <span className="text-xl font-bold text-amber-600">{formatCurrency(fee.amountMinor, fee.currency)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="mb-6">
                <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${method === "card" ? "border-amber-500 bg-amber-500/10" : "border-slate-200"}`}>
                      <input type="radio" name="method" checked={method === "card"} onChange={() => setMethod("card")} className="text-amber-500" />
                      <CreditCard className="h-5 w-5 text-amber-600" />
                      <span className="text-slate-800">Card</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${method === "wallet" ? "border-amber-500 bg-amber-500/10" : "border-slate-200"}`}>
                      <input type="radio" name="method" checked={method === "wallet"} onChange={() => setMethod("wallet")} className="text-amber-500" />
                      <Wallet className="h-5 w-5 text-amber-600" />
                      <span className="text-slate-800">Wallet balance</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
              <Button type="submit" className="w-full bg-amber-500 py-6 text-slate-900 hover:bg-amber-400">Pay {formatCurrency(fee.amountMinor, fee.currency)}</Button>
            </form>
          )}
        </div>
      </AgenciesPage>
  )
}
