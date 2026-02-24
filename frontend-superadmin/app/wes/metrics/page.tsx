"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { TrendingUp, TrendingDown, Clock, Target, Users, Zap, BarChart3, Download } from "lucide-react"
import { useState } from "react"
import wesAnalytics from "@/data/seed/wesAnalytics.json"

export default function WESMetricsPage() {
  const [selectedBlueprint, setSelectedBlueprint] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  
  const analytics = wesAnalytics

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600"
    if (score >= 70) return "text-amber-600" 
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 70) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const filteredBenchmarks = selectedBlueprint === "all" 
    ? analytics.blueprintBenchmarks 
    : analytics.blueprintBenchmarks.filter(b => b.blueprint === selectedBlueprint)

  return (
    <PageLayout>
      <PageHeader
        title="WES Detailed Metrics"
        subtitle="Comprehensive workflow efficiency analysis and performance metrics"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
            Analytics
          </span>
        }
      />

      <PageSection>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by blueprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blueprints</SelectItem>
              <SelectItem value="pageant">Pageant</SelectItem>
              <SelectItem value="modelling">Modelling</SelectItem>
              <SelectItem value="talent">Talent</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Overall WES Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-semibold sm:text-3xl ${getScoreColor(analytics.overview.platformWES)}`}>
                {analytics.overview.platformWES}/100
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+1.2 vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-800 sm:text-3xl">
                {analytics.overview.avgResponseTime}h
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">-0.3h improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600 sm:text-3xl">
                {analytics.overview.avgResolutionRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+2.1% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                Automation Adoption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-sky-600 sm:text-3xl">
                86.5%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+4.2% vs last month</span>
              </div>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>WES Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Excellent (85-100)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-9/12 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800">89 tenants</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Good (70-84)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-7/12 h-full bg-amber-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800">116 tenants</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Needs Improvement (50-69)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-4/12 h-full bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800">42 tenants</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Critical (<50)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/12 h-full bg-red-700 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800">0 tenants</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.historicalTrend.map((month: any, index: number) => {
                const prevScore = index > 0 ? analytics.historicalTrend[index - 1].score : month.score
                const change = month.score - prevScore
                return (
                  <div key={month.month} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{month.month}</p>
                      {index > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                          ) : change < 0 ? (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          ) : null}
                          <span className={`text-xs ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-slate-400'}`}>
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blueprint Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Blueprint</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Avg WES</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Tenants</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Top Performer</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Response Time</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Resolution Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Automation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBenchmarks.map((blueprint: any) => (
                    <tr key={blueprint.blueprint} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium capitalize">{blueprint.blueprint}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge className={getScoreBadgeColor(blueprint.avgWES)}>
                          {blueprint.avgWES}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-right">{blueprint.tenantCount}</td>
                      <td className="py-3 px-4 text-sm text-slate-900 text-right font-semibold">{blueprint.topPerformer}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-right">{blueprint.keyMetrics.avgResponseTime}h</td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-right">{blueprint.keyMetrics.avgResolutionRate}%</td>
                      <td className="py-3 px-4 text-sm text-slate-600 text-right">{blueprint.keyMetrics.avgAutomationAdoption}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection title="Key Performance Indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">User Satisfaction</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-semibold text-slate-800">4.6/5.0</p>
              <p className="text-xs text-slate-500 mt-1">+0.2 vs last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Process Efficiency</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-semibold text-slate-800">82.4%</p>
              <p className="text-xs text-slate-500 mt-1">+3.1% improvement</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Error Rate</span>
                <TrendingDown className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-semibold text-slate-800">2.1%</p>
              <p className="text-xs text-slate-500 mt-1">-0.8% reduction</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Time to Resolution</span>
                <TrendingDown className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-semibold text-slate-800">4.2h</p>
              <p className="text-xs text-slate-500 mt-1">-1.3h faster</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}