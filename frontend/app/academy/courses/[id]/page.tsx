"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCourseById, getLessonsByCourse, getAssessmentsByCourse, getSessionsByCourse, getEnrollment, enrollCourse } from "@/shared/services/academyService"
import { GraduationCap, Play, FileQuestion, Video, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  const load = () => {
    if (!id) return
    Promise.all([
      getCourseById(id),
      getLessonsByCourse(id),
      getAssessmentsByCourse(id),
      getSessionsByCourse(id),
      getEnrollment("user_001", id),
    ]).then(([c, l, a, s, e]) => {
      setCourse(c)
      setLessons(l)
      setAssessments(a)
      setSessions(s)
      setEnrollment(e)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    await enrollCourse("user_001", id)
    load()
    setEnrolling(false)
  }

  if (loading || !course) {
    return (
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  const isEnrolled = !!enrollment

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-500">
          <Link href="/academy/courses">← Courses</Link>
        </Button>
          <PageBanner title={course.title} subtitle={course.description} variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video bg-slate-200">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><GraduationCap className="h-16 w-16 text-slate-400" /></div>
                )}
              </div>
              <CardContent className="pt-4">
                <p className="text-slate-600">{course.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>{course.duration}</span>
                  <span>{course.category}</span>
                  <span>{course.enrolledCount} enrolled</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" /> Curriculum</CardTitle></CardHeader>
              <CardContent>
                {lessons.length === 0 ? (
                  <p className="text-slate-500">No lessons yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {lessons.map((l, i) => (
                      <li key={l._id}>
                        {isEnrolled ? (
                          <Link
                            href={`/academy/courses/${id}/learn?lesson=${i}`}
                            className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md px-4 py-3 block"
                          >
                            <span className="font-medium text-slate-800">{i + 1}. {l.title}</span>
                            <span className="text-sm text-slate-500">{l.durationMinutes} min</span>
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white px-4 py-3">
                            <span className="font-medium text-slate-800">{i + 1}. {l.title}</span>
                            <span className="text-sm text-slate-500">{l.durationMinutes} min</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            {assessments.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileQuestion className="h-5 w-5" /> Assessments</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessments.map((a) => (
                      <li key={a._id} className="flex items-center justify-between rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md px-4 py-3">
                        <span className="font-medium text-slate-800">{a.title}</span>
                        <span className="text-sm text-slate-500">{a.type === "QUIZ" ? "Quiz" : "Video submission"}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Trainer</CardTitle></CardHeader>
              <CardContent>
                <p className="font-medium text-slate-800">{course.trainerName ?? "TBA"}</p>
              </CardContent>
            </Card>
            {sessions.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Live sessions</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sessions.slice(0, 3).map((s) => (
                      <li key={s._id} className="text-sm text-slate-600">{s.title} — {new Date(s.scheduledAt).toLocaleDateString()}</li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href="/academy/sessions">View all</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-6">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Progress: {enrollment.progressPercent}%</p>
                    <Button className="w-full bg-indigo-500 text-slate-800 hover:bg-indigo-400" onClick={() => router.push(`/academy/courses/${id}/learn`)}>
                      <Play className="mr-2 h-4 w-4" /> Continue learning
                    </Button>
                    {assessments.length > 0 && (
                      <Button variant="outline" className="w-full" onClick={() => router.push(`/academy/courses/${id}/assessment`)}>
                        Take assessment
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    className="w-full bg-indigo-500 text-slate-800 hover:bg-indigo-400"
                    onClick={handleEnroll}
                    disabled={enrolling || course.status !== "ACTIVE"}
                  >
                    {enrolling ? "Enrolling…" : "Enroll now"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AgenciesPage>
  )
}
