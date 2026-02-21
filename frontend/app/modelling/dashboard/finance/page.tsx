"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getFinanceOverview, getRevenueByMonth } from "@/shared/services/modellingDashboardService"
import { getCreditsAccount, getStatements } from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wallet, Shield, Receipt, CreditCard, FileText } from "lucide-react"

function formatCurrency(amountMinor: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amountMinor / 100)
}

export default function FinanceDashboardPage() {
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
  const [overview, setOverview] = useState<{
    walletBalance: number
    escrowBalance: number
    pendingInvoices: number
    escrowCount: number
    invoiceCount: number
  } | null>(null)
  const [revenueByMonth, setRevenueByMonth] = useState<{ month: string; count: number }[]>([])
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [statementsCount, setStatementsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getFinanceOverview(tenantId),
      getRevenueByMonth(tenantId),
      getCreditsAccount(tenantId),
      getStatements(tenantId),
    ]).then(([o, r, c, s]) => {
      setOverview(o)
      setRevenueByMonth(r)
      setCreditsBalance(c?.balance ?? null)
      setStatementsCount(s?.length ?? 0)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Finance dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Wallet, escrow, payouts</p>
      </div>
      <div className="mt-6">
        <Link
          href="/modelling"
          className="text-sm font-medium text-[#B8860B] hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>

      <section className="mt-8 min-w-0">
        <h2 className="mb-4 text-sm font-semibold" style={{ color: theme.text }}>Overview</h2>
        {loading ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <LoadingSkeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : overview ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/modelling/finance/wallets"
              className="min-w-0 rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <Wallet className="h-5 w-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Wallet balance</p>
                  <p className="text-xl font-bold" style={{ color: theme.text }}>
                    {formatCurrency(overview.walletBalance)}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/modelling/finance/escrows"
              className="min-w-0 rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <Shield className="h-5 w-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Escrow balance</p>
                  <p className="text-xl font-bold" style={{ color: theme.text }}>
                    {formatCurrency(overview.escrowBalance)}
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>{overview.escrowCount} escrows</p>
                </div>
              </div>
            </Link>
            <Link
              href="/modelling/finance/invoices"
              className="min-w-0 rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <Receipt className="h-5 w-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Pending invoices</p>
                  <p className="text-xl font-bold" style={{ color: theme.text }}>
                    {formatCurrency(overview.pendingInvoices)}
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>{overview.invoiceCount} invoices</p>
                </div>
              </div>
            </Link>
            <Link
              href="/modelling/finance/credits"
              className="min-w-0 rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <CreditCard className="h-5 w-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Credits balance</p>
                  <p className="text-xl font-bold" style={{ color: theme.text }}>
                    {creditsBalance !== null ? creditsBalance.toLocaleString() : "—"}
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Platform credits</p>
                </div>
              </div>
            </Link>
            <Link
              href="/modelling/finance/statements"
              className="min-w-0 rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                  <FileText className="h-5 w-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Statements</p>
                  <p className="text-xl font-bold" style={{ color: theme.text }}>{statementsCount}</p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Period statements</p>
                </div>
              </div>
            </Link>
          </div>
        ) : null}
      </section>

      <section className="mt-8 min-w-0">
        <Card className="min-w-0 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Bookings by month</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton className="h-64 w-full rounded-xl" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                    <XAxis dataKey="month" stroke={theme.textSecondary} fontSize={12} />
                    <YAxis stroke={theme.textSecondary} fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${theme.border}`, backgroundColor: theme.cardBg }} />
                    <Bar dataKey="count" fill="#B8860B" radius={[4, 4, 0, 0]} name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
