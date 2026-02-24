"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getContractTemplates, getClauses } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { LayoutTemplate, FileText, ArrowLeft, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

export default function ContractTemplatesPage() {
  const { tenantId } = useTenant()
  const [templates, setTemplates] = useState<any[]>([])
  const [clauses, setClauses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getContractTemplates(tenantId),
      getClauses(tenantId),
    ]).then(([t, c]) => {
      setTemplates(t)
      setClauses(c)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Contract Templates"
        subtitle="Templates and clause library"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/contracts">
              <AdminButton variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Contracts
              </AdminButton>
            </Link>
            <Link href="/admin/contracts/create">
              <AdminButton>
                <Plus className="h-4 w-4" />
                Create Contract
              </AdminButton>
            </Link>
          </div>
        }
      >
        <AdminCard title="Templates" subtitle={`${templates.length} available templates`}>
          {loading ? (
            <AdminLoading rows={3} />
          ) : templates.length === 0 ? (
            <AdminEmptyState
              icon={LayoutTemplate}
              title="No templates yet"
              description="Create your first contract template"
            />
          ) : (
            <div className="space-y-4">
              {templates.map((t) => (
                <div
                  key={t._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                      <LayoutTemplate className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-white/60">{t.description}</p>
                      <p className="mt-1 text-xs text-white/40">{(t.clauseIds ?? []).length} clauses</p>
                    </div>
                  </div>
                  <Link href={`/admin/contracts/create?template=${t._id}`}>
                    <AdminButton variant="secondary" size="sm">Use Template</AdminButton>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard title="Clause Library" subtitle={`${clauses.length} reusable clauses`} className="mt-6">
          {loading ? (
            <AdminLoading rows={3} />
          ) : clauses.length === 0 ? (
            <AdminEmptyState
              icon={FileText}
              title="No clauses yet"
              description="Add reusable contract clauses to your library"
            />
          ) : (
            <div className="space-y-4">
              {clauses.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="mt-1 text-sm text-white/70 line-clamp-2">{c.content}</p>
                  <span className="mt-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">{c.category}</span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
