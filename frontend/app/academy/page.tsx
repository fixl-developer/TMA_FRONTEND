"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HeroCarousel } from "@/shared/components/ui/HeroCarousel"
import { InteractiveMetricCard, InteractiveFeaturedCard } from "@/shared/components/ui/InteractiveCard"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { ROLE_DASHBOARD_CONFIG } from "@/shared/config/roleDashboardConfig"
import { GraduationCap, Users, Award, BookOpen, Video, ChevronRight, Play } from "lucide-react"
import { getTenantCourses } from "@/shared/services/adminService"
import { getMyLearning, getCourses } from "@/shared/services/academyService"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const ROLE = "academy"
const config = ROLE_DASHBOARD_CONFIG[ROLE]

export default function AcademyDashboard() {
  const [courses, setCourses] = useState<any[]>([])
  const [myLearning, setMyLearning] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any[]>([])

  useEffect(() => {
    getTenantCourses().then(setCourses)
  }, [])

  useEffect(() => {
    getMyLearning().then((list) => {
      setMyLearning(list)
      const enrolledIds = new Set(list.map((e) => e.courseId))
      getCourses().then((all) => {
        setRecommended(all.filter((c) => !enrolledIds.has(c._id)).slice(0, 3))
      })
    })
  }, [])

  const activeCourses = courses.filter((c) => c.status === "ACTIVE").length
  const totalEnrolled = courses.reduce((s, c) => s + (c.enrolledCount ?? 0), 0)
  const continueLearning = myLearning
    .filter((e) => e.status === "IN_PROGRESS")
    .sort((a, b) => (b.lastAccessedAt ?? "").localeCompare(a.lastAccessedAt ?? ""))[0]

  const heroSlides = config.heroSlides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref,
    gradient: s.gradient,
    videoUrl: s.videoUrl,
    imageUrl: s.imageUrl,
  }))

  return (
    <AgenciesPage>
      <HeroCarousel slides={heroSlides} gradients={config.heroGradients} className="mb-8" />
      {(continueLearning || recommended.length > 0) && (
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        {continueLearning && (
          <Card className="relative h-full border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-white transition-colors hover:border-amber-300 lg:col-span-2">
            <Link href={`/academy/courses/${continueLearning.courseId}/learn`} className="absolute inset-0 z-10" aria-label={`Continue ${continueLearning.course?.title ?? "course"}`} />
            <CardContent className="relative flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <Play className="h-7 w-7 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-amber-700">Continue learning</p>
                  <p className="font-semibold text-slate-800">{continueLearning.course?.title ?? "Course"}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${continueLearning.progressPercent ?? 0}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{continueLearning.progressPercent ?? 0}% complete</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            </CardContent>
          </Card>
        )}
        {recommended.length > 0 && (
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Recommended courses</h3>
              <ul className="space-y-2">
                {recommended.map((c) => (
                  <li key={c._id}>
                    <Link href={`/academy/courses/${c._id}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-amber-50 hover:text-slate-800">
                      <span className="truncate">{c.title}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>
      )}

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917] sm:text-base">Key metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InteractiveMetricCard title="Active courses" value={activeCourses} subtitle="Live" icon={GraduationCap} variant={config.metricVariants[0] as any} imageUrl={config.metricImages.courses} />
          <InteractiveMetricCard title="Enrolled" value={totalEnrolled} subtitle="Total" icon={BookOpen} variant={config.metricVariants[1] as any} imageUrl={config.metricImages.enrolled} />
          <InteractiveMetricCard title="Mentors" value="3" subtitle="Available" icon={Users} variant={config.metricVariants[2] as any} imageUrl={config.metricImages.mentors} />
          <InteractiveMetricCard title="Certifications" value="2" subtitle="Issued" icon={Award} variant={config.metricVariants[3] as any} imageUrl={config.metricImages.certifications} />
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-[#1C1917] sm:text-base">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InteractiveFeaturedCard
            title="Courses"
            subtitle="Browse and manage courses"
            ctaLabel="View"
            href="/academy/courses"
            icon={GraduationCap}
            variant={config.metricVariants[0] as any}
            imageUrl={config.metricImages.courses}
            videoUrl={config.heroSlides[0].videoUrl}
          />
          <InteractiveFeaturedCard
            title="My Learning"
            subtitle="Your enrolled courses"
            ctaLabel="Continue"
            href="/academy/my-learning"
            icon={BookOpen}
            variant={config.metricVariants[1] as any}
            imageUrl={config.metricImages.enrolled}
            videoUrl={config.heroSlides[1].videoUrl}
          />
          <InteractiveFeaturedCard
            title="Sessions"
            subtitle="Live workshops"
            ctaLabel="Schedule"
            href="/academy/sessions"
            icon={Video}
            variant={config.metricVariants[2] as any}
            imageUrl={config.metricImages.mentors}
            videoUrl={config.heroSlides[2].videoUrl}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/academy/cohorts">Cohorts</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/academy/mentors">Mentors</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/academy/certificates">Certificates</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F0E8] hover:text-[#1C1917]">
            <Link href="/academy/progress">Progress</Link>
          </Button>
        </div>
      </section>
    </AgenciesPage>
  )
}
