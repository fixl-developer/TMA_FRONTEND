"use client"

import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function TalentMgmtCalendarPage() {
  return (
    <AgenciesPage>
      <PageBanner title="Availability calendar" subtitle="Talent availability, bookings, conflicts." variant="talent-mgmt" backgroundImage="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <Button className="bg-teal-500 text-slate-900 hover:bg-teal-400">Add availability</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-teal-500/20">
                  <Calendar className="h-8 w-8 text-teal-600" />
                </div>
                <p className="mt-4 font-medium text-slate-800">Availability calendar</p>
                <p className="mt-1 max-w-md text-sm text-slate-500">View and manage talent availability. Seed data: no events yet.</p>
              </div>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
