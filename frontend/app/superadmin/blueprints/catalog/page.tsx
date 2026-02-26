/**
 * Blueprint Catalog - Super Admin
 * 
 * Browse all 10 blueprints (B1-B10) with filtering, search, and analytics.
 * Blueprints define domain-specific workflows by combining modules + roles + permissions.
 */

"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Search,
  Filter,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Grid3x3,
  List,
  ArrowUpRight
} from "lucide-react"
import {
  getBlueprints,
  getBlueprintStatsAsync,
  searchBlueprints,
  type Blueprint,
  type BlueprintCategory,
  type BlueprintStatus
} from "@/shared/services/blueprintService"
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
  Users2: Users,
  Store: Package,
  Building2: Package
}

type ViewMode = "grid" | "list"

export default function BlueprintCatalogPage() {
  const router = useRouter()
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<BlueprintCategory | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<BlueprintStatus | "ALL">("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    const load = async () => {
      try {
        const [blueprintsData, statsData] = await Promise.all([
          getBlueprints(),
          getBlueprintStatsAsync()
        ])
        setBlueprints(blueprintsData)
        setStats(statsData)
      } catch (e) {
        console.error("Failed to load blueprints", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredBlueprints = useMemo(() => {
    let filtered = blueprints

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(bp => bp.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(bp => bp.status === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        bp =>
          bp.name.toLowerCase().includes(query) ||
          bp.description.toLowerCase().includes(query) ||
          bp.id.toLowerCase().includes(query) ||
          bp.usedBy.some(u => u.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [blueprints, categoryFilter, statusFilter, searchQuery])

  const getCategoryBadge = (category: BlueprintCategory) => {
    const map = {
      CORE: "bg-blue-100 text-blue-700 border-blue-200",
      SPECIALIZED: "bg-purple-100 text-purple-700 border-purple-200",
      ADVANCED: "bg-amber-100 text-amber-700 border-amber-200"
    }
    return map[category]
  }

  const getStatusBadge = (status: BlueprintStatus) => {
    const map = {
      ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      BETA: "bg-amber-100 text-amber-700 border-amber-200",
      DEPRECATED: "bg-slate-100 text-slate-600 border-slate-200"
    }
    return map[status]
  }

  const handleViewBlueprint = (id: string) => {
    router.push(`/superadmin/blueprints/${id}`)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Blueprint Catalog"
        description="Browse all 10 blueprints (B1-B10). Blueprints define domain-specific workflows by combining modules, roles, permissions, and dashboards."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Package className="h-3.5 w-3.5 text-blue-500" />
            Blueprint System
          </span>
        }
      />

      {/* Stats */}
      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Package className="h-4 w-4 text-blue-500" />
                Total Blueprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : stats?.total || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.active || 0} active, {stats?.beta || 0} beta
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
                Across all blueprints
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Avg Adoption Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {loading ? "—" : `${stats?.avgAdoptionRate || 0}%`}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Platform-wide average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Active Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {loading ? "—" : stats?.active || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Production-ready blueprints
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
              placeholder="Search blueprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(["ALL", "CORE", "SPECIALIZED", "ADVANCED"] as const).map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={categoryFilter === cat ? "default" : "ghost"}
                  onClick={() => setCategoryFilter(cat)}
                  className="h-7 px-2 text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(["ALL", "ACTIVE", "BETA", "DEPRECATED"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={statusFilter === status ? "default" : "ghost"}
                  onClick={() => setStatusFilter(status)}
                  className="h-7 px-2 text-xs"
                >
                  {status}
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
          Showing {filteredBlueprints.length} of {blueprints.length} blueprints
        </p>
      </PageSection>

      {/* Blueprint Grid/List */}
      <PageSection>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">Loading blueprints...</p>
          </div>
        ) : filteredBlueprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No blueprints found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("ALL")
                setStatusFilter("ALL")
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlueprints.map((blueprint) => {
              const Icon = iconMap[blueprint.icon] || Package
              return (
                <Card
                  key={blueprint.id}
                  className="group cursor-pointer transition-all hover:border-blue-300 hover:shadow-md"
                  onClick={() => handleViewBlueprint(blueprint.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg bg-${blueprint.color}-100 p-2`}>
                          <Icon className={`h-5 w-5 text-${blueprint.color}-600`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-600">
                              {blueprint.id}
                            </span>
                            <Badge className={getCategoryBadge(blueprint.category)}>
                              {blueprint.category}
                            </Badge>
                          </div>
                          <CardTitle className="mt-1 text-base">{blueprint.name}</CardTitle>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {blueprint.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {blueprint.tenantCount}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Adoption</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {blueprint.adoptionRate}%
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusBadge(blueprint.status)}>
                        {blueprint.status}
                      </Badge>
                      <span className="text-xs text-slate-400">v{blueprint.version}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlueprints.map((blueprint) => {
              const Icon = iconMap[blueprint.icon] || Package
              return (
                <Card
                  key={blueprint.id}
                  className="group cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm"
                  onClick={() => handleViewBlueprint(blueprint.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`rounded-lg bg-${blueprint.color}-100 p-3`}>
                      <Icon className={`h-6 w-6 text-${blueprint.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {blueprint.id}
                        </span>
                        <h3 className="font-semibold text-slate-900">{blueprint.name}</h3>
                        <Badge className={getCategoryBadge(blueprint.category)}>
                          {blueprint.category}
                        </Badge>
                        <Badge className={getStatusBadge(blueprint.status)}>
                          {blueprint.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                        {blueprint.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{blueprint.tenantCount}</p>
                        <p className="text-xs text-slate-500">Tenants</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{blueprint.adoptionRate}%</p>
                        <p className="text-xs text-slate-500">Adoption</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">v{blueprint.version}</p>
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
