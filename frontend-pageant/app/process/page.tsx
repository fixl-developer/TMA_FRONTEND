"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { stages } from "@/data/seed"
import { cn } from "@/shared/lib/utils"

export default function ProcessBuilderPage() {
  const stagesData = stages as Array<{
    id: string
    name: string
    order: number
    type: string
    status: string
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Process Builder"
        subtitle="Stages, actions, and rules. Design your pageant flow."
        variant="process"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Add stage</Button>
      </div>
      <PageSection>
        <Card>
          <CardHeader><CardTitle>Stages</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stagesData.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4",
                    s.status === "active" ? "border-violet-500/50 bg-violet-500/10" : "border-slate-700 bg-slate-800/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-300">
                      {s.order}
                    </span>
                    <div>
                      <p className="font-medium text-slate-200">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      s.status === "active" && "bg-violet-500/20 text-violet-400",
                      s.status === "closed" && "bg-slate-600/50 text-slate-400",
                      s.status === "upcoming" && "bg-slate-600/50 text-slate-400"
                    )}>
                      {s.status}
                    </span>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Rules</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Actions & rules">
        <Card>
          <CardContent>
            <p className="text-sm text-slate-400">Configure stage actions (e.g. auto-advance, cutoff) and scoring rules.</p>
            <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Actions & rules config placeholder
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
