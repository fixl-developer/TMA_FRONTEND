/**
 * Tenant-Specific WES Detail Page
 *
 * Detailed WES breakdown for a specific tenant with metrics, recommendations, and trends.
 */

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Zap, Target, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface WESScore {
  id: string
  tenantId: string
  tenantName: string
  blueprint: string
  currentScore: number
  previousScore: number
  trend: "up" | "down" | "stable"
  lastCalculated: string
  metrics: {
    automationAdoption: number
    responseTime: number
    resolutionRate: number
    processCompliance: number
    dataQuality: number
  }
  rank: number
  totalTenants: number
}

interface Recommendation {
  id: string
  priority: "high" | "medium" | "low"
  category: string
  title: string
  description: string
  potentialImpact: string
  estimatedTimeSaving: string
  status: "pending" | "implemented" | "dismissed"
}

export default function TenantWESDetailPage() {
  const params = useParams()
  const tenantId = params.tenantId as string

  const [score, setScore] = useState<WESScore | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load tenant score
    fetch("/data/seed/wesScores.json")
      .then((res) => res.json())
      .then((data: WESScore[]) => {
        const tenantScore = data.find(s => s.tenantId === tenantId)
        setScore(tenantScore || null)
      })

    // Load recommendations
    fetch("/data/seed/wesRecommendations.json")
      .then((res) => res.json())
      .then((data: Recommendation[]) => {
        const tenantRecs = data.filter(r => r.tenantId === tenantId)
        setRecommendations(tenantRecs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [tenantId])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading tenant details...</p>
        </div>
      </PageLayout>
    )
  }

  if (!score) {
    return (
      <PageLayout>
        <PageHeader title="Tenant Not Found" description="The requested tenant could not be found." />
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-slate-500">No WES data available for this tenant.</p>
            <div className="flex justify-center mt-4">
              <Link href="/superadmin/wes">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    )
  }

  const getScoreColor = (value: number) => {
    if (value >= 90) return "text-emerald-600"
    if (value >= 75) return "text-blue-600"
    if (value >= 60) return "text-amber-600"
    return "text-rose-600"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-rose-100 text-rose-700 border-rose-200"
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200"
      case "low": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const scoreDiff = score.currentScore - score.previousScore

  return (
    <PageLayout>
      <PageHeader
        title={score.tenantName}
        description={`WES analysis for ${score.blueprint} blueprint`}
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Target className="h-3.5 w-3.5 text-blue-500" />
            Rank #{score.rank} of {score.totalTenants}
          </span>
        }
        actions={
          <Link
            href="/superadmin/wes"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        }
      />

      <PageSection title="Overall score">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-amber-500" />
                Current WES Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <p className={`text-4xl font-bold ${getScoreColor(score.currentScore)}`}>
                  {score.currentScore}
                </p>
                <div className="flex items-center gap-1">
                  {score.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  ) : score.trend === "down" ? (
                    <TrendingDown className="h-5 w-5 text-rose-500" />
                  ) : null}
                  <span className={scoreDiff > 0 ? "text-emerald-600" : scoreDiff < 0 ? "text-rose-600" : "text-slate-600"}>
                    {scoreDiff > 0 ? "+" : ""}{scoreDiff}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Last calculated: {new Date(score.lastCalculated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-blue-500" />
                Platform Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">#{score.rank}</p>
              <p className="text-sm text-slate-500 mt-2">Out of {score.totalTenants} tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-slate-800">
                {recommendations.filter(r => r.status === "pending").length}
              </p>
              <p className="text-sm text-slate-500 mt-2">Pending actions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-violet-500" />
                Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-violet-600">
                {recommendations
                  .filter(r => r.status === "pending")
                  .reduce((sum, r) => {
                    const hours = parseInt(r.estimatedTimeSaving.match(/\d+/)?.[0] || "0")
                    return sum + hours
                  }, 0)}h
              </p>
              <p className="text-sm text-slate-500 mt-2">Per month</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Metric breakdown">
        <Card>
          <CardHeader>
            <CardTitle>Performance metrics</CardTitle>
            <p className="text-sm text-slate-500">Individual component scores</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(score.metrics).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(value)}`}>
                      {value}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        value >= 90 ? "bg-emerald-500" :
                        value >= 75 ? "bg-blue-500" :
                        value >= 60 ? "bg-amber-500" :
                        "bg-rose-500"
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="AI-driven recommendations">
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">All caught up!</p>
                <p className="text-sm text-slate-500 mt-1">No recommendations at this time.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className={rec.status === "implemented" ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        {rec.status === "implemented" && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Implemented
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{rec.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Category</p>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Potential Impact</p>
                      <p className="text-sm font-semibold text-emerald-600">{rec.potentialImpact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Time Savings</p>
                      <p className="text-sm font-semibold text-blue-600">{rec.estimatedTimeSaving}</p>
                    </div>
                  </div>
                  {rec.status === "pending" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Implement
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
