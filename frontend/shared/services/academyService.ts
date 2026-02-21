/**
 * Academy Service
 *
 * Course catalog, enrollments, lessons, assessments, sessions, certificates, cohorts.
 * Demo user: user_001, tenant: tenant_001
 */

import {
  seedCourses,
  seedLessons,
  seedAssessments,
  seedCertificates,
  seedSessions,
  seedEnrollments,
  seedCohorts,
} from "@/data/seed"

const DEMO_USER = "user_001"
const DEMO_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// In-memory overrides for demo
const enrollmentOverrides: any[] = []

export async function getCourses(tenantId = DEMO_TENANT) {
  await delay(120)
  return (seedCourses as any[]).filter((c) => c.tenantId === tenantId && c.status === "ACTIVE")
}

export async function getCoursesForTrainer(tenantId = DEMO_TENANT) {
  await delay(120)
  return (seedCourses as any[]).filter((c) => c.tenantId === tenantId)
}

export async function getCourseById(courseId: string) {
  await delay(100)
  return (seedCourses as any[]).find((c) => c._id === courseId) ?? null
}

export async function getLessonsByCourse(courseId: string) {
  await delay(80)
  return (seedLessons as any[]).filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order)
}

export async function getAssessmentsByCourse(courseId: string) {
  await delay(80)
  return (seedAssessments as any[]).filter((a) => a.courseId === courseId)
}

export async function getSessionsByCourse(courseId: string) {
  await delay(80)
  return (seedSessions as any[]).filter((s) => s.courseId === courseId)
}

export async function getAllSessions(tenantId = DEMO_TENANT) {
  await delay(120)
  const courses = (seedCourses as any[]).filter((c) => c.tenantId === tenantId).map((c) => c._id)
  return (seedSessions as any[]).filter((s) => courses.includes(s.courseId))
}

export async function getEnrollments(userId = DEMO_USER) {
  await delay(100)
  const seed = (seedEnrollments as any[]).filter((e) => e.userId === userId)
  const overrides = enrollmentOverrides.filter((e) => e.userId === userId)
  return [...seed, ...overrides]
}

export async function getEnrollment(userId: string, courseId: string) {
  await delay(80)
  const override = enrollmentOverrides.find((e) => e.userId === userId && e.courseId === courseId)
  if (override) return override
  return (seedEnrollments as any[]).find((e) => e.userId === userId && e.courseId === courseId) ?? null
}

export async function enrollCourse(
  userId: string,
  courseId: string,
  tenantId = DEMO_TENANT
): Promise<any> {
  await delay(200)
  const course = (seedCourses as any[]).find((c) => c._id === courseId)
  if (!course) throw new Error("Course not found")
  const enrollment = {
    _id: `enroll_${Date.now()}`,
    userId,
    courseId,
    progressPercent: 0,
    status: "IN_PROGRESS",
    enrolledAt: new Date().toISOString().slice(0, 10),
    lastAccessedAt: new Date().toISOString().slice(0, 10),
    course,
  }
  enrollmentOverrides.push(enrollment)
  return enrollment
}

export async function getCohorts(tenantId = DEMO_TENANT) {
  await delay(100)
  const courseIds = (seedCourses as any[]).filter((c) => c.tenantId === tenantId).map((c) => c._id)
  return (seedCohorts as any[]).filter((ch) => courseIds.includes(ch.courseId))
}

export async function getCertificates(userId = DEMO_USER) {
  await delay(100)
  return (seedCertificates as any[]).filter((c) => c.userId === userId)
}

export async function getMyLearning(userId = DEMO_USER) {
  await delay(150)
  const seed = (seedEnrollments as any[]).filter((e) => e.userId === userId)
  const overrides = enrollmentOverrides.filter((e) => e.userId === userId)
  const byCourse = new Map<string, any>()
  seed.forEach((e) => byCourse.set(e.courseId, e))
  overrides.forEach((e) => byCourse.set(e.courseId, e))
  const courses = seedCourses as any[]
  return Array.from(byCourse.values()).map((e) => {
    const course = courses.find((c) => c._id === e.courseId)
    return { ...e, course }
  }).filter((x) => x.course)
}
