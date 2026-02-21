"use client"

import { useEffect, useState } from "react"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { getTenantCourses } from "@/shared/services/adminService"
import { TrendingUp } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function AcademyProgressPage() {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    getTenantCourses().then(setCourses)
  }, [])

  const activeCourses = courses.filter((c) => c.status === "ACTIVE")
  const totalEnrolled = courses.reduce((s, c) => s + (c.enrolledCount ?? 0), 0)

  return (
    <AgenciesPage>
      <PageBanner title="Progress" subtitle="Student progress, completion rates." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Progress overview</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20"><TrendingUp className="h-5 w-5 text-indigo-600" /></div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Total enrolled</p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600">{totalEnrolled}</p>
                </div>
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Active courses</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">{activeCourses.length}</p>
                </div>
                <div className="rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                  <p className="text-sm text-slate-500">Avg completion</p>
                  <p className="mt-1 text-2xl font-bold text-slate-800">~72%</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Seed data. In production, this would show per-student progress and completion rates.</p>
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
