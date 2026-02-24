"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getProjectById,
  getChecklistsByProject,
} from "@/shared/services/projectService"
import { CheckSquare, Check, Circle, ArrowLeft } from "lucide-react"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function ProjectChecklistsPage() {
  const params = useParams()
  const id = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`Checklists: ${project.name}`}
        subtitle="Completion gates and pre-flight checks"
        action={
          <div className="flex gap-2">
            <Link href={`/admin/projects/${id}`}>
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Project
              </AdminButton>
            </Link>
            <Link href="/admin/projects">
              <AdminButton variant="ghost" size="sm">All projects</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <CapabilityGate
          capability="jobs.read"
          fallback={
            <AdminCard>
              <p className="py-8 text-center text-sm text-white/60">
                You do not have permission to view project checklists.
              </p>
            </AdminCard>
          }
        >
          {checklists.length === 0 ? (
            <AdminCard>
              <p className="py-12 text-center text-white/60">
                No checklists for this project.
              </p>
            </AdminCard>
          ) : (
            checklists.map((chk) => {
              const items = chk.items ?? []
              const done = items.filter((i: any) => i.done).length
              const total = items.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <AdminCard key={chk._id}>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckSquare className="h-5 w-5 text-white/60" />
                      <h2 className="text-lg font-semibold text-white">{chk.name}</h2>
                    </div>
                    {chk.description && (
                      <p className="text-sm text-white/60">{chk.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/60">
                        {done}/{total} ({pct}%)
                      </span>
                    </div>
                    {chk.completionGate && (
                      <AdminBadge variant="warning" className="mt-2">
                        Gate: {chk.completionGate.replace(/_/g, " ")}
                      </AdminBadge>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {items.map((item: any) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {item.done ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-white/30" />
                        )}
                        <span
                          className={
                            item.done ? "text-white/50 line-through" : "text-white"
                          }
                        >
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AdminCard>
              )
            })
          )}
        </CapabilityGate>
      </div>
    </AdminPageWrapper>
  )
}
