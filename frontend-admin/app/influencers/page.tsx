"use client"

import { useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { influencerCampaigns } from "@/data/seed"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { cn } from "@/shared/lib/utils"

type Tab = "discovery" | "campaigns" | "reporting"

export default function InfluencersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("campaigns")

  const campaigns = influencerCampaigns as Array<{
    id: string
    brand: string
    title: string
    status: string
    deliverables: number
    completed: number
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "discovery", label: "Discovery" },
    { id: "campaigns", label: "Campaigns" },
    { id: "reporting", label: "Reporting" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Influencers"
        subtitle="Discover creators. Launch campaigns. Track deliverables. Measure impact."
        variant="influencers"
      />
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div className="flex gap-2 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "border-b-2 border-amber-500 text-amber-400"
                : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
        </div>
        <Button>New campaign</Button>
      </div>

      {activeTab === "discovery" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Search and filter influencers by niche, reach, and engagement.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Search and filters placeholder – integrate with discovery API
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "campaigns" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Brand</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Deliverables</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{c.brand}</td>
                      <td className="px-4 py-3 text-slate-400">{c.title}</td>
                      <td className="px-4 py-3">
                        <span className={c.status === "active" ? "text-emerald-400" : "text-slate-400"}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{c.completed} / {c.deliverables}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "reporting" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Deliverables, engagement metrics, and campaign reports.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Reports placeholder – integrate with analytics API
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
