"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { castings } from "@/data/seed"

export default function CastingsPage() {
  const castingsData = castings as Array<{
    id: string
    title: string
    client: string
    status: string
    submissions: number
    shortlisted: number
    deadline: string
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Castings"
        subtitle="Create, publish, and shortlist. Manage casting calls."
        variant="castings"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>New casting</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Submissions</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Shortlisted</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Deadline</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {castingsData.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{c.title}</td>
                    <td className="px-4 py-3 text-slate-400">{c.client}</td>
                    <td className="px-4 py-3">
                      <span className={c.status === "open" ? "text-emerald-400" : "text-slate-400"}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.submissions}</td>
                    <td className="px-4 py-3 text-slate-400">{c.shortlisted}</td>
                    <td className="px-4 py-3 text-slate-400">{c.deadline}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Shortlist</Button>
                    </td>
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
