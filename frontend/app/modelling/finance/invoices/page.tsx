"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getInvoices, type Invoice } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Receipt, Plus } from "lucide-react"
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

export default function ModellingInvoicesPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoices(tenantId).then((data) => {
      setInvoices(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Invoices</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Create, send, pay</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ color: theme.text }}>Invoices</CardTitle>
            <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
              <Link href="/modelling/finance/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                New invoice
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <Receipt className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No invoices yet.</p>
                <Button asChild className="mt-4 bg-[#B8860B] text-white hover:bg-[#9A7209]">
                  <Link href="/modelling/finance/invoices/new">Create first invoice</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <Link
                    key={inv._id}
                    href={`/modelling/finance/invoices/${inv._id}`}
                    className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7]">
                          <Receipt className="h-5 w-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>{inv.invoiceNumber}</p>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>{inv.clientName}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[inv.status] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#B8860B]">
                          {formatCurrency(inv.amountMinor, inv.currency)}
                        </p>
                        {inv.dueDate && (
                          <p className="text-xs" style={{ color: theme.textSecondary }}>Due {inv.dueDate}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
