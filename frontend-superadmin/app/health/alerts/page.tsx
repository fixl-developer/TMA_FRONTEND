/**
 * Alert Configuration
 *
 * Configure alert rules and notification thresholds.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  condition: string
  threshold: number
  severity: "critical" | "warning" | "info"
  enabled: boolean
  channels: string[]
  cooldown: number
  lastTriggered: string | null
  triggerCount: number
}

export default function AlertConfigurationPage() {
  const [rules, setRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/data/seed/alertRules.json")
      .then((res) => res.json())
      .then((data) => {
        setRules(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-rose-100 text-rose-700 border-rose-200"
      case "warning": return "bg-amber-100 text-amber-700 border-amber-200"
      case "info": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Alert Configuration"
        description="Configure alert rules and notification thresholds"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Bell className="h-3.5 w-3.5 text-emerald-500" />
            {rules.filter(r => r.enabled).length} Active Rules
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Alert Rule
            </Button>
            <Link
              href="/superadmin/health"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        }
      />

      <PageSection title="Alert rules">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">Loading alert rules...</p>
            </CardContent>
          </Card>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">No alert rules configured</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                        {rule.enabled ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{rule.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {rule.enabled ? (
                        <ToggleRight className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Metric</p>
                      <p className="text-sm font-medium text-slate-800 capitalize">
                        {rule.metric.replace(/_/g, " ")}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Condition</p>
                      <p className="text-sm font-medium text-slate-800">
                        {rule.condition} {rule.threshold}
                        {rule.metric.includes("rate") || rule.metric.includes("usage") ? "%" : ""}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Cooldown</p>
                      <p className="text-sm font-medium text-slate-800">{rule.cooldown} min</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Triggered</p>
                      <p className="text-sm font-medium text-slate-800">{rule.triggerCount} times</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Notification Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {rule.channels.map((channel, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs capitalize">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {rule.lastTriggered ? (
                        <>Last triggered: {new Date(rule.lastTriggered).toLocaleString('en-IN')}</>
                      ) : (
                        <>Never triggered</>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      {rule.enabled ? (
                        <Button size="sm" variant="outline">
                          Disable
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Enable
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Alert statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-800">{rules.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {rules.filter(r => r.enabled).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-rose-600">
                {rules.filter(r => r.severity === "critical").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
