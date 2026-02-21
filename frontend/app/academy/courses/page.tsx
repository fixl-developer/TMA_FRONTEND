"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { getCourses } from "@/shared/services/academyService"
import { useTenant } from "@/shared/context/TenantContext"
import { GraduationCap, Search } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-600 border-emerald-500/40",
  DRAFT: "bg-slate-500/20 text-slate-500 border-slate-500/40",
}

export default function AcademyCoursesPage() {
  const { tenantId } = useTenant()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  useEffect(() => {
    getCourses(tenantId ?? "tenant_001").then((data) => {
      setCourses(data)
      setLoading(false)
    })
  }, [tenantId])

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "all" || c.category === category
    return matchSearch && matchCat
  })
  const categories = ["all", ...new Set(courses.map((c) => c.category).filter(Boolean))]

  return (
    <AgenciesPage>
      <PageBanner title="Courses" subtitle="Video courses, live workshops. Filter and enroll." variant="academy" backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80" />
        <section className="mt-8">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-48 sm:w-56" />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat === "all" ? "All categories" : cat}</option>
                  ))}
                </select>
              </div>
              <CardTitle className="text-base">Course catalog</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-slate-500">Loading courses…</p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-slate-500">No courses match your filters.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((c) => (
                    <Link key={c._id} href={`/academy/courses/${c._id}`}>
                      <div className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
                        <div className="aspect-video bg-slate-200">
                          {c.thumbnailUrl ? (
                            <img src={c.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center"><GraduationCap className="h-12 w-12 text-slate-400" /></div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <span className={`mb-2 inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[c.status] ?? "bg-slate-100"}`}>{c.category}</span>
                          <p className="font-semibold text-slate-800 group-hover:text-indigo-600">{c.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.description}</p>
                          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                            <span>{c.duration}</span>
                            <span className="text-indigo-600">{c.enrolledCount} enrolled</span>
                          </div>
                          <Button className="mt-4 w-full bg-indigo-500 text-slate-800 hover:bg-indigo-400">View course</Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
    </AgenciesPage>
  )
}
