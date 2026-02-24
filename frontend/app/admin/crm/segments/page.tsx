"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSegments } from "@/shared/services/crmService"
import { useTenant } from "@/shared/context/TenantContext"
import { Layers } from "lucide-react"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function CrmSegmentsPage() {
  const { tenantId } = useTenant()
  const [segments, setSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSegments(tenantId).then((data) => {
      setSegments(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AdminPageLayout
      title="Segments"
      subtitle="Account segments by criteria"
      actions={
        <Link href="/admin/crm">
          <AdminButton variant="secondary">← Back to CRM</AdminButton>
        </Link>
      }
    >
      <AdminCard title="Segment list" subtitle={`${segments.length} segments`}>
        {loading ? (
          <AdminLoading rows={5} />
        ) : segments.length === 0 ? (
          <AdminEmptyState
            icon={Layers}
            title="No segments defined yet"
            description="Create segments to organize your accounts"
          />
        ) : (
          <div className="space-y-3">
            {segments.map((s) => (
              <div
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Layers className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{s.name}</p>
                    <p className="text-sm text-white/60">{s.description}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {s.count ?? 0} accounts
                    </p>
                  </div>
                </div>
                <AdminButton disabled variant="secondary" size="sm">
                  View accounts (coming soon)
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageLayout>
  )
}
