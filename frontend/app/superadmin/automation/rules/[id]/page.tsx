"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { 
  ArrowLeft, Edit, Play, Pause, Trash2, Copy, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, Activity
} from "lucide-react"
import { 
  getAutomationRule,
  getRuleExecutionLogs,
  getRuleAnalytics,
  type AutomationRule
} from "@/shared/services/automationService"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ruleId = params.id as string

  const [rule, setRule] = useState<AutomationRule | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadData()
  }, [ruleId])

  async function loadData() {
    setLoading(true)
    const [ruleData, logsData, analyticsData] = await Promise.all([
      getAutomationRule(ruleId),
      getRuleExecutionLogs(ruleId, 20),
      getRuleAnalytics(ruleId)
    ])
    
    if (ruleData) {
      setRule(ruleData)
      setLogs(logsData)
      setAnalytics(analyticsData)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading rule details...</div>
        </div>
      </PageLayout>
    )
  }

  if (!rule) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Rule not found</h3>
          <Button onClick={() => router.push("/superadmin/automation/rules")}>
            Back to Rules
          </Button>
        </div>
      </PageLayout>
    )
  }

  // Mock chart data
  const executionTrend = [
    { date: "Mon", executions: rule.executions24h * 0.8, success: rule.executions24h * 0.8 * (rule.successRate / 100) },
    { date: "Tue", executions: rule.executions24h * 0.9, success: rule.executions24h * 0.9 * (rule.successRate / 100) },
    { date: "Wed", executions: rule.executions24h * 1.1, success: rule.executions24h * 1.1 * (rule.successRate / 100) },
    { date: "Thu", executions: rule.executions24h * 1.0, success: rule.executions24h * 1.0 * (rule.successRate / 100) },
    { date: "Fri", executions: rule.executions24h * 0.95, success: rule.executions24h * 0.95 * (rule.successRate / 100) },
    { date: "Sat", executions: rule.executions24h * 0.7, success: rule.executions24h * 0.7 * (rule.successRate / 100) },
    { date: "Sun", executions: rule.executions24h * 0.6, success: rule.executions24h * 0.6 * (rule.successRate / 100) }
  ]

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/automation/rules")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>{rule.name}</span>
            {rule.enabled ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Badge variant="secondary">Disabled</Badge>
            )}
          </div>
        }
        description={rule.description}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              {rule.enabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {rule.enabled ? "Disable" : "Enable"}
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Executions (24h)</div>
            <div className="text-2xl font-bold mt-1">{rule.executions24h}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-2xl font-bold mt-1">{rule.successRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(rule.executions24h * (rule.successRate / 100))} successful
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Duration</div>
            <div className="text-2xl font-bold mt-1">{analytics?.avgDuration || "N/A"}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Per execution
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Priority</div>
            <div className="mt-1">
              <Badge variant={
                rule.priority === "CRITICAL" ? "destructive" :
                rule.priority === "HIGH" ? "default" :
                "secondary"
              }>
                {rule.priority}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {rule.category}
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Tabs */}
      <PageSection>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Rule Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Pack</div>
                    <div className="font-medium">{rule.pack}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <Badge variant="outline">{rule.category}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Priority</div>
                    <Badge>{rule.priority}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {new Date(rule.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                    <div className="font-medium">
                      {new Date(rule.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Execution Trend (7 days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={executionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="mt-6">
            <div className="space-y-6">
              {/* Trigger */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Trigger</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge>{rule.trigger.type}</Badge>
                  </div>
                  {rule.trigger.entity && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entity:</span>
                      <code className="px-2 py-1 bg-muted rounded">{rule.trigger.entity}</code>
                    </div>
                  )}
                  {rule.trigger.event && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Event:</span>
                      <code className="px-2 py-1 bg-muted rounded">{rule.trigger.event}</code>
                    </div>
                  )}
                  {rule.trigger.schedule && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Schedule:</span>
                      <code className="px-2 py-1 bg-muted rounded">{rule.trigger.schedule}</code>
                    </div>
                  )}
                </div>
              </Card>

              {/* Conditions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Conditions ({rule.conditions.length})</h3>
                {rule.conditions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No conditions - executes on every trigger</p>
                ) : (
                  <div className="space-y-2">
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="text-sm p-3 bg-muted rounded">
                        {index > 0 && condition.logic && (
                          <Badge variant="outline" className="mr-2">{condition.logic}</Badge>
                        )}
                        <code>
                          {condition.field} {condition.operator.replace(/_/g, " ")} {condition.value}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Actions ({rule.actions.length})</h3>
                <div className="space-y-3">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{index + 1}</Badge>
                        <span className="font-medium">{action.type}</span>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(action.config, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Guardrails */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Guardrails</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Idempotency:</span>
                    <Badge variant={rule.guardrails.idempotency ? "default" : "secondary"}>
                      {rule.guardrails.idempotency ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Retries:</span>
                    <span className="font-medium">{rule.guardrails.maxRetries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Timeout:</span>
                    <span className="font-medium">{rule.guardrails.timeout}</span>
                  </div>
                  {rule.guardrails.compensation && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Compensation:</span>
                      <code className="px-2 py-1 bg-muted rounded">{rule.guardrails.compensation}</code>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="mt-6">
            <Card>
              <div className="divide-y">
                {logs.map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.status === "SUCCESS" ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{log.executionId}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.startedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>Duration: {log.duration}</span>
                      </div>
                      {log.error && (
                        <div className="text-red-600 text-xs mt-2 p-2 bg-red-50 rounded">
                          {log.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Execution Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">24h Executions:</span>
                    <span className="font-bold">{analytics?.executions24h || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">7d Executions:</span>
                    <span className="font-bold">{analytics?.executions7d || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">30d Executions:</span>
                    <span className="font-bold">{analytics?.executions30d || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="font-bold text-green-600">{analytics?.successRate || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Error Rate:</span>
                    <span className="font-bold text-red-600">{analytics?.errorRate || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Duration:</span>
                    <span className="font-bold">{analytics?.avgDuration || "N/A"}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Top Errors</h3>
                {analytics?.topErrors && analytics.topErrors.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.topErrors.map((error: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                        <span className="truncate flex-1">{error.error}</span>
                        <Badge variant="outline">{error.count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No errors recorded</p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  )
}
