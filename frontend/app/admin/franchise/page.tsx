"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBranches, getFranchiseTemplates } from "@/shared/services/franchiseService"
import type { Branch, FranchiseTemplate } from "@/shared/services/franchiseService"
import { Building2, Plus, ChevronRight, Copy } from "lucide-react"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

const DEMO_TENANT = "tenant_001"

export default function FranchisePage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [templates, setTemplates] = useState<FranchiseTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBranches(DEMO_TENANT),
      getFranchiseTemplates(DEMO_TENANT),
    ]).then(([b, t]) => {
      setBranches(b)
      setTemplates(t)
    }).finally(() => setLoading(false))
  }, [])

  const active = branches.filter((b) => b.status === "ACTIVE").length

  return (
    <AdminPageLayout
      title="Franchise & Branches"
      subtitle="Branch list, clone from template, local customization limits"
      actions={
        <AdminButton disabled>
          <Plus className="h-4 w-4" />
          Clone branch (UI only)
        </AdminButton>
      }
    >
      <AdminStatsGrid columns={3}>
        <AdminStatCard label="Branches" value={branches.length} icon={Building2} color="purple" />
        <AdminStatCard label="Active" value={active} icon={Building2} color="green" />
        <AdminStatCard label="Templates" value={templates.length} icon={Copy} color="blue" />
      </AdminStatsGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Branches">
          {loading ? (
            <AdminLoading rows={5} />
          ) : branches.length === 0 ? (
            <AdminEmptyState
              icon={Building2}
              title="No branches yet"
              description="Clone a branch from a template to get started"
            />
          ) : (
            <div className="space-y-3">
              {branches.map((b) => (
                <Link key={b._id} href={`/admin/franchise/${b._id}`}>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div>
                      <p className="font-medium text-white">{b.name}</p>
                      <p className="text-xs text-white/60">
                        {b.code} · {b.city}, {b.region} · {b.eventsCount ?? 0} events
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          b.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300" :
                          b.status === "PENDING" ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/60"
                        }`}
                      >
                        {b.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard title="Franchise templates">
          {loading ? (
            <AdminLoading rows={3} />
          ) : (
            <div className="space-y-3">
              {templates.map((t) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="font-medium text-white">{t.name}</p>
                  <p className="text-sm text-white/60">{t.description}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {t.includes.join(", ")} · {t.branchesCount ?? 0} branches
                  </p>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}
