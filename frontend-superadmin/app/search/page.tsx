/**
 * Search Results Page
 * 
 * Displays search results across all entity types with filters.
 * Supports URL-based filter state for shareable links.
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { FilterPanel } from "@/shared/components/ui/filter-panel"
import type { SearchEntityType } from "@/shared/components/search/GlobalSearchBar"
import { getPageants } from "@/shared/services/pageantService"
import { getTenants } from "@/shared/services/tenantService"
import { getContentPosts } from "@/shared/services/showcaseService"

interface SearchResult {
  id: string
  type: SearchEntityType
  title: string
  subtitle?: string
  description?: string
  url: string
  metadata?: Record<string, any>
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [entityType, setEntityType] = useState<SearchEntityType>(
    (searchParams.get("type") as SearchEntityType) || "ALL"
  )
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (entityType && entityType !== "ALL") params.set("type", entityType)
    if (statusFilter.length > 0) params.set("status", statusFilter.join(","))
    if (dateRange.start) params.set("start", dateRange.start.toISOString())
    if (dateRange.end) params.set("end", dateRange.end.toISOString())

    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [query, entityType, statusFilter, dateRange, router])

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const performSearch = async () => {
      const searchResults: SearchResult[] = []

      try {
        if (entityType === "ALL" || entityType === "PAGEANT") {
          const pageants = await getPageants()
          const filtered = pageants.filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.description?.toLowerCase().includes(query.toLowerCase())
          )
          filtered.forEach((p) => {
            searchResults.push({
              id: p._id,
              type: "PAGEANT",
              title: p.name,
              subtitle: `Tenant: ${p.tenantId}`,
              description: p.description,
              url: `/pageants`,
              metadata: { status: p.status },
            })
          })
        }

        if (entityType === "ALL" || entityType === "TENANT") {
          const tenants = await getTenants()
          const filtered = tenants.filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              t.email?.toLowerCase().includes(query.toLowerCase()) ||
              t.type?.toLowerCase().includes(query.toLowerCase())
          )
          filtered.forEach((t) => {
            searchResults.push({
              id: t._id,
              type: "TENANT",
              title: t.name,
              subtitle: `${t.type} · ${t.email}`,
              description: t.description,
              url: `/tenants/${t._id}`,
              metadata: { status: t.status, type: t.type },
            })
          })
        }

        if (entityType === "ALL" || entityType === "CONTENT") {
          const contentPosts = await getContentPosts()
          const filtered = contentPosts.filter(
            (c: any) =>
              c.title?.toLowerCase().includes(query.toLowerCase()) ||
              c.description?.toLowerCase().includes(query.toLowerCase()) ||
              c.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
          )
          filtered.forEach((c: any) => {
            searchResults.push({
              id: c._id,
              type: "CONTENT",
              title: c.title || "Untitled Post",
              subtitle: `Tenant: ${c.tenantId} · ${c.type}`,
              description: c.description,
              url: `/talent-showcase`,
              metadata: { status: c.status, type: c.type },
            })
          })
        }
      } catch (error) {
        console.error("Search error:", error)
      }

      // Apply additional filters
      let filtered = searchResults
      if (statusFilter.length > 0) {
        filtered = filtered.filter((r) => {
          const status = r.metadata?.status
          return status && statusFilter.includes(status)
        })
      }

      setResults(filtered)
      setIsLoading(false)
    }

    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [query, entityType, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is triggered by useEffect when query changes
  }

  const entityTypeOptions = [
    { value: "ALL", label: "All Types" },
    { value: "PAGEANT", label: "Pageants" },
    { value: "TENANT", label: "Tenants" },
    { value: "CONTENT", label: "Content Posts" },
  ]

  const statusOptions = useMemo(() => {
    const statuses = new Set<string>()
    results.forEach((r) => {
      if (r.metadata?.status) {
        statuses.add(r.metadata.status)
      }
    })
    return Array.from(statuses).map((s) => ({ value: s, label: s }))
  }, [results])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Search Results</h1>
            <p className="text-sm text-slate-500 mt-1">
              {results.length} result{results.length !== 1 ? "s" : ""} found
              {query && ` for "${query}"`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-slate-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search pageants, events, talents, campaigns, brands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 bg-white border-slate-200"
                />
              </div>
              <Select
                value={entityType}
                onValueChange={(value) => setEntityType(value as SearchEntityType)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        {showFilters && (
          <FilterPanel
            searchPlaceholder="Filter results..."
            searchValue=""
            onSearchChange={() => {}}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            multiSelectFilters={
              statusOptions.length > 0
                ? [
                    {
                      key: "status",
                      label: "Status",
                      options: statusOptions,
                      selected: statusFilter,
                      onSelectionChange: setStatusFilter,
                    },
                  ]
                : []
            }
            onClearAll={() => {
              setStatusFilter([])
              setDateRange({ start: null, end: null })
            }}
          />
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Searching...</div>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No results found
              </h3>
              <p className="text-sm text-slate-500">
                Try adjusting your search query or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                className="hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => router.push(result.url)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {result.title}
                    </CardTitle>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {result.type}
                    </span>
                  </div>
                  {result.subtitle && (
                    <p className="text-xs text-slate-500 mt-1">{result.subtitle}</p>
                  )}
                </CardHeader>
                {result.description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {result.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
