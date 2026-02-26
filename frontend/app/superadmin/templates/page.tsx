/**
 * Template Catalog - Super Admin
 * 
 * Browse all 8 tenant templates (T1-T8) with filtering, search, and analytics.
 * Templates are ready-to-use tenant provisioning bundles.
 */

"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Search,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Grid3x3,
  List,
  ArrowUpRight,
  Layers
} from "lucide-react"
import {
  getTemplates,
  getTemplateStatsAsync,
  searchTemplates,
  type Template,
  type TemplateComplexity
} from "@/shared/services/templateService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"

// Icon mapping
const iconMap: Record<string, any> = {
  Users: Users,
  Video: Package,
  Trophy: Package,
  Megaphone: Package,
  GraduationCap: Package,
  Film: Package,
  Calendar: Package,
  Users2: Users
}

type ViewMode = "grid" | "list"

export default function TemplateCatalogPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [complexityFilter, setComplexityFilter] = useState<TemplateComplexity | "ALL">("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    const load = async () => {
      try {
        const [templatesData, statsData] = await Promise.all([
          getTemplates(),
          getTemplateStatsAsync()
        ])
        setTemplates(templatesData)
        setStats(statsData)
      } catch (e) {
        console.error("Failed to load templates", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Complexity filter
    if (complexityFilter !== "ALL") {
      filtered = filtered.filter(t => t.complexity === complexityFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query) ||
          t.usedBy.some(u => u.toLowerCase().includes(query)) ||
          t.features.some(f => f.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [templates, complexityFilter, searchQuery])

  const getComplexityBadge = (complexity: TemplateComplexity) => {
    const map = {
      SIMPLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      MODERATE: "bg-blue-100 text-blue-700 border-blue-200",
      COMPLEX: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[complexity]
  }

  const handleViewTemplate = (id: string) => {
    router.push(`/superadmin/templates/${id}`)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Template Catalog"
        description="Browse all 8 tenant templates (T1-T8). Templates are ready-to-use provisioning bundles with blueprints, roles, workflows, and dashboards."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            Template System
          </span>
        }
        actions={
          <Button onClick={() => router.push("/superadmin/templates/compare")}>
            Compare Templates
          </Button>
        }
      />

      {/* Stats */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Layers className="h-4 w-4 text-purple-500" />
                Total Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.total || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.simple || 0} simple, {stats?.moderate || 0} moderate, {stats?.complex || 0} complex
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-emerald-500" />
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.totalTenants || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Across all templates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Avg Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : `${stats?.avgSuccessRate || 0}%`}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tenant satisfaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Quick Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {loading ? "—" : "3-7d"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Average setup time
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Filters */}
      <PageSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* Complexity Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(["ALL", "SIMPLE", "MODERATE", "COMPLEX"] as const).map((complexity) => (
                <Button
                  key={complexity}
                  size="sm"
                  variant={complexityFilter === complexity ? "default" : "ghost"}
                  onClick={() => setComplexityFilter(complexity)}
                  className="h-7 px-2 text-xs"
                >
                  {complexity}
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-7 w-7 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-slate-500">
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
      </PageSection>

      {/* Template Grid/List */}
      <PageSection>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No templates found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setComplexityFilter("ALL")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => {
              const Icon = iconMap[template.icon] || Package
              return (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:border-purple-300 hover:shadow-md"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg bg-${template.color}-100 p-2`}>
                          <Icon className={`h-5 w-5 text-${template.color}-600`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-600">
                              {template.id}
                            </span>
                            <Badge className={getComplexityBadge(template.complexity)}>
                              {template.complexity}
                            </Badge>
                          </div>
                          <CardTitle className="mt-1 text-base">{template.name}</CardTitle>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Blueprints */}
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Blueprints</p>
                      <div className="flex flex-wrap gap-1">
                        {template.blueprints.map((bp) => (
                          <Badge key={bp} variant="outline" className="text-xs">
                            {bp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {template.tenantCount}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="text-xs text-slate-500">Success</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {template.successRate}%
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <p className="text-xs text-slate-500">Setup</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {template.setupTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const Icon = iconMap[template.icon] || Package
              return (
                <Card
                  key={template.id}
                  className="group cursor-pointer transition-all hover:border-purple-300 hover:shadow-sm"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`rounded-lg bg-${template.color}-100 p-3`}>
                      <Icon className={`h-6 w-6 text-${template.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {template.id}
                        </span>
                        <h3 className="font-semibold text-slate-900">{template.name}</h3>
                        <Badge className={getComplexityBadge(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        <div className="flex gap-1">
                          {template.blueprints.map((bp) => (
                            <Badge key={bp} variant="outline" className="text-xs">
                              {bp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{template.tenantCount}</p>
                        <p className="text-xs text-slate-500">Tenants</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{template.successRate}%</p>
                        <p className="text-xs text-slate-500">Success</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600">{template.setupTime}</p>
                        <p className="text-xs text-slate-500">Setup</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
