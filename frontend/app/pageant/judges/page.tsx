"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getJudges, type Judge } from "@/shared/services/pageantDataService"
import { Award } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

export default function PageantJudgesPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const [judges, setJudges] = useState<Judge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJudges().then((data) => {
      setJudges(data)
      setLoading(false)
    })
  }, [])

  return (
    <AgenciesPage>
      <PageantPageHeader title="Judges" subtitle="Assignment, scoring UI." />
        <section className="mt-8">
          <Card variant={cardVariant}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Judges</CardTitle>
              <Button className="bg-violet-500 text-slate-800 hover:bg-violet-400">Add judge</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center" style={{ color: colors.textSoft }}>Loading judges…</p>
              ) : judges.length === 0 ? (
                <p className="py-8 text-center" style={{ color: colors.textSoft }}>No judges yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {judges.map((j) => (
                    <div
                      key={j._id}
                      className="rounded-xl border p-4 transition-all hover:shadow-md"
                      style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                          <Award className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: colors.text }}>{j.name}</p>
                          <p className="text-sm text-violet-600">{j.role}</p>
                          <p className="mt-1 text-xs" style={{ color: colors.textSoft }}>{j.category}</p>
                          <p className="mt-1 text-xs" style={{ color: colors.textSoft }}>Stages: {j.assignedStages.join(", ")}</p>
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
