/**
 * Fraud Pattern Detection
 *
 * AI-powered fraud pattern analysis and trend detection.
 */

"use client"

import { ArrowLeft, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"

export default function FraudPatternsPage() {
  const patterns = [
    {
      id: 1,
      name: "Card Testing Pattern",
      description: "Multiple small transactions followed by large withdrawal attempts",
      occurrences: 12,
      trend: "increasing",
      severity: "high"
    },
    {
      id: 2,
      name: "Account Takeover",
      description: "Sudden change in login patterns with password resets",
      occurrences: 8,
      trend: "stable",
      severity: "critical"
    },
    {
      id: 3,
      name: "Velocity Abuse",
      description: "Unusually high transaction frequency in short time windows",
      occurrences: 15,
      trend: "decreasing",
      severity: "medium"
    }
  ]

  return (
    <PageLayout>
      <PageHeader
        title="Fraud Pattern Detection"
        description="AI-powered analysis of fraud patterns and trends"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Activity className="h-3.5 w-3.5 text-violet-500" />
            Pattern Analysis
          </span>
        }
        actions={
          <Link
            href="/superadmin/fraud"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <PageSection title="Detected patterns">
        <div className="space-y-4">
          {patterns.map((pattern) => (
            <Card key={pattern.id} className="hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{pattern.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pattern.severity === "critical" ? "bg-rose-100 text-rose-700" :
                      pattern.severity === "high" ? "bg-orange-100 text-orange-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {pattern.severity}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Occurrences</p>
                      <p className="text-2xl font-bold text-slate-800">{pattern.occurrences}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`h-5 w-5 ${
                        pattern.trend === "increasing" ? "text-rose-500" :
                        pattern.trend === "decreasing" ? "text-emerald-500" :
                        "text-slate-400"
                      }`} />
                      <span className="text-sm text-slate-600 capitalize">{pattern.trend}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}
