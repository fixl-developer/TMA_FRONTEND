"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getProjectById,
  getChecklistsByProject,
} from "@/shared/services/projectService"
import { CheckSquare, Check, Circle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

export default function ProjectChecklistsPage() {
  const params = useParams()
  const id = params?.id as string
  const { page } = useDashboardTheme()
  const [project, setProject] = useState<any>(null)
  const [checklists, setChecklists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getProjectById(id), getChecklistsByProject(id)]).then(
      ([p, c]) => {
        setProject(p)
        setChecklists(c)
        setLoading(false)
      }
    )
  }, [id])

  if (loading || !project) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={`Checklists: ${project.name}`}
        subtitle="Completion gates and pre-flight checks"
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/admin/projects/${id}`}>
          <Button variant="ghost" size="sm">
            ← Project
          </Button>
        </Link>
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            All projects
          </Button>
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        <CapabilityGate
          capability="jobs.read"
          fallback={
            <Card style={{ borderColor: page.border }}>
              <CardContent className="py-8 text-center text-sm text-slate-500">
                You do not have permission to view project checklists.
              </CardContent>
            </Card>
          }
        >
          {checklists.length === 0 ? (
            <Card style={{ borderColor: page.border }}>
              <CardContent className="py-12 text-center text-slate-500">
                No checklists for this project.
              </CardContent>
            </Card>
          ) : (
            checklists.map((chk) => {
              const items = chk.items ?? []
              const done = items.filter((i: any) => i.done).length
              const total = items.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <Card key={chk._id} style={{ borderColor: page.border }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      {chk.name}
                    </CardTitle>
                    {chk.description && (
                      <p className="text-sm text-slate-500">{chk.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500">
                        {done}/{total} ({pct}%)
                      </span>
                    </div>
                    {chk.completionGate && (
                      <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        Gate: {chk.completionGate.replace(/_/g, " ")}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {items.map((item: any) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          {item.done ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300" />
                          )}
                          <span
                            className={
                              item.done ? "text-slate-500 line-through" : ""
                            }
                            style={{ color: item.done ? undefined : page.text }}
                          >
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })
          )}
        </CapabilityGate>
      </div>
    </AgenciesPage>
  )
}
