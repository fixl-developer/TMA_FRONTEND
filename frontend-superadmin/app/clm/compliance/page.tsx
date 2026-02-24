/**
 * Contract Compliance - Super Admin
 *
 * Track compliance checks and requirements.
 */

"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import clmData from "@/data/seed/clm.json"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"

type ComplianceCheck = {
  _id: string
  contractId: string
  checkType: string
  scheduledDate: string
  status: string
  priority: string
  assignedTo: string
  checkpoints: string[]
}

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OVERDUE: "bg-rose-50 text-rose-700 border-rose-200",
}

const priorityColors = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200",
  CRITICAL: "bg-rose-100 text-rose-800 border-rose-300",
}

export default function ContractCompliance() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setChecks(clmData.complianceChecks as ComplianceCheck[])
    setLoading(false)
  }, [])

  const metrics = {
    total: checks.length,
    pending: checks.filter(c => c.status === "PENDING").length,
    overdue: checks.filter(c => c.status === "OVERDUE").length,
    completed: checks.filter(c => c.status === "COMPLETED").length,
  }

  return (
    <PageLayout>
      <PageHeader
        title="Contract Compliance"
        description="Track compliance checks and requirements across all contracts."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            {metrics.overdue} Overdue
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total checks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-800">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Compliance checks scheduled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">
                {loading ? "—" : metrics.pending}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Awaiting action
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-rose-600">
                {loading ? "—" : metrics.overdue}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {loading ? "—" : metrics.completed}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Compliance checks">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => (
              <Card key={check._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{check.checkType.replace(/_/g, " ")}</CardTitle>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          statusColors[check.status as keyof typeof statusColors]
                        }`}>
                          {check.status}
                        </span>
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          priorityColors[check.priority as keyof typeof priorityColors]
                        }`}>
                          {check.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Contract: {check.contractId}
                      </p>
                    </div>
                    <div className="text-right">
                      {check.status === "OVERDUE" ? (
                        <div className="flex items-center gap-1 text-rose-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Overdue</span>
                        </div>
                      ) : check.status === "COMPLETED" ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Scheduled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Scheduled date</p>
                        <p className="text-sm text-slate-600">
                          {new Date(check.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">Assigned to</p>
                        <p className="text-sm text-slate-600">{check.assignedTo}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-2">Checkpoints ({check.checkpoints.length})</p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {check.checkpoints.map((checkpoint, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-slate-400">•</span>
                              <span>{checkpoint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View details
                        </Button>
                        {check.status !== "COMPLETED" && (
                          <Button size="sm" className="flex-1">
                            Start check
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Compliance summary">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By check type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(new Set(checks.map(c => c.checkType))).map(type => {
                  const count = checks.filter(c => c.checkType === type).length
                  return (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{type.replace(/_/g, " ")}</span>
                      <span className="font-medium text-slate-800">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(statusColors).map(([status]) => {
                  const count = checks.filter(c => c.status === status).length
                  if (count === 0) return null
                  return (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{status}</span>
                      <span className="font-medium text-slate-800">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(priorityColors).map(([priority]) => {
                  const count = checks.filter(c => c.priority === priority).length
                  if (count === 0) return null
                  return (
                    <div key={priority} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{priority}</span>
                      <span className="font-medium text-slate-800">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
