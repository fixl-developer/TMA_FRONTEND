"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getEscrows, type Escrow } from "@/shared/services/modellingEscrowService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { Shield } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const statusStyles: Record<string, string> = {
  CREATED: "bg-slate-100 text-slate-600",
  FUNDED: "bg-[#FEF3C7] text-[#B8860B]",
  LOCKED: "bg-amber-100 text-amber-700",
  RELEASED: "bg-emerald-100 text-emerald-700",
  DISPUTED: "bg-rose-100 text-rose-600",
}

export default function ModellingEscrowsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }

  useEffect(() => {
    getEscrows(tenantId).then((data) => {
      setEscrows(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Escrows</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Fund, lock, release</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Escrows</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : escrows.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <Shield className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No escrows yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {escrows.map((e) => (
                  <Link
                    key={e._id}
                    href={`/modelling/finance/escrows/${e._id}`}
                    className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7]">
                          <Shield className="h-5 w-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>
                            {e.referenceType} · {e.referenceId}
                          </p>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            {formatCurrency(e.amountMinor, e.currency)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[e.status] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {e.status}
                        </span>
                      </div>
                      <span className="text-[#B8860B]">View</span>
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
