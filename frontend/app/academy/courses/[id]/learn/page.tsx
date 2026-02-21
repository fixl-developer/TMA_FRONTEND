"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCourseById, getLessonsByCourse, getEnrollment } from "@/shared/services/academyService"
import { Play, CheckCircle, Circle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function CourseLearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const lessonIndex = parseInt(searchParams.get("lesson") ?? "0", 10)
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getCourseById(id), getLessonsByCourse(id), getEnrollment("user_001", id)]).then(([c, l, e]) => {
      setCourse(c)
      setLessons(l)
      setEnrollment(e)
      setLoading(false)
      const idx = Math.min(Math.max(0, lessonIndex), l.length - 1)
      if (l.length > 0) setCurrentLesson(l[idx])
    })
  }, [id, lessonIndex])

  const progress = enrollment?.progressPercent ?? 0
  const completedCount = Math.floor((progress / 100) * lessons.length)

  if (loading || !course) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-500">
          <Link href={`/academy/courses/${id}`}>← Course</Link>
        </Button>
          <PageBanner title={`${course.title} — Learn`} subtitle={`${completedCount}/${lessons.length} lessons completed`} variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-video bg-slate-900">
                {currentLesson?.videoUrl ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-lg bg-slate-800 p-8 text-center">
                      <Play className="mx-auto h-16 w-16 text-indigo-400" />
                      <p className="mt-2 text-slate-300">{currentLesson.title}</p>
                      <p className="text-sm text-slate-500">Video player placeholder — {currentLesson.durationMinutes} min</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">Select a lesson</div>
                )}
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-slate-800">{currentLesson?.title ?? "Select a lesson"}</h3>
                <p className="mt-1 text-sm text-slate-500">{currentLesson ? `${currentLesson.durationMinutes} min · ${currentLesson.type}` : ""}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {lessons.map((l, i) => {
                    const done = i < completedCount
                    const active = currentLesson?._id === l._id
                    return (
                      <li key={l._id}>
                        <button
                          type="button"
                          onClick={() => setCurrentLesson(l)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"} ${done ? "text-slate-700" : "text-slate-600"}`}
                        >
                          {done ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" /> : <Circle className="h-5 w-5 shrink-0 text-slate-300" />}
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="text-slate-400">{l.durationMinutes}m</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </AgenciesPage>
  )
}
