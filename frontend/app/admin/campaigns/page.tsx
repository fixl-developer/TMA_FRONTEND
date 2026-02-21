"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Megaphone, Plus, Play, Pause, BarChart3 } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import seedCampaigns from "@/data/seed/campaigns.json"

const STORAGE_KEY = "talentos_campaign_builders"

function getBuiltCampaigns(): any[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    const built = getBuiltCampaigns()
    setCampaigns([...built, ...(seedCampaigns as any[])])
  }, [])

  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "ACTIVE" || c.status === "active").length,
    draft: campaigns.filter((c) => c.status === "DRAFT" || c.status === "draft").length,
  }), [campaigns])

  const getVariant = (status: string) => {
    const s = status?.toUpperCase()
    if (s === "ACTIVE") return "success"
    if (s === "DRAFT") return "warning"
    if (s === "PAUSED") return "default"
    if (s === "COMPLETED") return "success"
    return "default"
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Campaigns"
        subtitle="Manage and build marketing campaign pipelines"
        action={
          <Link href="/admin/campaigns/builder">
            <AdminButton>
              <Plus className="mr-2 h-4 w-4" /> Build Campaign
            </AdminButton>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <AdminStatCard title="Total Campaigns" value={stats.total} icon={Megaphone} />
        <AdminStatCard title="Active" value={stats.active} icon={Play} />
        <AdminStatCard title="Drafts" value={stats.draft} icon={Pause} />
      </div>

      {campaigns.length === 0 ? (
        <AdminEmptyState title="No campaigns" description="Build your first campaign to get started." />
      ) : (
        <AdminCard>
          <AdminTable headers={["Campaign", "Status", "Stages", "Budget", "Created", "Actions"]}>
            {campaigns.map((c) => (
              <AdminTableRow key={c._id || c.id}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-white">{c.name || c.title}</p>
                  {c.stages && <p className="text-xs text-white/40">{c.stages.length} pipeline stages</p>}
                </td>
                <td className="py-3 pr-4">
                  <AdminBadge variant={getVariant(c.status)}>{c.status}</AdminBadge>
                </td>
                <td className="py-3 pr-4 text-sm text-white/60">{c.stages?.length || "—"}</td>
                <td className="py-3 pr-4 text-sm text-white/70">
                  {c.budget ? `${c.budgetCurrency === "USD" ? "$" : "₹"}${c.budget.toLocaleString()}` : "—"}
                </td>
                <td className="py-3 pr-4 text-sm text-white/50">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="py-3 pr-4">
                  <AdminButton variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </AdminButton>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
