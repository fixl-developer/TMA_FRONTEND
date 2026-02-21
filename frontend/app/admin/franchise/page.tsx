"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getBranches, getFranchiseTemplates } from "@/shared/services/franchiseService"
import type { Branch, FranchiseTemplate } from "@/shared/services/franchiseService"
import { Building2, Plus, ChevronRight, Copy } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageLoading } from "@/shared/components/ui/page-loading"
import { EmptyState } from "@/shared/components/ui/empty-state"

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

  if (loading) {
    return (
      <AgenciesPage>
        <PageBanner title="Franchise & Branches" subtitle="Branch list, clone from template." variant="admin" backgroundImage="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80" />
        <PageLoading message="Loading branches…" />
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageBanner
          title="Franchise & Branches"
          subtitle="Branch list, clone from template, local customization limits."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80"
          className="flex-1 min-w-0"
        />
        <Button className="shrink-0 bg-amber-500 text-slate-900 hover:bg-amber-400" disabled>
          <Plus className="mr-1.5 h-4 w-4" /> Clone branch (UI only)
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Branches</CardTitle>
            <Building2 className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">{branches.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Templates</CardTitle>
            <Copy className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-800">{templates.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Branches</CardTitle></CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-6 w-6" />}
                title="No branches yet"
                description="Clone a branch from a template to get started."
              />
            ) : (
              <div className="space-y-4">
                {branches.map((b) => (
                  <Link key={b._id} href={`/admin/franchise/${b._id}`}>
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:border-amber-300 hover:bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">{b.name}</p>
                        <p className="text-xs text-slate-500">
                          {b.code} · {b.city}, {b.region} · {b.eventsCount ?? 0} events
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            b.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                            b.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {b.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Franchise templates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((t) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-medium text-slate-800">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.description}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {t.includes.join(", ")} · {t.branchesCount ?? 0} branches
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgenciesPage>
  )
}
