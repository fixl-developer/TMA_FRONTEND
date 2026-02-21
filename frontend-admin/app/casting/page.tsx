"use client"

import { useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { castings, auditions, offers } from "@/data/seed"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { cn } from "@/shared/lib/utils"

type Tab = "castings" | "auditions" | "shortlists" | "offers"

export default function CastingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("castings")

  const castingsData = castings as Array<{
    id: string
    title: string
    status: string
    submissions: number
    shortlisted: number
    deadline: string
  }>
  const auditionsData = auditions as Array<{
    id: string
    castingId: string
    scheduledAt: string
    location: string
    slots: number
    booked: number
  }>
  const offersData = offers as Array<{
    id: string
    castingId: string
    talentId: string
    status: string
    amountMinor: number
    currency: string
    createdAt: string
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "castings", label: "Castings" },
    { id: "auditions", label: "Auditions" },
    { id: "shortlists", label: "Shortlists" },
    { id: "offers", label: "Offers" },
  ]

  const formatDate = (s: string) => new Date(s).toLocaleString()

  return (
    <PageLayout>
      <PageBanner
        title="Casting & Auditions"
        subtitle="Discover talent. Schedule auditions. Make offers. Close the deal."
        variant="casting"
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
        <Button>New casting</Button>
      </div>

      {activeTab === "castings" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
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
                      <td className="px-4 py-3">
                        <span className={c.status === "open" ? "text-emerald-400" : "text-slate-400"}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{c.submissions}</td>
                      <td className="px-4 py-3 text-slate-400">{c.shortlisted}</td>
                      <td className="px-4 py-3 text-slate-400">{c.deadline}</td>
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

      {activeTab === "auditions" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Casting</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Scheduled</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Location</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Slots</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditionsData.map((a) => (
                    <tr key={a.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{a.castingId}</td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(a.scheduledAt)}</td>
                      <td className="px-4 py-3 text-slate-400">{a.location}</td>
                      <td className="px-4 py-3 text-slate-400">{a.booked} / {a.slots}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "shortlists" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Shortlists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Bulk actions on shortlisted talents per casting.</p>
              <div className="mt-4 rounded-lg border border-slate-700 p-4">
                <p className="text-sm text-slate-400">Fashion Week Campaign: 3 shortlisted</p>
                <p className="text-sm text-slate-400">TV Commercial - Brand X: 2 shortlisted</p>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "offers" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Offer ID</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Talent</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offersData.map((o) => (
                    <tr key={o.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{o.id}</td>
                      <td className="px-4 py-3 text-slate-400">{o.talentId}</td>
                      <td className="px-4 py-3 text-slate-400">₹{(o.amountMinor / 100).toLocaleString()}</td>
                      <td className="px-4 py-3">{o.status}</td>
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
    </PageLayout>
  )
}
