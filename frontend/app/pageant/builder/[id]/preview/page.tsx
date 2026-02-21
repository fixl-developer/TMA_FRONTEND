"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantTemplates } from "@/shared/services/pageantTemplateService"
import { Play, ArrowLeft, ChevronRight, User } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const DEMO_STAGES = [
  { id: "reg", name: "Registration", status: "completed" },
  { id: "prelims", name: "Prelims", status: "current" },
  { id: "semi", name: "Semi-finals", status: "upcoming" },
  { id: "finals", name: "Finals", status: "upcoming" },
]

export default function PreviewSimulationPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
  const [stages, setStages] = useState(DEMO_STAGES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id === "new") {
      getPageantTemplates().then((templates) => {
        const t = templates[0]
        if (t) {
          setPageant({ _id: "new", name: t.name })
          setStages(t.stages.map((s, i) => ({ id: s.id, name: s.name, status: i === 0 ? "completed" : i === 1 ? "current" : "upcoming" })))
        } else {
          setPageant({ _id: "new", name: "New pageant" })
        }
        setLoading(false)
      })
    } else {
      getPageants().then((pageants) => {
        const p = pageants.find((x) => x._id === id)
        setPageant(p ?? null)
        setLoading(false)
      })
    }
  }, [id])

  if (loading || !pageant) {
    return <p className="py-12 text-center" style={{ color: colors.textSoft }}>Loading…</p>
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href={`/pageant/builder/${id}`}>
            <Button variant="ghost" size="sm" style={{ color: colors.textSoft }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title="Preview & simulation" subtitle={pageant.name} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card variant={cardVariant} className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Participant journey</CardTitle>
              <Button size="sm" className="bg-violet-500 text-slate-800 hover:bg-violet-400">
                <Play className="mr-1.5 h-4 w-4" /> Simulate
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stages.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      s.status === "completed"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : s.status === "current"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-slate-700 bg-slate-800/30"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        s.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : s.status === "current"
                          ? "bg-violet-500/30 text-violet-600"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {s.status === "completed" ? "✓" : <User className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: colors.text }}>{s.name}</p>
                      <p className="text-xs" style={{ color: colors.textSoft }}>
                        {s.status === "completed" ? "Completed" : s.status === "current" ? "Current stage" : "Upcoming"}
                      </p>
                    </div>
                    {s.status !== "upcoming" && <ChevronRight className="h-4 w-4" style={{ color: colors.textSoft }} />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant={cardVariant}>
            <CardHeader><CardTitle>Simulation</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm" style={{ color: colors.textSoft }}>
                Test different scenarios by simulating a participant&apos;s journey through the stages.
              </p>
              <div className="mt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full" style={{ borderColor: colors.border, color: colors.text }}>
                  Pass all stages
                </Button>
                <Button variant="outline" size="sm" className="w-full" style={{ borderColor: colors.border, color: colors.text }}>
                  Eliminate at Prelims
                </Button>
                <Button variant="outline" size="sm" className="w-full" style={{ borderColor: colors.border, color: colors.text }}>
                  Skip to Finals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AgenciesPage>
  )
}
