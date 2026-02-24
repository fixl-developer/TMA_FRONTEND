"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getQuoteTemplates } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { LayoutTemplate, ArrowLeft, Plus } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminLoading,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

export default function SalesTemplatesPage() {
  const { tenantId } = useTenant()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuoteTemplates(tenantId).then((data) => {
      setTemplates(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Quote Templates"
        subtitle="Pre-built templates for quotes"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/sales">
              <AdminButton variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Sales
              </AdminButton>
            </Link>
            <Link href="/admin/sales/quotes/create">
              <AdminButton>
                <Plus className="h-4 w-4" />
                Create Quote
              </AdminButton>
            </Link>
          </div>
        }
      >
        <AdminCard title="Template Library" subtitle={`${templates.length} available templates`}>
          {loading ? (
            <AdminLoading rows={3} />
          ) : templates.length === 0 ? (
            <AdminEmptyState
              icon={LayoutTemplate}
              title="No templates yet"
              description="Create your first quote template"
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
                      <p className="mt-1 text-xs text-white/40">
                        Category: {t.category} · Valid {t.defaultValidDays ?? 14} days
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/sales/quotes/create?template=${t._id}`}>
                    <AdminButton variant="secondary" size="sm">Use Template</AdminButton>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
