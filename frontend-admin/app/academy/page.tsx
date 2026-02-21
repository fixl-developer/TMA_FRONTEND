"use client"

import { useState } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { academyCourses, academyMentors } from "@/data/seed"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { cn } from "@/shared/lib/utils"

type Tab = "courses" | "mentors" | "certifications"

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("courses")

  const courses = academyCourses as Array<{
    id: string
    title: string
    status: string
    enrolled: number
    mentorId: string
  }>
  const mentors = academyMentors as Array<{
    id: string
    name: string
    specialty: string
    courses: number
    active: boolean
  }>

  const tabs: { id: Tab; label: string }[] = [
    { id: "courses", label: "Courses" },
    { id: "mentors", label: "Mentors" },
    { id: "certifications", label: "Certifications" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Academy"
        subtitle="Train the next generation. Courses, mentors, certifications."
        variant="academy"
      />
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div className="flex gap-2 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "border-b-2 border-amber-500 text-amber-400"
                : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
        </div>
        <Button>Add course</Button>
      </div>

      {activeTab === "courses" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Enrolled</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Mentor</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{c.title}</td>
                      <td className="px-4 py-3">
                        <span className={c.status === "published" ? "text-emerald-400" : "text-slate-400"}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{c.enrolled}</td>
                      <td className="px-4 py-3 text-slate-400">{c.mentorId}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "mentors" && (
        <PageSection>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Specialty</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Courses</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Active</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((m) => (
                    <tr key={m.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-slate-200">{m.name}</td>
                      <td className="px-4 py-3 text-slate-400">{m.specialty}</td>
                      <td className="px-4 py-3 text-slate-400">{m.courses}</td>
                      <td className="px-4 py-3">{m.active ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </PageSection>
      )}

      {activeTab === "certifications" && (
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Issue and track certifications for completed courses.</p>
              <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
                Certifications placeholder – issue and track API
              </div>
            </CardContent>
          </Card>
        </PageSection>
      )}
    </PageLayout>
  )
}
