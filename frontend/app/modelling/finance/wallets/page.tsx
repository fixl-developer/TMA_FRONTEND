"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getTenantWallets, type Wallet as WalletType } from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Wallet } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

export default function ModellingWalletsPage() {
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
  const [wallets, setWallets] = useState<WalletType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantWallets(tenantId).then((data) => {
      setWallets(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Wallets</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Cash balance, ledger</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Tenant wallets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <LoadingSkeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : wallets.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <Wallet className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No wallets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wallets.map((w) => (
                  <Link
                    key={w._id}
                    href={`/modelling/finance/wallets/${w._id}`}
                    className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FEF3C7]">
                          <Wallet className="h-6 w-6 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: theme.text }}>Tenant wallet</p>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>{w.currency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#B8860B]">
                          {formatCurrency(w.balanceMinor, w.currency)}
                        </p>
                        <span className="text-sm" style={{ color: theme.textSecondary }}>View ledger</span>
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
