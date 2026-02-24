"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { ShieldAlert, AlertTriangle, TrendingDown, Eye, Ban, Activity } from "lucide-react"
import Link from "next/link"
import fraudRiskMonitoring from "@/data/seed/fraudRiskMonitoring.json"

export default function FraudRiskDashboard() {
  const data = fraudRiskMonitoring

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-[#d13438] text-white border-[#d13438]"
      case "high": return "bg-[#f7630c] text-white border-[#f7630c]"
      case "medium": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-[#107c10] text-white border-[#107c10]"
      case "investigating": return "bg-[#0078d4] text-white border-[#0078d4]"
      case "active": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  const getRiskCategoryColor = (category: string) => {
    switch (category) {
      case "critical_risk": return "text-red-600"
      case "high_risk": return "text-orange-600"
      case "medium_risk": return "text-amber-600"
      default: return "text-emerald-600"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Fraud & Risk Monitoring"
        subtitle="Real-time fraud detection, risk scoring, and investigation management"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
            {data.overview.totalSignals} Signals
          </span>
        }
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Active Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-red-600 sm:text-3xl">
                {data.overview.totalSignals}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data.overview.flaggedTransactions} flagged transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Investigations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-600 sm:text-3xl">
                {data.overview.activeInvestigations}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Avg response: {data.overview.avgResponseTime}h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blocked Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-800 sm:text-3xl">
                {data.overview.blockedEntities}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Users, devices, IPs, cards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prevented Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600 sm:text-3xl">
                ₹{(data.overview.preventedLoss / 100000).toFixed(2)}L
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">{data.overview.riskScore}% risk score</span>
              </div>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Fraud Signals</CardTitle>
            <Link href="/fraud/signals">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.fraudSignals.slice(0, 4).map((signal: any) => (
                <div key={signal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(signal.severity)}>
                          {signal.severity}
                        </Badge>
                        <Badge className={getStatusColor(signal.status)}>
                          {signal.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm">{signal.entityName}</h4>
                      <p className="text-xs text-slate-600 mt-1">{signal.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {signal.riskScore}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span className="capitalize">{signal.type.replace('_', ' ')}</span>
                    <span>{new Date(signal.detectedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>High Risk Entities</CardTitle>
            <Link href="/fraud/risk-scores">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.riskScores.filter((r: any) => r.category !== 'low_risk').map((entity: any) => (
                <div key={entity.entityId} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{entity.entityName}</h4>
                      <p className="text-xs text-slate-500 capitalize">{entity.entityType}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getRiskCategoryColor(entity.category)}`}>
                        {entity.overallScore}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {entity.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(entity.factors).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Investigations</CardTitle>
            <Link href="/fraud/investigations">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.investigations.filter((i: any) => i.status === 'active').map((investigation: any) => (
                <div key={investigation.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={investigation.priority === 'critical' ? 'bg-[#d13438] text-white border-[#d13438]' : 'bg-[#f7630c] text-white border-[#f7630c]'}>
                          {investigation.priority}
                        </Badge>
                        <Badge className="bg-[#0078d4] text-white border-[#0078d4]">
                          {investigation.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm">{investigation.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{investigation.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div>
                      <p className="text-slate-500">Users</p>
                      <p className="font-semibold text-slate-800">{investigation.affectedEntities.users}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Est. Loss</p>
                      <p className="font-semibold text-red-600">₹{(investigation.estimatedLoss / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Opened</p>
                      <p className="font-semibold text-slate-800">{new Date(investigation.openedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detected Patterns</CardTitle>
            <Link href="/fraud/patterns">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.patterns.map((pattern: any) => (
                <div key={pattern.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{pattern.name}</h4>
                      <p className="text-xs text-slate-500 capitalize">{pattern.type.replace('_', ' ')}</p>
                    </div>
                    <Badge className="bg-[#0078d4] text-white border-[#0078d4]">
                      {pattern.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div>
                      <p className="text-slate-500">Occurrences</p>
                      <p className="font-semibold text-slate-800">{pattern.occurrences}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Affected</p>
                      <p className="font-semibold text-amber-600">{pattern.affectedEntities}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Prevented</p>
                      <p className="font-semibold text-emerald-600">₹{(pattern.preventedLoss / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection title="Fraud Signal Distribution">
        <Card>
          <CardHeader>
            <CardTitle>Signals by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.analytics.byType.map((type: any) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-slate-800 capitalize">{type.type.replace('_', ' ')}</span>
                      <p className="text-xs text-slate-500">{type.count} signals • Avg: {type.avgSeverity}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{type.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/fraud/signals">
            <Card className="hover:border-red-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-semibold text-slate-800">Fraud Signals</h3>
                <p className="text-xs text-slate-500 mt-1">{data.overview.totalSignals} active</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/fraud/risk-scores">
            <Card className="hover:border-amber-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold text-slate-800">Risk Scores</h3>
                <p className="text-xs text-slate-500 mt-1">Real-time scoring</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/fraud/investigations">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Investigations</h3>
                <p className="text-xs text-slate-500 mt-1">{data.overview.activeInvestigations} active</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/fraud/blocked">
            <Card className="hover:border-slate-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Ban className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Blocked</h3>
                <p className="text-xs text-slate-500 mt-1">{data.overview.blockedEntities} entities</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}