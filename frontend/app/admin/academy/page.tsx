"use client"

import { useEffect, useState } from "react"
import { getTenantCourses } from "@/shared/services/adminService"
import { GraduationCap, BookOpen } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminAcademyPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenantCourses().then((data) => {
      setCourses(data)
      setLoading(false)
    })
  }, [])

  const activeCount = courses.filter((c) => c.status === "ACTIVE").length
  const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success"
      case "DRAFT": return "default"
      default: return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Academy"
        subtitle="Courses, mentors, and certifications"
        action={<AdminButton>New Course</AdminButton>}
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              title="Total Courses"
              value={courses.length}
              subtitle="All courses"
              icon={GraduationCap}
              color="purple"
            />
            <AdminStatCard
              title="Active"
              value={activeCount}
              subtitle="Available now"
              icon={BookOpen}
              color="green"
            />
            <AdminStatCard
              title="Total Enrolled"
              value={totalEnrolled}
              subtitle="Across all courses"
              icon={GraduationCap}
              color="blue"
            />
          </>
        )}
      </div>

      {/* Courses */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white admin-light-theme:text-slate-900 transition-colors">
          Courses
        </h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5 admin-light-theme:bg-slate-100 transition-colors" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <AdminEmptyState
            icon={GraduationCap}
            title="No courses yet"
            description="Create courses to train and certify your talent"
            action={<AdminButton>New Course</AdminButton>}
          />
        ) : (
          <div className="space-y-4">
            {courses.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all hover:border-white/20 admin-light-theme:border-slate-200 admin-light-theme:bg-white admin-light-theme:hover:border-slate-300 admin-light-theme:hover:shadow-md border-white/10 bg-white/5 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400 admin-light-theme:bg-green-100 admin-light-theme:text-green-600 transition-colors">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white admin-light-theme:text-slate-900 transition-colors">{c.title}</p>
                    <p className="text-sm text-white/60 admin-light-theme:text-slate-600 transition-colors">
                      {c.category} · {c.duration}
                    </p>
                  </div>
                  <AdminBadge variant={getStatusVariant(c.status)}>
                    {c.status}
                  </AdminBadge>
                </div>
                <p className="text-[#d4ff00]">{c.enrolledCount} enrolled</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
