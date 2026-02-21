"use client"

import { useEffect, useMemo, useState } from "react"
import { Image, Video, Eye, MousePointer, TrendingUp, Filter, Search } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import seedPosts from "@/data/seed/contentPosts.json"

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger"> = {
  LIVE: "success",
  PENDING: "warning",
  REJECTED: "danger",
  DRAFT: "default",
  ARCHIVED: "default",
}

const TYPE_ICON: Record<string, any> = {
  VIDEO: Video,
  IMAGE: Image,
}

export default function ContentShowcasePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  useEffect(() => {
    setPosts(seedPosts as any[])
  }, [])

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false
      if (typeFilter !== "ALL" && p.type !== typeFilter) return false
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.tags?.join(" ").includes(search.toLowerCase())) return false
      return true
    })
  }, [posts, search, statusFilter, typeFilter])

  const stats = useMemo(() => ({
    total: posts.length,
    live: posts.filter((p) => p.status === "LIVE").length,
    totalViews: posts.reduce((s, p) => s + (p.analytics?.views || 0), 0),
    totalClicks: posts.reduce((s, p) => s + (p.analytics?.clicks || 0), 0),
  }), [posts])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Content Showcase"
        subtitle="View, filter, and manage talent content across all types"
        action={
          <div className="flex gap-2">
            <AdminButton variant={viewMode === "grid" ? "secondary" : "ghost"} onClick={() => setViewMode("grid")}>Grid</AdminButton>
            <AdminButton variant={viewMode === "table" ? "secondary" : "ghost"} onClick={() => setViewMode("table")}>Table</AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Content" value={stats.total} icon={Image} />
        <AdminStatCard title="Live" value={stats.live} icon={TrendingUp} />
        <AdminStatCard title="Total Views" value={stats.totalViews.toLocaleString()} icon={Eye} />
        <AdminStatCard title="Total Clicks" value={stats.totalClicks.toLocaleString()} icon={MousePointer} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {["LIVE", "PENDING", "REJECTED", "DRAFT", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          {["VIDEO", "IMAGE", "AUDIO", "DOCUMENT"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState title="No content found" description="No content matches your current filters." />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => {
            const Icon = TYPE_ICON[post.type] || Image
            return (
              <AdminCard key={post._id}>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <AdminBadge variant={STATUS_VARIANT[post.status] || "default"}>{post.status}</AdminBadge>
                </div>
                <h3 className="mt-3 font-semibold text-white line-clamp-2">{post.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags?.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">#{tag}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(post.analytics?.views || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{(post.analytics?.clicks || 0).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-xs text-white/30">{new Date(post.createdAt).toLocaleDateString()}</p>
              </AdminCard>
            )
          })}
        </div>
      ) : (
        <AdminCard>
          <AdminTable headers={["Title", "Type", "Status", "Views", "Clicks", "Owner", "Date"]}>
            {filtered.map((post) => (
              <AdminTableRow key={post._id}>
                <td className="py-3 pr-4 font-medium text-white max-w-48 truncate">{post.title}</td>
                <td className="py-3 pr-4 text-sm text-white/60">{post.type}</td>
                <td className="py-3 pr-4"><AdminBadge variant={STATUS_VARIANT[post.status] || "default"}>{post.status}</AdminBadge></td>
                <td className="py-3 pr-4 text-sm text-white/70">{(post.analytics?.views || 0).toLocaleString()}</td>
                <td className="py-3 pr-4 text-sm text-white/70">{(post.analytics?.clicks || 0).toLocaleString()}</td>
                <td className="py-3 pr-4 text-sm text-white/50">{post.ownerId}</td>
                <td className="py-3 pr-4 text-sm text-white/40">{new Date(post.createdAt).toLocaleDateString()}</td>
              </AdminTableRow>
            ))}
          </AdminTable>
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
