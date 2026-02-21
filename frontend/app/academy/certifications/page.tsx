"use client"

import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Award } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const CERTS = [
  { _id: "c1", name: "Ramp Walk Certified", issued: 12 },
  { _id: "c2", name: "Portfolio Ready", issued: 8 },
]

export default function AcademyCertificationsPage() {
  return (
    <AgenciesPage>
      <PageBanner title="Certifications" subtitle="Course completion certificates." variant="academy" backgroundImage="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Certifications</CardTitle>
              <Button className="bg-indigo-500 text-slate-800 hover:bg-indigo-400">Create certification</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {CERTS.map((c) => (
                  <div key={c._id} className="flex items-center gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20"><Award className="h-6 w-6 text-indigo-600" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{c.name}</p>
                      <p className="text-sm text-slate-500">{c.issued} issued</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
