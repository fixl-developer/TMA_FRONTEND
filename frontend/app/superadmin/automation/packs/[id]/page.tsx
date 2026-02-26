"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { 
  ArrowLeft, Download, Settings, Play, Pause, 
  CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle
} from "lucide-react"
import { 
  getAutomationPack,
  getAutomationRulesByPackAsync,
  type AutomationPack,
  type AutomationRule
} from "@/shared/services/automationService"
import { getBlueprints } from "@/shared/services/blueprintService"
import Link from "next/link"

export default function AutomationPackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const packId = params.id as string

  const [pack, setPack] = useState<AutomationPack | null>(null)
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [blueprints, setBlueprints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadData()
  }, [packId])

  async function loadData() {
    setLoading(true)
    const [packData, rulesData, blueprintsData] = await Promise.all([
      getAutomationPack(packId),
      getAutomationRulesByPackAsync(packId),
      getBlueprints()
    ])
    
    if (packData) {
      setPack(packData)
      setRules(rulesData)
      setBlueprints(blueprintsData.filter(b => packData.blueprints.includes(b.id)))
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading pack details...</div>
        </div>
      </PageLayout>
    )
  }

  if (!pack) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Pack not found</h3>
          <Button onClick={() => router.push("/superadmin/automation/packs")}>
            Back to Packs
          </Button>
        </div>
      </PageLayout>
    )
  }

  const enabledRules = rules.filter(r => r.enabled).length
  const totalExecutions = rules.reduce((sum, r) => sum + r.executions24h, 0)
  const avgSuccessRate = Math.round(
    rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length
  )

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/automation/packs")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>{pack.name}</span>
            <Badge variant={pack.status === "ACTIVE" ? "default" : "secondary"}>
              {pack.status}
            </Badge>
          </div>
        }
        description={pack.description}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Install Pack
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <PageSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Rules</div>
            <div className="text-2xl font-bold mt-1">{rules.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {enabledRules} enabled
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Executions (24h)</div>
            <div className="text-2xl font-bold mt-1">{totalExecutions.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-2xl font-bold mt-1">{avgSuccessRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Average across rules
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Installs</div>
            <div className="text-2xl font-bold mt-1">{pack.installCount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              v{pack.version}
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Tabs */}
      <PageSection>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
            <TabsTrigger value="blueprints">Blueprints ({blueprints.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Pack Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="font-medium">{pack.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={pack.status === "ACTIVE" ? "default" : "secondary"}>
                      {pack.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="font-medium">{pack.version}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {new Date(pack.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                    <div className="font-medium">
                      {new Date(pack.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Rule Categories</h3>
                <div className="space-y-2">
                  {Array.from(new Set(rules.map(r => r.category))).map(category => {
                    const count = rules.filter(r => r.category === category).length
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card>
              <div className="divide-y">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rule.name}</h4>
                          {rule.enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {rule.priority}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {rule.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rule.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rule.executions24h} executions
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {rule.successRate}% success
                          </div>
                          <div>
                            Trigger: {rule.trigger.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="blueprints" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blueprints.map(blueprint => (
                <Link key={blueprint.id} href={`/superadmin/blueprints/${blueprint.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <h4 className="font-semibold mb-2">{blueprint.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blueprint.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline">{blueprint.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {blueprint.modules.length} modules
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Rule Priority Distribution</h3>
                <div className="space-y-3">
                  {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(priority => {
                    const count = rules.filter(r => r.priority === priority).length
                    const percentage = Math.round((count / rules.length) * 100)
                    return (
                      <div key={priority}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{priority}</span>
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Top Performing Rules</h3>
                <div className="space-y-3">
                  {rules
                    .sort((a, b) => b.successRate - a.successRate)
                    .slice(0, 5)
                    .map(rule => (
                      <div key={rule.id} className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1">{rule.name}</span>
                        <Badge variant="outline">{rule.successRate}%</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  )
}
