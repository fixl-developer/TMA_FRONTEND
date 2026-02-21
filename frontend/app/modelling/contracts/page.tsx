"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getContracts, type Contract } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { FileSignature, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SENT: "bg-[#FEF3C7] text-[#B8860B] border-[#E4A853]/50",
  SIGNED: "bg-emerald-100 text-emerald-700",
  VOID: "bg-rose-100 text-rose-600",
}

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

export default function ModellingContractsPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const [contracts, setContracts] = useState<(Contract & { talentName?: string })[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }

  useEffect(() => {
    getContracts(tenantId).then((data) => {
      setContracts(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Contracts</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Templates, e-sign flow.</p>
      </div>
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm" style={{ borderColor: theme.border }}>
              <Link href="/modelling/contracts/templates">Templates</Link>
            </Button>
            <Button asChild variant="outline" size="sm" style={{ borderColor: theme.border }}>
              <Link href="/modelling/contracts/clauses">Clauses library</Link>
            </Button>
          </div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ color: theme.text }}>Contracts</CardTitle>
              <Button asChild className="bg-[#B8860B] text-white hover:bg-[#9A7209]">
                <Link href="/modelling/contracts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New contract
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <LoadingSkeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : contracts.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  <FileSignature className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                  <p className="mt-4" style={{ color: theme.textSecondary }}>No contracts yet.</p>
                  <Button asChild className="mt-4 bg-[#B8860B] text-white hover:bg-[#9A7209]">
                    <Link href="/modelling/contracts/new">Create first contract</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((c) => (
                    <Link
                      key={c._id}
                      href={`/modelling/contracts/${c._id}`}
                      className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                      style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FEF3C7]">
                              <FileSignature className="h-4 w-4 text-[#B8860B]" />
                            </div>
                            <h3 className="font-semibold" style={{ color: theme.text }}>{c.projectName}</h3>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[c.status] ?? "bg-[#E7E5E4]/60 text-[#57534E]"}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>{c.clientName}</p>
                          <p className="mt-1 text-xs" style={{ color: theme.textSecondary }}>Talent: {c.talentName ?? c.talentId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#B8860B]">{formatCurrency(c.amountMinor, c.currency)}</p>
                          {c.signedAt && (
                            <p className="mt-1 text-xs" style={{ color: theme.textSecondary }}>
                              Signed {new Date(c.signedAt).toLocaleDateString("en-IN")}
                            </p>
                          )}
                          <span className="mt-2 inline-block text-sm text-[#B8860B] hover:underline">View</span>
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
