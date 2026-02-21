"use client"

import { useState } from "react"
import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { talents } from "@/data/seed"
import { cn } from "@/shared/lib/utils"

type Tab = "profiles" | "portfolios" | "pipelines"

export default function TalentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profiles")

  const talentsData = talents as Array<{
    id: string
    name: string
    status: string
    pipeline: string
    bookings: number
    lastCasting: string | null
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "profiles", label: "Profiles" },
    { id: "portfolios", label: "Portfolios" },
    { id: "pipelines", label: "Pipelines" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Talent CRM"
        subtitle="Profiles, portfolios, and pipelines. Manage your roster."
        variant="talent"
      />
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div className="flex gap-2 border-b border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === t.id ? "border-b-2 border-amber-500 text-amber-400" : "text-slate-400 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button>Add talent</Button>
      </div>

      {activeTab === "profiles" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Pipeline</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Bookings</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Last casting</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {talentsData.map((t) => (
                    <tr key={t.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{t.name}</td>
                      <td className="px-4 py-3">
                        <span className={t.status === "active" ? "text-emerald-400" : "text-amber-400"}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{t.pipeline}</td>
                      <td className="px-4 py-3 text-slate-400">{t.bookings}</td>
                      <td className="px-4 py-3 text-slate-400">{t.lastCasting ?? "—"}</td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "portfolios" && (
        <PageSection>
          <Card>
            <CardHeader><CardTitle>Portfolios</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Headshots, comp cards, and lookbook assets per talent.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Portfolio gallery placeholder – integrate with assets API
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "pipelines" && (
        <PageSection>
          <Card>
            <CardHeader><CardTitle>Pipeline stages</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                {["new", "shortlisted", "signed", "active"].map((stage) => (
                  <div key={stage} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">{stage}</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      {talentsData.filter((t) => t.pipeline === stage).length}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
