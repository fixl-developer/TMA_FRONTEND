/**
 * Talent Showcase Dashboard - Super Admin
 *
 * Cinematic dashboard summarising showcase content across tenants.
 * Seed-only and read-only for this phase.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { Film, ImageIcon, Sparkles, CheckCircle2, XCircle, Eye, Trash2 } from "lucide-react"
import { getContentPosts } from "@/shared/services/showcaseService"
import type { ContentPost, ContentStatus } from "@/shared/lib/types/showcase"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetCloseButton,
} from "@/shared/components/ui/sheet"
import { FilterPanel, type FilterOption as FilterOptionType } from "@/shared/components/ui/filter-panel"
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog"
import { useToast } from "@/shared/components/ui/toast"

const statusLabels: Record<ContentStatus, string> = {
  PENDING: "Pending approval",
  LIVE: "Live",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
}

const statusBadgeClasses: Record<ContentStatus, string> = {
  PENDING: "bg-[#fff4ce] text-[#797673] border border-[#797673]",
  LIVE: "bg-[#dff6dd] text-[#107c10] border border-[#107c10]",
  EXPIRED: "bg-[#f3f2f1] text-[#605e5c] border border-[#605e5c]",
  REJECTED: "bg-[#fde7e9] text-[#a80000] border border-[#a80000]",
}

type FilterOption = "ALL" | ContentStatus

export default function TalentShowcaseDashboard() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterOption>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<ContentPost[]>([])
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContentPosts()
        setPosts(data)
      } catch (e) {
        console.error("Failed to load content posts", e)
        showToast("Failed to load showcase posts", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showToast])

  const metrics = useMemo(() => {
    const total = posts.length
    const live = posts.filter((p) => p.status === "LIVE").length
    const pending = posts.filter((p) => p.status === "PENDING").length
    const tenantsWithContent = new Set(posts.map((p) => p.tenantId)).size
    const videos = posts.filter((p) => p.type === "VIDEO").length
    const images = posts.filter((p) => p.type === "IMAGE").length

    const totalViews = posts.reduce(
      (sum, p) => sum + (p.analytics?.views ?? 0),
      0
    )
    const totalApplications = posts.reduce(
      (sum, p) => sum + (p.analytics?.applications ?? 0),
      0
    )

    return {
      total,
      live,
      pending,
      tenantsWithContent,
      videos,
      images,
      totalViews,
      totalApplications,
    }
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Status filter
    if (filter !== "ALL") {
      filtered = filtered.filter((p) => p.status === filter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tenantId.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Type filter
    if (typeFilter.length > 0) {
      filtered = filtered.filter((p) => typeFilter.includes(p.type))
    }

    return filtered
  }, [posts, filter, searchQuery, typeFilter])

  const typeOptions: FilterOptionType[] = [
    { value: "VIDEO", label: "Video" },
    { value: "IMAGE", label: "Image" },
  ]

  const handlePreview = (post: ContentPost) => {
    setSelectedPost(post)
    setPreviewOpen(true)
  }

  const handleApprove = (post: ContentPost) => {
    setSelectedPost(post)
    setConfirmApproveOpen(true)
  }

  const handleReject = (post: ContentPost) => {
    setSelectedPost(post)
    setConfirmRejectOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return
    setConfirmDeleteOpen(true)
  }

  const confirmApprove = () => {
    if (!selectedPost) return
    showToast(
      `Approved post: ${selectedPost.title} (UI-only, no backend yet)`,
      "success"
    )
    setConfirmApproveOpen(false)
    setSelectedPost(null)
  }

  const confirmReject = () => {
    if (!selectedPost) return
    showToast(
      `Rejected post: ${selectedPost.title} (UI-only, no backend yet)`,
      "info"
    )
    setConfirmRejectOpen(false)
    setSelectedPost(null)
  }

  const confirmBulkDelete = () => {
    showToast(
      `Bulk delete for ${selectedRows.length} posts (UI-only, no backend yet)`,
      "info"
    )
    setSelectedRows([])
    setConfirmDeleteOpen(false)
  }

  return (
    <PageLayout>
      <PageHeader
        title="Talent Showcase"
        description="Monitor showcase content across tenants. Powered by seed data for this phase."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Sparkles className="h-3.5 w-3.5 text-[#d13438]" />
            Content and Events
          </span>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Total showcase posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Across all tenants in this environment.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Live</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.live}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Currently visible in tenant-facing showcases.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.pending}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Awaiting tenant & platform moderation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tenants with content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.tenantsWithContent}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Tenants who have at least one showcase post.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Format and analytics">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Format mix</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4 text-xs text-[#323130]">
              <div className="flex flex-1 items-center gap-2 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f3f2f1]">
                  <Film className="h-4 w-4 text-[#0078d4]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#323130]">
                    Video posts
                  </p>
                  <p className="text-xs text-[#605e5c]">
                    {loading ? "—" : metrics.videos}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f3f2f1]">
                  <ImageIcon className="h-4 w-4 text-[#d13438]" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#323130]">
                    Image posts
                  </p>
                  <p className="text-xs text-[#605e5c]">
                    {loading ? "—" : metrics.images}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attention and demand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-[#323130]">
              <p>
                Estimated views:{" "}
                <span className="font-semibold text-[#0078d4]">
                  {loading ? "—" : metrics.totalViews.toLocaleString("en-IN")}
                </span>
              </p>
              <p>
                Applications driven:{" "}
                <span className="font-semibold text-[#107c10]">
                  {loading
                    ? "—"
                    : metrics.totalApplications.toLocaleString("en-IN")}
                </span>
              </p>
              <p className="text-[11px] text-[#605e5c]">
                All numbers are mocked from seed analytics; in production this
                panel would be powered by ContentAnalytics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Filter by status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-xs">
              {([
                { key: "ALL", label: "All" },
                { key: "LIVE", label: "Live" },
                { key: "PENDING", label: "Pending" },
                { key: "REJECTED", label: "Rejected" },
                { key: "EXPIRED", label: "Expired" },
              ] as { key: FilterOption; label: string }[]).map((opt) => (
                <Button
                  key={opt.key}
                  size="sm"
                  variant={filter === opt.key ? "default" : "outline"}
                  className={
                    filter === opt.key
                      ? "h-8 px-3 text-xs"
                      : "h-8 px-3 text-xs bg-[#faf9f8]"
                  }
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageSection>
      <PageSection
        title="Showcase posts"
        description={filteredPosts.length !== posts.length ? filteredPosts.length + " of " + posts.length + " shown" : undefined}
      >
        <div className="space-y-3">
        <FilterPanel
            searchPlaceholder="Search posts by title, description, tags, or tenant..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              {
                key: "type",
                label: "Content Type",
                options: typeOptions,
                selected: typeFilter,
                onSelectionChange: setTypeFilter,
              },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setTypeFilter([])
            }}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="h-8 px-3 text-xs bg-[#fde7e9] border-[#a80000] text-[#a80000] hover:bg-[#f4c3c7]"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete ({selectedRows.length})
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-14 text-[#605e5c]">
              <span className="text-sm">Loading showcase posts from seed…</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center text-[#605e5c]">
              <p className="text-sm font-medium">
                No posts match this filter in the current seed.
              </p>
              <p className="max-w-md text-xs text-[#605e5c]">
                Update{" "}
                <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]">
                  data/seed/contentPosts.json
                </code>{" "}
                to simulate different showcase patterns.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredPosts.map((post) => (
                  <article
                    key={post._id}
                    className="group relative overflow-hidden rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors"
                  >
                    <div className="relative flex h-full flex-col px-4 py-3 sm:px-5 sm:py-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-semibold text-[#323130] sm:text-[15px]">
                            {post.title}
                          </h3>
                          <p className="text-xs text-[#605e5c]">
                            Tenant{" "}
                            <span className="font-mono text-[#323130]">
                              {post.tenantId}
                            </span>{" "}
                            · Owner {post.ownerType.toLowerCase()}{" "}
                            <span className="font-mono text-[#323130]">
                              {post.ownerId}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClasses[post.status]}`}
                        >
                          {statusLabels[post.status]}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center gap-2 text-[10px] text-[#605e5c]">
                        <span className="inline-flex items-center gap-1 rounded bg-[#f3f2f1] px-2 py-0.5">
                          {post.type === "VIDEO" ? (
                            <Film className="h-3 w-3 text-[#0078d4]" />
                          ) : (
                            <ImageIcon className="h-3 w-3 text-[#d13438]" />
                          )}
                          <span className="uppercase tracking-wide">
                            {post.type.toLowerCase()}
                          </span>
                        </span>
                        {post.linkedPageantId && (
                          <span className="rounded bg-[#f3f2f1] px-2 py-0.5">
                            Linked pageant:{" "}
                            <span className="font-mono text-[#323130]">
                              {post.linkedPageantId}
                            </span>
                          </span>
                        )}
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5 text-[10px] text-[#323130]">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-[#f3f2f1] px-2 py-0.5"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {post.analytics && (
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#edebe9] pt-2 text-[10px] text-[#605e5c]">
                          <div className="flex flex-wrap gap-3">
                            <span>
                              Views:{" "}
                              <span className="font-semibold text-[#0078d4]">
                                {post.analytics.views.toLocaleString("en-IN")}
                              </span>
                            </span>
                            <span>
                              Applications:{" "}
                              <span className="font-semibold text-[#107c10]">
                                {post.analytics.applications.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </span>
                          </div>
                          <span className="text-[#323130]">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Unknown date"}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2 border-t border-[#edebe9] pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePreview(post)}
                          className="h-7 px-2 text-[10px] text-[#0078d4] hover:bg-[#f3f2f1] flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1.5" />
                          Preview
                        </Button>
                        {post.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(post)}
                              className="h-7 px-2 text-[10px] text-[#107c10] hover:bg-[#f3f2f1]"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(post)}
                              className="h-7 px-2 text-[10px] text-[#a80000] hover:bg-[#f3f2f1]"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </div>
      </PageSection>

      {/* Content preview side panel */}
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" size="full" className="flex flex-col p-0">
          {selectedPost && (
            <>
              <SheetHeader className="relative pr-12">
                <SheetCloseButton />
                <SheetTitle>{selectedPost.title}</SheetTitle>
                <SheetDescription>
                  Content preview and analytics for this showcase post.
                </SheetDescription>
              </SheetHeader>

              <SheetBody className="space-y-4 text-sm text-[#323130]">
                  {/* Content Preview */}
                  <div className="rounded border border-[#edebe9] bg-[#faf9f8] p-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]">
                      Content Preview
                    </p>
                    {selectedPost.type === "VIDEO" ? (
                      <div className="flex h-64 items-center justify-center rounded bg-[#f3f2f1] border border-[#edebe9]">
                        <div className="text-center">
                          <Film className="mx-auto h-12 w-12 text-[#323130]" />
                          <p className="mt-2 text-sm text-[#605e5c]">
                            Video preview (seed data only)
                          </p>
                          <p className="mt-1 text-xs text-[#323130]">
                            In production, this would show the actual video player
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center rounded bg-[#f3f2f1] border border-[#edebe9]">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-[#323130]" />
                          <p className="mt-2 text-sm text-[#605e5c]">
                            Image preview (seed data only)
                          </p>
                          <p className="mt-1 text-xs text-[#323130]">
                            In production, this would show the actual image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]">
                        Post Info
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-[#323130]">
                        <p>
                          <span className="text-[#605e5c]">Tenant:</span>{" "}
                          <span className="font-mono">{selectedPost.tenantId}</span>
                        </p>
                        <p>
                          <span className="text-[#605e5c]">Owner:</span>{" "}
                          {selectedPost.ownerType} ({selectedPost.ownerId})
                        </p>
                        <p>
                          <span className="text-[#605e5c]">Type:</span>{" "}
                          {selectedPost.type}
                        </p>
                        {selectedPost.linkedPageantId && (
                          <p>
                            <span className="text-[#605e5c]">Linked Pageant:</span>{" "}
                            <span className="font-mono">{selectedPost.linkedPageantId}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]">
                        Analytics
                      </p>
                      {selectedPost.analytics ? (
                        <div className="mt-2 space-y-2 text-sm text-[#323130]">
                          <div>
                            <span className="text-[#605e5c]">Views:</span>{" "}
                            <span className="font-semibold text-[#0078d4]">
                              {selectedPost.analytics.views.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#605e5c]">Applications:</span>{" "}
                            <span className="font-semibold text-[#107c10]">
                              {selectedPost.analytics.applications.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-[#605e5c]">
                          No analytics data available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description & Tags */}
                  {selectedPost.description && (
                    <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]">
                        Description
                      </p>
                      <p className="mt-1 text-sm text-[#323130]">
                        {selectedPost.description}
                      </p>
                    </div>
                  )}

                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#605e5c]">
                        Tags
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[#f3f2f1] px-2 py-1 text-[10px] text-[#323130]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

        {/* Approve Confirmation */}
        <ConfirmDialog
          open={confirmApproveOpen}
          onOpenChange={setConfirmApproveOpen}
          title="Approve this post?"
          description={`This will approve "${selectedPost?.title}" and make it live in the showcase. (UI-only for now)`}
          confirmText="Approve"
          cancelText="Cancel"
          variant="default"
          onConfirm={confirmApprove}
        />

        {/* Reject Confirmation */}
        <ConfirmDialog
          open={confirmRejectOpen}
          onOpenChange={setConfirmRejectOpen}
          title="Reject this post?"
          description={`This will reject "${selectedPost?.title}" and remove it from the showcase. (UI-only for now)`}
          confirmText="Reject"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmReject}
        />

        {/* Bulk Delete Confirmation */}
        <ConfirmDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          title="Delete selected posts?"
          description={`This will delete ${selectedRows.length} post(s). This action cannot be undone. (UI-only for now)`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmBulkDelete}
        />
    </PageLayout>
  )
}

