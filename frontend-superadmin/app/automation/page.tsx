"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Zap, Package, List, FileText, BarChart3, Wrench } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchAutomationPacks, fetchAutomationRules } from "@/shared/state/automationSlice"
import { getAutomationAnalytics } from "@/shared/services/automationService"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import type { AutomationAnalytics } from "@/shared/lib/types/automation"

export default function AutomationOverviewPage() {
  const dispatch = useAppDispatch()
  const { packs, rules, loadingPacks, loadingRules } = useAppSelector((s) => s.automation)
  const [analytics, setAnalytics] = useState<AutomationAnalytics | null>(null)

  useEffect(() => {
    if (!packs.length) dispatch(fetchAutomationPacks())
    if (!rules.length) dispatch(fetchAutomationRules())
    getAutomationAnalytics().then(setAnalytics)
  }, [dispatch, packs.length, rules.length])

  return (
    <PageLayout>
      <PageHeader
        title="Automation engine"
        description="Automation packs, rules (trigger/condition/action), execution logs, and analytics. Seed data only – API integration later."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Zap className="h-3.5 w-3.5 text-[#0078d4]" />
            Automation
          </span>
        }
        actions={
          <Link href="/automation/builder">
            <Button size="sm" className="gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Rule builder
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle>Packs</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loadingPacks ? "—" : packs.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Automation packs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Rules</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{loadingRules ? "—" : rules.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Total rules</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Executions (period)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">{analytics?.totalExecutions ?? "—"}</p>
              <p className="mt-1 text-xs text-[#605e5c]">{analytics?.period ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Success rate</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {analytics?.successRatePercent != null ? `${analytics.successRatePercent}%` : "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Platform-wide</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Quick links">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/automation/packs">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Packs</p>
                  <p className="text-xs text-[#605e5c]">Pack status & tenant adoption</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/automation/rules">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <List className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Rules</p>
                  <p className="text-xs text-[#605e5c]">All rules by pack</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/automation/logs">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Logs</p>
                  <p className="text-xs text-[#605e5c]">Execution logs</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/automation/analytics">
            <Card className="transition-colors hover:border-[#0078d4] hover:bg-[#f3f9fd]">
              <CardContent className="flex items-center gap-4 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#deecf9] text-[#0078d4]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#323130]">Analytics</p>
                  <p className="text-xs text-[#605e5c]">Performance dashboard</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
