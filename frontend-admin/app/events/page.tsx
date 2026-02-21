"use client"

import { useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { events, judges } from "@/data/seed"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { cn } from "@/shared/lib/utils"

type Tab = "events" | "judges" | "voting" | "tickets"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("events")

  const eventsData = events as Array<{
    id: string
    title: string
    type: string
    status: string
    startDate: string
    endDate: string
    registrations: number
  }>
  const judgesData = judges as Array<{
    id: string
    eventId: string
    name: string
    role: string
    assigned: boolean
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "events", label: "Events" },
    { id: "judges", label: "Judges" },
    { id: "voting", label: "Voting" },
    { id: "tickets", label: "Tickets" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Pageants & Events"
        subtitle="Create the stage. Assign judges. Run the show. Crown the winners."
        variant="events"
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
        <Button>Create event</Button>
      </div>

      {activeTab === "events" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Dates</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Registrations</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsData.map((e) => (
                    <tr key={e.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{e.title}</td>
                      <td className="px-4 py-3 text-slate-400">{e.type}</td>
                      <td className="px-4 py-3">
                        <span className={e.status === "live" ? "text-emerald-400" : "text-slate-400"}>{e.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{e.startDate} – {e.endDate}</td>
                      <td className="px-4 py-3 text-slate-400">{e.registrations}</td>
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

      {activeTab === "judges" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Event</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Assigned</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {judgesData.map((j) => (
                    <tr key={j.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{j.eventId}</td>
                      <td className="px-4 py-3 text-slate-400">{j.name}</td>
                      <td className="px-4 py-3 text-slate-400">{j.role}</td>
                      <td className="px-4 py-3">{j.assigned ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "voting" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Configure voting rules and visibility for applicable events.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Voting config placeholder
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "tickets" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Manage ticket types, pricing, and sales for events.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Tickets config placeholder
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
