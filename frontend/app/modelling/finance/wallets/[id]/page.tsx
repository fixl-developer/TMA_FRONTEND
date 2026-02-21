"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import {
  getWalletById,
  getLedgerEntries,
  type Wallet as WalletType,
  type LedgerEntry,
} from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { ArrowLeft, Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(Math.abs(amountMinor) / 100)
}

export default function WalletDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }
  const id = params.id as string
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 10

  useEffect(() => {
    if (!id) return
    getWalletById(id, tenantId).then((w) => {
      setWallet(w ?? null)
      setLoading(false)
    })
  }, [id, tenantId])

  useEffect(() => {
    if (!id) return
    getLedgerEntries(id, tenantId, page, pageSize).then(({ entries: e, total: t }) => {
      setEntries(e)
      setTotal(t)
    })
  }, [id, tenantId, page])

  if (loading && !wallet) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!wallet) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Wallet not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/finance/wallets">Back to wallets</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Wallet</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{wallet.currency}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/finance/wallets" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to wallets
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: theme.text }}>Balance</CardTitle>
              <Wallet className="h-5 w-5 text-[#B8860B]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#B8860B]">
                {formatCurrency(wallet.balanceMinor, wallet.currency)}
              </p>
              <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{wallet.currency} · Tenant wallet</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Ledger entries</CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="py-8 text-center" style={{ color: theme.textSecondary }}>No ledger entries.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {entries.map((e) => (
                      <div
                        key={e._id}
                        className="flex items-center justify-between rounded-lg border p-4"
                        style={{ borderColor: theme.border }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              e.direction === "INBOUND" ? "bg-emerald-100" : "bg-rose-100"
                            }`}
                          >
                            {e.direction === "INBOUND" ? (
                              <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: theme.text }}>{e.description}</p>
                            <p className="text-xs" style={{ color: theme.textSecondary }}>
                              {e.type} · {new Date(e.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              e.direction === "INBOUND" ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {e.direction === "INBOUND" ? "+" : "-"}
                            {formatCurrency(e.amountMinor, e.currency)}
                          </p>
                          <span
                            className={`text-xs ${
                              e.status === "SETTLED" ? "" : "text-amber-600"
                            }`}
                            style={e.status === "SETTLED" ? { color: theme.textSecondary } : {}}
                          >
                            {e.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm" style={{ color: theme.textSecondary }}>
                        Page {page} of {totalPages} ({total} entries)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border"
                          style={{ borderColor: theme.border }}
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border"
                          style={{ borderColor: theme.border }}
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
