"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { TrendingUp, TrendingDown, Minus, Search, Eye, Download, Filter } from "lucide-react"
import { useState } from "react"
import wesAnalytics from "@/data/seed/wesAnalytics.json"

export default function TenantScoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlueprint, setSelectedBlueprint] = useState("all")
  const [sortBy, setSortBy] = useState("wesScore")
  const [sortOrder, setSortOrder] = useState("desc")
  
  const tenants = wesAnalytics.tenantScores

  const filteredTenants = tenants
    .filter(tenant => {
      const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tenant.tenantId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBlueprint = selectedBlueprint === "all" || tenant.blueprint === selectedBlueprint
      
      return matchesSearch && matchesBlueprint
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as number
      const bValue = b[sortBy as keyof typeof b] as number
      
      if (sortOrder === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-emerald-600" />
      case "down": return <TrendingDown className="h-3 w-3 text-red-600" />
      default: return <Minus className="h-3 w-3 text-slate-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-emerald-600"
      case "down": return "text-red-600"
      default: return "text-slate-400"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Tenant WES Scores"
        subtitle="Individual workflow efficiency scores and performance metrics for all tenants"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Filter className="h-3.5 w-3.5 text-blue-500" />
            {filteredTenants.length} Tenants
          </span>
        }
      />

      <PageSection>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tenants by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
            <SelectTrigger className="w-full lg:w-48">
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
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wesScore">WES Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="blueprint">Blueprint</SelectItem>
              <SelectItem value="trendValue">Trend</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="w-full lg:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </PageSection>

      <PageSection title="Performance Overview">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Excellent (85+)</span>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              </div>
              <p className="text-2xl font-semibold text-emerald-600">
                {filteredTenants.filter(t => t.wesScore >= 85).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round((filteredTenants.filter(t => t.wesScore >= 85).length / filteredTenants.length) * 100)}% of tenants
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Good (70-84)</span>
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              </div>
              <p className="text-2xl font-semibold text-amber-600">
                {filteredTenants.filter(t => t.wesScore >= 70 && t.wesScore < 85).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round((filteredTenants.filter(t => t.wesScore >= 70 && t.wesScore < 85).length / filteredTenants.length) * 100)}% of tenants
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Needs Improvement</span>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
              </div>
              <p className="text-2xl font-semibold text-red-600">
                {filteredTenants.filter(t => t.wesScore < 70).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round((filteredTenants.filter(t => t.wesScore < 70).length / filteredTenants.length) * 100)}% of tenants
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Avg Score</span>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-semibold text-blue-600">
                {(filteredTenants.reduce((sum, t) => sum + t.wesScore, 0) / filteredTenants.length).toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Across all filtered tenants</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title={`Tenant Scores (${filteredTenants.length})`}>
        <div className="space-y-4">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.tenantId}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{tenant.name}</h3>
                      <Badge className={getScoreBadgeColor(tenant.wesScore)}>
                        {tenant.wesScore}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {tenant.blueprint}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(tenant.trend)}
                        <span className={`text-xs font-medium ${getTrendColor(tenant.trend)}`}>
                          {tenant.trend === 'up' ? '+' : tenant.trend === 'down' ? '-' : ''}{Math.abs(tenant.trendValue)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-4">
                      Tenant ID: {tenant.tenantId} • Last updated: {new Date(tenant.lastUpdated).toLocaleDateString()}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Response Time</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {tenant.metrics.responseTime}h
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Resolution Rate</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {tenant.metrics.resolutionRate}%
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Automation</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {tenant.metrics.automationAdoption}%
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Satisfaction</p>
                        <p className="text-sm font-semibold text-purple-600">
                          {tenant.metrics.userSatisfaction}/5.0
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Efficiency</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {tenant.metrics.processEfficiency}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Blueprint: {tenant.blueprint}</span>
                      <span>Trend: {tenant.trend}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Score change: {tenant.trend === 'up' ? '+' : tenant.trend === 'down' ? '-' : ''}{Math.abs(tenant.trendValue)} points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Blueprint Comparison">
        <Card>
          <CardHeader>
            <CardTitle>Average Scores by Blueprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wesAnalytics.blueprintBenchmarks.map((blueprint) => (
                <div key={blueprint.blueprint} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700 capitalize">
                        {blueprint.blueprint.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 capitalize">{blueprint.blueprint}</h4>
                      <p className="text-sm text-slate-500">{blueprint.tenantCount} tenants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Average WES</p>
                      <Badge className={getScoreBadgeColor(blueprint.avgWES)}>
                        {blueprint.avgWES}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Top Performer</p>
                      <p className="text-sm font-semibold text-emerald-600">{blueprint.topPerformer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Need Help</p>
                      <p className="text-sm font-semibold text-red-600">{blueprint.needsImprovement}</p>
                    </div>
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