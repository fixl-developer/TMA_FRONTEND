"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getCourseById, getAssessmentsByCourse } from "@/shared/services/academyService"
import { FileQuestion, Video } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function CourseAssessmentPage() {
  const params = useParams()
  const id = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!id) return
    Promise.all([getCourseById(id), getAssessmentsByCourse(id)]).then(([c, a]) => {
      setCourse(c)
      setAssessments(a)
      setLoading(false)
      if (a.length > 0) setSelected(a[0]._id)
    })
  }, [id])

  const assessment = assessments.find((a) => a._id === selected)
  const isQuiz = assessment?.type === "QUIZ"
  const questions = assessment?.questions ?? []

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
          <PageBanner title={`${course.title} — Assessment`} subtitle="Quiz and video submissions" variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assessments</CardTitle>
                {assessment?.timeLimitMinutes && (
                  <span className="text-sm text-slate-500">Time limit: {assessment.timeLimitMinutes} min</span>
                )}
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <p className="text-slate-500">No assessments for this course.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-2">
                      {assessments.map((a) => (
                        <Button key={a._id} variant={selected === a._id ? "default" : "outline"} size="sm" onClick={() => setSelected(a._id)} className={selected === a._id ? "bg-indigo-500" : ""}>
                          {a.type === "QUIZ" ? <FileQuestion className="mr-1 h-4 w-4" /> : <Video className="mr-1 h-4 w-4" />}
                          {a.title}
                        </Button>
                      ))}
                    </div>
                    {assessment && (
                      <div className="rounded-xl border border-[#E7E5E4] bg-white transition-all hover:border-[#B8860B]/40 hover:shadow-md p-6">
                        <h3 className="font-semibold text-slate-800">{assessment.title}</h3>
                        {isQuiz ? (
                          <div className="mt-4 space-y-4">
                            {questions.map((q: any, qi: number) => (
                              <div key={q.id} className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="font-medium text-slate-800">{qi + 1}. {q.text}</p>
                                <div className="mt-3 space-y-2">
                                  {q.options?.map((opt: string, oi: number) => (
                                    <label key={oi} className="flex cursor-pointer items-center gap-2">
                                      <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))} className="rounded-full border-slate-300 text-indigo-500" />
                                      <span className="text-slate-700">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <Button className="mt-4 bg-indigo-500 text-slate-800 hover:bg-indigo-400">Submit quiz</Button>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <p className="text-slate-600">{assessment.instructions}</p>
                            {assessment.maxDurationSeconds && <p className="mt-2 text-sm text-slate-500">Max duration: {assessment.maxDurationSeconds}s</p>}
                            <div className="mt-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                              <Video className="mx-auto h-12 w-12 text-slate-400" />
                              <p className="mt-2 text-slate-600">Video submission placeholder</p>
                              <Button variant="outline" className="mt-4">Upload video</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Complete assessments to earn your certificate.</p>
                <div className="mt-4 space-y-2">
                  {assessments.map((a) => (
                    <div key={a._id} className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">○</span>
                      <span className="text-slate-700">{a.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AgenciesPage>
  )
}
