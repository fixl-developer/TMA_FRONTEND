"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getClauses, type Clause } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { FileText } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ClausesLibraryPage() {
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
  const [clauses, setClauses] = useState<Clause[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClauses(tenantId).then((data) => {
      setClauses(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Clauses library</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Reusable contract clauses</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Clauses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <LoadingSkeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : clauses.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <FileText className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No clauses yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clauses.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-xl border p-5"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: theme.text }}>{c.name}</h3>
                          {c.category && (
                            <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#B8860B]">
                              {c.category}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
