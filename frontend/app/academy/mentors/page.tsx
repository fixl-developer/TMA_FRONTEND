"use client"

import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Users } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const MENTORS = [
  { _id: "m1", name: "Riya Mehta", expertise: "Ramp walk, posing", courses: 2 },
  { _id: "m2", name: "Arjun Nair", expertise: "Portfolio photography", courses: 1 },
  { _id: "m3", name: "Priya Sharma", expertise: "Pageant Q&A", courses: 1 },
]

export default function AcademyMentorsPage() {
  return (
    <AgenciesPage>
      <PageBanner title="Mentors" subtitle="Course instructors and trainers." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mentors</CardTitle>
              <Button className="bg-indigo-500 text-slate-800 hover:bg-indigo-400">Add mentor</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MENTORS.map((m) => (
                  <div key={m._id} className="flex items-center gap-4 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20"><Users className="h-6 w-6 text-indigo-600" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">{m.name}</p>
                      <p className="text-sm text-slate-500">{m.expertise}</p>
                      <p className="text-xs text-slate-500">{m.courses} course(s)</p>
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
