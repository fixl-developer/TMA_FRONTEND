"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAutomationCampaigns } from "@/shared/services/automationService"
import type { AutomationCampaign } from "@/shared/services/automationService"
import { Workflow, Plus, Zap, Activity, Target } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const DEMO_TENANT = "tenant_001"

export default function AutomationCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AutomationCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAutomationCampaigns(DEMO_TENANT).then(setCampaigns).finally(() => setLoading(false))
  }, [])

  const active = campaigns.filter((c) => c.status === "ACTIVE").length
  const paused = campaigns.filter((c) => c.status === "PAUSED").length
  const totalRuns = campaigns.reduce((sum, c) => sum + (c.runsCount ?? 0), 0)
  const totalStages = campaigns.reduce((sum, c) => sum + c.stages.length, 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "PAUSED":
        return "warning"
      case "DRAFT":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Automation Campaigns"
        subtitle="No-code campaign engine: stages, actions, targeting"
        action={
          <div className="flex gap-2">
            <Link href="/admin/automation/rules">
              <AdminButton variant="secondary" size="sm">
                Rules
              </AdminButton>
            </Link>
            <Link href="/admin/automation/campaigns/create">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Campaigns"
          value={campaigns.length}
          subtitle="All campaigns"
          icon={Workflow}
          color="purple"
        />
        <AdminStatCard
          title="Active"
          value={active}
          subtitle="Running now"
          icon={Zap}
          color="green"
        />
        <AdminStatCard
          title="Total Runs"
          value={totalRuns}
          subtitle="Executions"
          icon={Activity}
          color="blue"
        />
        <AdminStatCard
          title="Total Stages"
          value={totalStages}
          subtitle="Workflow steps"
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Campaigns List */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">All Campaigns</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <AdminEmptyState
            icon={Workflow}
            title="No campaigns yet"
            description="Create your first automation campaign with stages and actions"
            action={
              <Link href="/admin/automation/campaigns/create">
                <AdminButton>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <Workflow className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white">{c.name}</p>
                        <AdminBadge variant={getStatusBadgeVariant(c.status) as any}>
                          {c.status}
                        </AdminBadge>
                      </div>
                      <p className="text-xs text-white/50">
                        {c.stages.length} stages · {c.runsCount ?? 0} runs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
