"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { Workflow, LayoutTemplate, ArrowRight, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { useTenant } from "@/shared/context/TenantContext"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

export default function PageantProcessPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const { tenantId } = useTenant()
  const [pageants, setPageants] = useState<any[]>([])

  useEffect(() => {
    getPageants(tenantId ?? "tenant_002").then(setPageants)
  }, [tenantId])

  return (
    <AgenciesPage>
      <PageantPageHeader title="Process Builder" subtitle="Stages, actions, rules." />
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold" style={{ color: colors.title }}>Your pageants</h2>
            <div className="flex gap-2">
              <Link href="/pageant/builder/new">
                <Button variant="outline" className="transition-colors" style={{ borderColor: colors.border, color: colors.text }}>
                  <Plus className="mr-1.5 h-4 w-4" /> Create from scratch
                </Button>
              </Link>
              <Link href="/pageant/templates">
                <Button variant="outline" className="transition-colors" style={{ borderColor: colors.border, color: colors.text }}>
                  <LayoutTemplate className="mr-1.5 h-4 w-4" /> Use template
                </Button>
              </Link>
            </div>
          </div>
          <Card variant={cardVariant}>
            <CardContent className="pt-6">
              {pageants.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Workflow className="h-12 w-12" style={{ color: colors.textMuted }} />
                  <p className="mt-4 font-medium" style={{ color: colors.textMuted }}>No pageants yet</p>
                  <p className="mt-1 text-sm" style={{ color: colors.textSoft }}>Create one from a template or start from scratch.</p>
                  <Link href="/pageant/templates">
                    <Button className="mt-4 bg-violet-500 text-slate-800 hover:bg-violet-400">
                      Browse templates <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageants.map((p) => (
                    <div className="flex items-center gap-2">
                      <Link href={`/pageant/builder/${p._id}`} className="flex-1">
                        <div
                          className="flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md"
                          style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                              <Workflow className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: colors.text }}>{p.name}</p>
                              <p className="text-xs" style={{ color: colors.textSoft }}>{p.status}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4" style={{ color: colors.textSoft }} />
                        </div>
                      </Link>
                      <Link href={`/pageant/${p._id}/live`}>
                        <Button variant="outline" size="sm" className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10">
                          Live
                        </Button>
                      </Link>
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
