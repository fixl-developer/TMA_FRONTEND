"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { getPageants } from "@/shared/services/pageantService"
import { Radio, ArrowRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const DEMO_TENANT = "tenant_002"

export default function LivePageantsListPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const [pageants, setPageants] = useState<any[]>([])

  useEffect(() => {
    getPageants(DEMO_TENANT).then(setPageants)
  }, [])

  return (
    <AgenciesPage>
      <PageantPageHeader title="Live pageants" subtitle="Real-time dashboards" />
        <section className="mt-8">
          <Card variant={cardVariant}>
            <CardContent className="pt-6">
              {pageants.length === 0 ? (
                <p className="py-12 text-center" style={{ color: colors.textSoft }}>No pageants yet.</p>
              ) : (
                <div className="space-y-4">
                  {pageants.map((p) => (
                    <Link key={p._id} href={`/pageant/${p._id}/live`}>
                      <div
                        className="flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md"
                        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                            <Radio className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: colors.text }}>{p.name}</p>
                            <p className="text-xs" style={{ color: colors.textSoft }}>{p.status}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4" style={{ color: colors.textSoft }} />
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
