"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getPageantTemplates, type PageantTemplate } from "@/shared/services/pageantTemplateService"
import { LayoutTemplate, ArrowRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"

const categoryLabels: Record<string, string> = {
  BEAUTY: "Beauty",
  KIDS: "Kids",
  TALENT: "Talent Hunt",
  REALITY: "Reality",
}

export default function PageantTemplatesPage() {
  const [templates, setTemplates] = useState<PageantTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPageantTemplates().then((data) => {
      setTemplates(data)
      setLoading(false)
    })
  }, [])

  return (
    <AgenciesPage>
      <PageantPageHeader title="Template Library" subtitle="Pre-built pageant templates. Clone and customize." />
        <section className="mt-8">
          {loading ? (
            <p className="py-12 text-center text-slate-500">Loading templates…</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {templates.map((t) => (
                <Card key={t._id} className="flex flex-col overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                      <LayoutTemplate className="h-5 w-5 text-violet-600" />
                    </div>
                    <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-600">
                      {categoryLabels[t.category] ?? t.category}
                    </span>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <h3 className="font-semibold text-slate-800">{t.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{t.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {t.stages.slice(0, 3).map((s) => (
                        <span key={s.id} className="rounded bg-slate-200/80 px-1.5 py-0.5 text-xs text-slate-600">
                          {s.name}
                        </span>
                      ))}
                      {t.stages.length > 3 && (
                        <span className="text-xs text-slate-500">+{t.stages.length - 3}</span>
                      )}
                    </div>
                    <Link href={`/pageant/builder/new?template=${t._id}`}>
                      <Button className="mt-4 w-full bg-violet-500 text-slate-800 hover:bg-violet-400">
                        Use template <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </AgenciesPage>
  )
}
