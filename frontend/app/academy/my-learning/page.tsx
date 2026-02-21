"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getMyLearning } from "@/shared/services/academyService"
import { BookOpen, Play, GraduationCap } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function MyLearningPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyLearning().then(setItems).finally(() => setLoading(false))
  }, [])

  return (
    <AgenciesPage>
      <PageBanner title="My learning" subtitle="Your enrolled courses, progress, and certificates." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Enrolled courses</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading…</p>
              ) : items.length === 0 ? (
                <div className="py-12 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-slate-500">No enrolled courses yet.</p>
                  <Button asChild className="mt-4 bg-indigo-500 text-slate-800 hover:bg-indigo-400">
                  <Link href="/academy/courses">Browse courses</Link>
                </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <div key={item._id} className="flex flex-col overflow-hidden rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md">
                      <div className="aspect-video bg-slate-200">
                        {item.course?.thumbnailUrl ? (
                          <img src={item.course.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center"><GraduationCap className="h-12 w-12 text-slate-400" /></div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="font-semibold text-slate-800">{item.course?.title}</p>
                        <div className="mt-2 h-2 rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${item.progressPercent}%` }} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{item.progressPercent}% complete</p>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/academy/courses/${item.courseId}/learn`}>
                            <Button size="sm" className="bg-indigo-500 text-slate-800 hover:bg-indigo-400">
                              <Play className="mr-1 h-4 w-4" /> Continue
                            </Button>
                          </Link>
                          <Link href={`/academy/courses/${item.courseId}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </div>
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
