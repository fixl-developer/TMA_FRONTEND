"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCoursesForTrainer } from "@/shared/services/academyService"
import { UserCog, GraduationCap, Users, TrendingUp } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function TrainerPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCoursesForTrainer().then(setCourses).finally(() => setLoading(false))
  }, [])

  const totalEnrolled = courses.reduce((s, c) => s + (c.enrolledCount ?? 0), 0)

  return (
    <AgenciesPage>
      <PageBanner title="Trainer dashboard" subtitle="Courses, students, grading." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">My courses</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-indigo-600">{courses.length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Total students</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-slate-800">{totalEnrolled}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Pending grading</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-amber-600">3</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Avg completion</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-slate-800">~72%</p></CardContent>
            </Card>
          </div>
        </section>
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><UserCog className="h-5 w-5" /> My courses</CardTitle>
              <Button className="bg-indigo-500 text-slate-800 hover:bg-indigo-400">Create course</Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading…</p>
              ) : courses.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No courses assigned.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((c) => (
                    <div key={c._id} className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white p-4 transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                          <GraduationCap className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{c.title}</p>
                          <p className="text-sm text-slate-500">{c.enrolledCount} students · {c.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Students</Button>
                        <Button variant="outline" size="sm">Grading</Button>
                        <Button asChild size="sm" className="bg-indigo-500 text-slate-800 hover:bg-indigo-400">
                        <Link href={`/academy/courses/${c._id}`}>View</Link>
                      </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
