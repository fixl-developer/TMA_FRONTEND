"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { getPageantTemplates } from "@/shared/services/pageantTemplateService"
import { BarChart3, ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const DEMO_CRITERIA = [
  { id: "c1", name: "Ramp walk", weight: 25 },
  { id: "c2", name: "Q&A", weight: 30 },
  { id: "c3", name: "Talent", weight: 25 },
  { id: "c4", name: "Personality", weight: 20 },
]

export default function ScoringConfigPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
  const [criteria, setCriteria] = useState(DEMO_CRITERIA)
  const [blindScoring, setBlindScoring] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id === "new") {
      setPageant({ _id: "new", name: "New pageant" })
      setLoading(false)
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

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0)

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href={`/pageant/builder/${id}`}>
            <Button variant="ghost" size="sm" style={{ color: colors.textSoft }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title="Scoring configuration" subtitle={pageant.name} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card variant={cardVariant} className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Criteria & weights</CardTitle>
              <span className="text-sm" style={{ color: colors.textSoft }}>Total: {totalWeight}%</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteria.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                  >
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: colors.text }}>{c.name}</p>
                      <p className="text-xs" style={{ color: colors.textSoft }}>Max score: 100</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={c.weight}
                        onChange={(e) =>
                          setCriteria((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, weight: Number(e.target.value) } : x))
                          )
                        }
                        className="h-2 w-24 rounded bg-slate-600"
                      />
                      <span className="w-12 text-right font-semibold text-violet-600">{c.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant={cardVariant}>
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between rounded-lg border p-4" style={{ borderColor: colors.border }}>
                  <span className="text-sm" style={{ color: colors.textMuted }}>Blind scoring</span>
                  <button
                    type="button"
                    onClick={() => setBlindScoring(!blindScoring)}
                    className={`flex h-8 w-14 items-center rounded-full transition-colors ${
                      blindScoring ? "bg-violet-500" : "bg-slate-600"
                    }`}
                  >
                    <span className={`ml-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${blindScoring ? "translate-x-6" : ""}`} />
                  </button>
                </label>
                <p className="text-xs" style={{ color: colors.textSoft }}>
                  {blindScoring ? "Judges cannot see participant identity" : "Judges can see participant identity"}
                </p>
                <div className="rounded-lg border p-4" style={{ borderColor: colors.border }}>
                  <p className="text-xs font-medium" style={{ color: colors.textSoft }}>Tie-breaker</p>
                  <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>Q&A score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AgenciesPage>
  )
}
