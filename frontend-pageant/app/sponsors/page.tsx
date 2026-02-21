"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { cn } from "@/shared/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { sponsors } from "@/data/seed"

export default function SponsorsPage() {
  const sponsorsData = sponsors as Array<{
    id: string
    name: string
    tier: string
    visibility: string
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Sponsors"
        subtitle="Integration, visibility, and sponsor management."
        variant="sponsors"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Add sponsor</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Tier</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Visibility</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sponsorsData.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{s.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        s.tier === "platinum" && "bg-slate-400/30 text-slate-300",
                        s.tier === "gold" && "bg-amber-500/20 text-amber-400",
                        s.tier === "silver" && "bg-slate-500/30 text-slate-400"
                      )}>
                        {s.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{s.visibility}</td>
                    <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
