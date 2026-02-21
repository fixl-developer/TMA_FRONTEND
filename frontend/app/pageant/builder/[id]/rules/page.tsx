"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageants } from "@/shared/services/pageantService"
import { GitBranch, ArrowLeft, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const DEMO_RULES = [
  { id: "r1", condition: "Registration payment received", action: "Move to Prelims", status: "active" },
  { id: "r2", condition: "Prelims score < 60", action: "Eliminate", status: "active" },
  { id: "r3", condition: "Semi-finals top 10", action: "Move to Finals", status: "active" },
]

export default function RulesBuilderPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const params = useParams()
  const id = params.id as string
  const [pageant, setPageant] = useState<any>(null)
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

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Link href={`/pageant/builder/${id}`}>
            <Button variant="ghost" size="sm" style={{ color: colors.textSoft }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
          </Link>
          <PageantPageHeader title="Rule builder" subtitle={pageant.name} />
        </div>

        <Card variant={cardVariant}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>If / Then rules</CardTitle>
            <Button className="bg-violet-500 text-slate-800 hover:bg-violet-400">
              <Plus className="mr-1.5 h-4 w-4" /> Add rule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_RULES.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
                  style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                    <GitBranch className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: colors.text }}>If {r.condition}</p>
                    <p className="text-sm text-violet-600">Then {r.action}</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: colors.textSoft }}>Rules define automatic transitions and eliminations between stages.</p>
          </CardContent>
        </Card>
      </AgenciesPage>
  )
}
