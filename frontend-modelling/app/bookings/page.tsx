"use client"

import { PageLayout, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { bookings } from "@/data/seed"

export default function BookingsPage() {
  const bookingsData = bookings as Array<{
    id: string
    talentId: string
    title: string
    date: string
    time: string
    location: string
    status: string
    callSheet: boolean
  }>

  return (
    <PageLayout>
      <PageBanner
        title="Bookings"
        subtitle="Calendar, call sheets, and confirmed bookings."
        variant="bookings"
      />
      <div className="mb-6 mt-6 flex justify-end">
        <Button>Add booking</Button>
      </div>
      <PageSection>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Talent</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Date & Time</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Location</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300">Call sheet</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsData.map((b) => (
                  <tr key={b.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-200">{b.talentId}</td>
                    <td className="px-4 py-3 text-slate-400">{b.title}</td>
                    <td className="px-4 py-3 text-slate-400">{b.date} {b.time}</td>
                    <td className="px-4 py-3 text-slate-400">{b.location}</td>
                    <td className="px-4 py-3">
                      <span className={b.status === "confirmed" ? "text-emerald-400" : "text-amber-400"}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{b.callSheet ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Call sheet</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageSection>
      <PageSection title="Calendar view">
        <Card>
          <CardContent>
            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Calendar placeholder – integrate with bookings API
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
