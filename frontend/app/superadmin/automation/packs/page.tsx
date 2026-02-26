"use client"

import { useState, useEffect } from "react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { 
  Search, Grid, List, Filter, Download, Settings, 
  Shield, DollarSign, FileText, Lock, AlertTriangle,
  Users, Package, Truck
} from "lucide-react"
import { 
  getAutomationPacks, 
  getAutomationPackStatsAsync,
  searchAutomationPacks,
  type AutomationPack 
} from "@/shared/services/automationService"
import Link from "next/link"

const iconMap: Record<string, any> = {
  Settings,
  Shield,
  DollarSign,
  FileText,
  Lock,
  AlertTriangle,
  Users,
  Package,
  Truck
}

export default function AutomationPacksPage() {
  const [packs, setPacks] = useState<AutomationPack[]>([])
  const [filteredPacks, setFilteredPacks] = useState<AutomationPack[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPacks()
  }, [packs, searchQuery, statusFilter, categoryFilter])

  async function loadData() {
    setLoading(true)
    const [packsData, statsData] = await Promise.all([
      getAutomationPacks(),
      getAutomationPackStatsAsync()
    ])
    setPacks(packsData)
    setStats(statsData)
    setLoading(false)
  }

  async function filterPacks() {
    let filtered = packs

    // Search filter
    if (searchQuery) {
      const results = await searchAutomationPacks(searchQuery)
      filtered = results
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter)
    }

    setFilteredPacks(filtered)
  }

  const categories = Array.from(new Set(packs.map(p => p.category)))

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading automation packs...</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        title="Automation Packs"
        description="Pre-built automation rule collections for common agency workflows"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {stats && (
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Packs</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Packs</div>
              <div className="text-2xl font-bold mt-1 text-green-600">{stats.active}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Rules</div>
              <div className="text-2xl font-bold mt-1">{stats.totalRules}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Installs</div>
              <div className="text-2xl font-bold mt-1">{stats.totalInstalls}</div>
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
                  placeholder="Search packs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BETA">Beta</option>
              </select>
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
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </PageSection>

      {/* Packs Grid/List */}
      <PageSection>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPacks.map(pack => {
              const Icon = iconMap[pack.icon] || Settings
              return (
                <Link key={pack.id} href={`/superadmin/automation/packs/${pack.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${pack.color}-100`}>
                        <Icon className={`h-6 w-6 text-${pack.color}-600`} />
                      </div>
                      <Badge variant={pack.status === "ACTIVE" ? "default" : "secondary"}>
                        {pack.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {pack.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-semibold">{pack.rules.length}</span>
                          <span className="text-muted-foreground ml-1">rules</span>
                        </div>
                        <div>
                          <span className="font-semibold">{pack.installCount}</span>
                          <span className="text-muted-foreground ml-1">installs</span>
                        </div>
                      </div>
                      <Badge variant="outline">{pack.category}</Badge>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card>
            <div className="divide-y">
              {filteredPacks.map(pack => {
                const Icon = iconMap[pack.icon] || Settings
                return (
                  <Link key={pack.id} href={`/superadmin/automation/packs/${pack.id}`}>
                    <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-${pack.color}-100`}>
                          <Icon className={`h-5 w-5 text-${pack.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{pack.name}</h3>
                            <Badge variant={pack.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                              {pack.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{pack.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{pack.description}</p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{pack.rules.length}</div>
                            <div className="text-xs text-muted-foreground">Rules</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{pack.installCount}</div>
                            <div className="text-xs text-muted-foreground">Installs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">v{pack.version}</div>
                            <div className="text-xs text-muted-foreground">Version</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>
        )}

        {filteredPacks.length === 0 && (
          <Card className="p-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No packs found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </PageSection>
    </PageLayout>
  )
}
