"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { judges } from "@/data/seed"

export default function JudgesPage() {
  const judgesData = judges as Array<{
    id: string
    name: string
    role: string
    assigned: boolean
    scoresSubmitted: number
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Judges"
        subtitle="Assignment, scoring UI, and score management."
        variant="judges"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Add judge</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Assigned</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Scores submitted</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {judgesData.map((j) => (
                  <tr key={j.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{j.name}</td>
                    <td className="px-4 py-3 text-slate-400">{j.role}</td>
                    <td className="px-4 py-3">{j.assigned ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-slate-400">{j.scoresSubmitted}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Scoring</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Scoring UI">
        <Card>
          <CardContent>
            <p className="text-sm text-slate-400">Judge scoring interface for each stage and category.</p>
            <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Scoring UI placeholder
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
