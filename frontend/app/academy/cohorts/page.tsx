"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { getCohorts } from "@/shared/services/academyService"
import { getCourses } from "@/shared/services/academyService"
import { Users2, Calendar, GraduationCap } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useTenant } from "@/shared/context/TenantContext"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-500/40",
  UPCOMING: "bg-amber-100 text-amber-600 border-amber-500/40",
}

export default function AcademyCohortsPage() {
  const { tenantId } = useTenant()
  const tid = tenantId ?? "tenant_001"
  const [cohorts, setCohorts] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCohorts(tid), getCourses(tid)]).then(([ch, c]) => {
      setCohorts(ch)
      setCourses(c)
      setLoading(false)
    })
  }, [tid])

  const getCourseTitle = (courseId: string) =>
    courses.find((c) => c._id === courseId)?.title ?? "Course"

  return (
    <AgenciesPage>
      <PageBanner
        title="Cohorts"
        subtitle="Course batches, mentors, attendance."
        variant="academy"
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80"
      />
      <section className="mt-8 min-w-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" /> Cohort batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-slate-500">Loading…</p>
            ) : cohorts.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <GraduationCap className="h-12 w-12 text-slate-400" />
                <p className="mt-4 text-slate-500">No cohorts yet.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Cohorts are created when courses are scheduled.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cohorts.map((ch) => (
                  <Link key={ch._id} href={`/academy/courses/${ch.courseId}`}>
                    <div className="flex flex-col gap-4 rounded-xl border border-[#E7E5E4] p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{ch.name}</p>
                        <p className="text-sm text-slate-500">
                          {getCourseTitle(ch.courseId)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(ch.startDate).toLocaleDateString()} –{" "}
                            {new Date(ch.endDate).toLocaleDateString()}
                          </span>
                          <span>{ch.mentorName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-slate-600">
                          <Users2 className="h-4 w-4" />
                          {ch.enrolledCount} enrolled
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                            statusColors[ch.status] ?? "bg-slate-100"
                          }`}
                        >
                          {ch.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
