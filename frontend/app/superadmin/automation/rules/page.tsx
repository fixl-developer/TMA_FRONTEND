"use client"

import { useState, useEffect } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { 
  Search, Plus, Filter, Download, Play, Pause, 
  Settings, TrendingUp, Clock, CheckCircle, XCircle
} from "lucide-react"
import { 
  getAutomationRules,
  getAutomationRuleStatsAsync,
  searchAutomationRules,
  type AutomationRule
} from "@/shared/services/automationService"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AutomationRulesPage() {
  const router = useRouter()
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [filteredRules, setFilteredRules] = useState<AutomationRule[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterRules()
  }, [rules, searchQuery, categoryFilter, priorityFilter, statusFilter])

  async function loadData() {
    setLoading(true)
    const [rulesData, statsData] = await Promise.all([
      getAutomationRules(),
      getAutomationRuleStatsAsync()
    ])
    setRules(rulesData)
    setStats(statsData)
    setLoading(false)
  }

  async function filterRules() {
    let filtered = rules

    // Search filter
    if (searchQuery) {
      const results = await searchAutomationRules(searchQuery)
      filtered = results
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(r => r.category === categoryFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(r => r.priority === priorityFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      const enabled = statusFilter === "enabled"
      filtered = filtered.filter(r => r.enabled === enabled)
    }

    setFilteredRules(filtered)
  }

  const categories = Array.from(new Set(rules.map(r => r.category)))

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading automation rules...</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Automation Rules"
        description="Manage and configure automation rules across all packs"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => router.push("/superadmin/automation/rules/builder")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Rules</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.enabled} enabled
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Executions (24h)</div>
              <div className="text-2xl font-bold mt-1">{stats.totalExecutions24h.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Success Rate</div>
              <div className="text-2xl font-bold mt-1">{stats.avgSuccessRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all rules
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Critical Rules</div>
              <div className="text-2xl font-bold mt-1">{stats.byPriority.critical}</div>
              <div className="text-xs text-muted-foreground mt-1">
                High priority: {stats.byPriority.high}
              </div>
            </Card>
          </div>
        </PageSection>
      )}

      {/* Filters */}
      <PageSection>
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </Card>
      </PageSection>

      {/* Rules List */}
      <PageSection>
        <Card>
          <div className="divide-y">
            {filteredRules.map(rule => (
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
                      <div>
                        {rule.actions.length} action(s)
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

        {filteredRules.length === 0 && (
          <Card className="p-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No rules found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => router.push("/superadmin/automation/rules/builder")}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Rule
            </Button>
          </Card>
        )}
      </PageSection>
    </PageLayout>
  )
}
