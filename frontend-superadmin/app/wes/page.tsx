"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { TrendingUp, TrendingDown, Minus, Zap, Target, Users, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import wesAnalytics from "@/data/seed/wesAnalytics.json"
import automationRules from "@/data/seed/automationRules.json"

export default function WESDashboard() {
  const analytics = wesAnalytics
  const rules = automationRules

  // Group rules by packId for display
  const rulesByPack = rules.reduce((acc: any, rule: any) => {
    if (!acc[rule.packId]) {
      acc[rule.packId] = { rules: [], active: 0 }
    }
    acc[rule.packId].rules.push(rule)
    if (rule.status === 'ACTIVE') acc[rule.packId].active++
    return acc
  }, {})

  const topPacks = Object.entries(rulesByPack)
    .map(([packId, data]: [string, any]) => ({
      name: packId.replace('pack_', '').replace(/_/g, ' '),
      ruleCount: data.rules.length,
      activeCount: data.active,
    }))
    .slice(0, 4)

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-[#107c10]"
    if (score >= 70) return "text-[#ffb900]" 
    return "text-[#d13438]"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-[#107c10] text-white border-[#107c10]"
    if (score >= 70) return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
    return "bg-[#d13438] text-white border-[#d13438]"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-[#107c10]" />
      case "down": return <TrendingDown className="h-3 w-3 text-[#d13438]" />
      default: return <Minus className="h-3 w-3 text-[#a19f9d]" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Workflow Efficiency Score (WES)"
        description="AI-driven workflow optimization and automation insights across all tenants"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Zap className="h-3.5 w-3.5 text-[#0078d4]" />
            AI-Powered
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/wes/executions"><Button variant="outline" size="sm">Executions</Button></Link>
            <Link href="/wes/analytics"><Button variant="outline" size="sm">Analytics</Button></Link>
            <Link href="/wes/bottlenecks"><Button variant="outline" size="sm">Bottlenecks</Button></Link>
            <Link href="/wes/kpis"><Button variant="outline" size="sm">KPIs</Button></Link>
          </div>
        }
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Platform WES Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-semibold sm:text-3xl ${getScoreColor(analytics.overview.platformWES)}`}>
                {analytics.overview.platformWES}/100
              </p>
              <p className="text-xs text-[#605e5c] mt-1">
                Across {analytics.overview.totalTenants} tenants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">High Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#107c10] sm:text-3xl">
                {analytics.overview.highPerformers}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">
                WES Score ≥ 85 (36% of tenants)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4] sm:text-3xl">
                {analytics.overview.activeRules}/{analytics.overview.automationRules}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">
                {Math.round((analytics.overview.activeRules / analytics.overview.automationRules) * 100)}% adoption rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130] sm:text-3xl">
                {analytics.overview.avgResponseTime}h
              </p>
              <p className="text-xs text-[#605e5c] mt-1">
                {analytics.overview.avgResolutionRate}% resolution rate
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">WES Trend (6 Months)</CardTitle>
            <Link href="/wes/metrics">
              <Button variant="outline" size="sm">View Details</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.historicalTrend.map((month: any, index: number) => {
                const prevScore = index > 0 ? analytics.historicalTrend[index - 1].score : month.score
                const change = month.score - prevScore
                return (
                  <div key={month.month} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                    <div>
                      <p className="text-xs font-medium text-[#323130]">{month.month}</p>
                      {index > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-[#107c10]" />
                          ) : change < 0 ? (
                            <TrendingDown className="h-3 w-3 text-[#d13438]" />
                          ) : (
                            <Minus className="h-3 w-3 text-[#a19f9d]" />
                          )}
                          <span className={`text-xs ${change > 0 ? 'text-[#107c10]' : change < 0 ? 'text-[#d13438]' : 'text-[#a19f9d]'}`}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className={getScoreBadgeColor(month.score)}>
                      {month.score}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Blueprint Performance</CardTitle>
            <Link href="/wes/tenant-scores">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.blueprintBenchmarks.map((blueprint: any) => (
                <div key={blueprint.blueprint} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-[#323130] capitalize">{blueprint.blueprint}</p>
                    <p className="text-xs text-[#605e5c]">{blueprint.tenantCount} tenants</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getScoreBadgeColor(blueprint.avgWES)}>
                      {blueprint.avgWES}
                    </Badge>
                    <p className="text-xs text-[#605e5c] mt-1">
                      Top: {blueprint.topPerformer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Top Performing Tenants</CardTitle>
            <Link href="/wes/tenant-scores">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.tenantScores.slice(0, 5).map((tenant: any) => (
                <div key={tenant.tenantId} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-[#323130]">{tenant.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {tenant.blueprint}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(tenant.trend)}
                        <span className={`text-xs ${
                          tenant.trend === 'up' ? 'text-[#107c10]' : 
                          tenant.trend === 'down' ? 'text-[#d13438]' : 'text-[#a19f9d]'
                        }`}>
                          {tenant.trend === 'up' ? '+' : tenant.trend === 'down' ? '-' : ''}{Math.abs(tenant.trendValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getScoreBadgeColor(tenant.wesScore)}>
                    {tenant.wesScore}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Automation Rules Status</CardTitle>
            <Link href="/wes/rules">
              <Button variant="outline" size="sm">Manage Rules</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPacks.map((pack: any) => (
                <div key={pack.name} className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-[#323130] capitalize">{pack.name}</p>
                    <p className="text-xs text-[#605e5c]">Automation pack</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#323130]">
                      {pack.activeCount}/{pack.ruleCount}
                    </p>
                    <p className="text-xs text-[#605e5c]">
                      {Math.round((pack.activeCount / pack.ruleCount) * 100)}% active
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection title="AI Recommendations">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Optimization Recommendations</CardTitle>
            <Link href="/wes/recommendations">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recommendations.slice(0, 3).map((rec: any) => (
                <div key={rec.id} className="rounded border border-[#edebe9] bg-[#faf9f8] p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        rec.priority === 'high' ? 'bg-[#d13438] text-white border-[#d13438]' :
                        rec.priority === 'medium' ? 'bg-[#ffb900] text-[#323130] border-[#ffb900]' :
                        'bg-[#a19f9d] text-white border-[#a19f9d]'
                      }>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                    </div>
                    <Badge className={
                      rec.status === 'in_progress' ? 'bg-[#0078d4] text-white border-[#0078d4]' :
                      rec.status === 'planned' ? 'bg-[#5c2d91] text-white border-[#5c2d91]' :
                      'bg-[#a19f9d] text-white border-[#a19f9d]'
                    }>
                      {rec.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-[#323130] mb-1">{rec.title}</h4>
                  <p className="text-xs text-[#605e5c] mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#605e5c]">
                    <span>{rec.affectedTenants} tenants affected</span>
                    <span>Est. improvement: +{rec.estimatedImprovement} WES points</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}