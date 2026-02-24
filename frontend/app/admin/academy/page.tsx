"use client"

import { useEffect, useState } from "react"
import { getTenantCourses } from "@/shared/services/adminService"
import { GraduationCap, BookOpen, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
      <AdminPageLayout
        title="Academy"
        subtitle="Courses, mentors, and certifications"
        actions={
        <AdminButton>
          <Plus className="h-4 w-4" />
          New Course
        </AdminButton>
      }
    >
      <AdminStatsGrid columns={4}>
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded bg-[#f3f2f1]" />
            ))}
          </>
        ) : (
          <>
            <AdminStatCard
              label="Total Courses"
              value={courses.length}
              subtitle="All courses"
              icon={GraduationCap}
              color="purple"
            />
            <AdminStatCard
              label="Active"
              value={activeCount}
              subtitle="Available now"
              icon={BookOpen}
              color="green"
            />
            <AdminStatCard
              label="Total Enrolled"
              value={totalEnrolled}
              subtitle="Across all courses"
              icon={GraduationCap}
              color="blue"
            />
            <AdminStatCard
              label="Draft"
              value={courses.filter((c) => c.status === "DRAFT").length}
              subtitle="In preparation"
              icon={GraduationCap}
              color="yellow"
            />
          </>
        )}
      </AdminStatsGrid>

      <AdminCard title="Courses" subtitle={`${courses.length} total courses`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : courses.length === 0 ? (
          <AdminEmptyState
            icon={GraduationCap}
            title="No courses yet"
            description="Create courses to train and certify your talent"
            action={
              <AdminButton>
                <Plus className="h-4 w-4" />
                New Course
              </AdminButton>
            }
          />
        ) : (
          <div className="space-y-2">
            {courses.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between rounded border border-[#edebe9] bg-white p-4 transition-all hover:bg-[#f3f2f1] hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#107c10] text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#323130]">{c.title}</p>
                    <p className="text-xs text-[#605e5c]">
                      {c.category} · {c.duration}
                    </p>
                  </div>
                  <AdminBadge variant={getStatusVariant(c.status)}>
                    {c.status}
                  </AdminBadge>
                </div>
                <p className="text-xs font-semibold text-[#107c10]">{c.enrolledCount} enrolled</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
