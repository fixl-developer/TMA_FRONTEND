"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import {
  getInvoiceById,
  finalizeInvoice,
  payInvoice,
  type Invoice,
} from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, Receipt } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  PENDING: "bg-[#FEF3C7] text-[#B8860B]",
  PAID: "bg-emerald-100 text-emerald-700",
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }
  const id = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [payModalOpen, setPayModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getInvoiceById(id, tenantId).then((i) => {
      setInvoice(i ?? null)
      setLoading(false)
    })
  }, [id, tenantId])

  const handleFinalize = async () => {
    setActionLoading(true)
    await finalizeInvoice(id, tenantId)
    setInvoice((i) => (i ? { ...i, status: "PENDING" } : null))
    showToast("Invoice finalized (mock)", "success")
    setActionLoading(false)
  }

  const handlePay = async () => {
    setActionLoading(true)
    await payInvoice(id, tenantId)
    setInvoice((i) => (i ? { ...i, status: "PAID", paidAt: new Date().toISOString().split("T")[0] } : null))
    showToast("Opening mock checkout (mock)", "info")
    setPayModalOpen(false)
    setActionLoading(false)
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!invoice) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Invoice not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/finance/invoices">Back to invoices</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{invoice.invoiceNumber}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{invoice.clientName}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/finance/invoices" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Invoice details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[invoice.status] ?? ""}`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Client</p>
                  <p style={{ color: theme.text }}>{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Amount</p>
                  <p className="text-xl font-bold text-[#B8860B]">
                    {formatCurrency(invoice.amountMinor, invoice.currency)}
                  </p>
                </div>
                {invoice.dueDate && (
                  <div>
                    <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Due date</p>
                    <p style={{ color: theme.text }}>{invoice.dueDate}</p>
                  </div>
                )}
                {invoice.paidAt && (
                  <div>
                    <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Paid at</p>
                    <p style={{ color: theme.text }}>{invoice.paidAt}</p>
                  </div>
                )}
              </div>
              {invoice.description && (
                <p className="text-sm" style={{ color: theme.textSecondary }}>{invoice.description}</p>
              )}
              {invoice.status === "DRAFT" && (
                <Button
                  className="bg-[#B8860B] hover:bg-[#9A7209]"
                  onClick={handleFinalize}
                  disabled={actionLoading}
                >
                  Finalize
                </Button>
              )}
              {invoice.status === "PENDING" && (
                <Button
                  className="bg-[#B8860B] hover:bg-[#9A7209]"
                  onClick={() => setPayModalOpen(true)}
                  disabled={actionLoading}
                >
                  Pay (mock checkout)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border" style={{ borderColor: theme.border }}>
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mock checkout</DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            Pay {formatCurrency(invoice.amountMinor, invoice.currency)} for {invoice.invoiceNumber}?
          </p>
          <DialogFooter>
            <Button variant="outline" className="border" style={{ borderColor: theme.border }} onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#B8860B] hover:bg-[#9A7209]"
              onClick={handlePay}
              disabled={actionLoading}
            >
              Confirm payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
