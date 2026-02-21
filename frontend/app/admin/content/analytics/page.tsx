"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getContentPosts } from "@/shared/services/showcaseService"
import type { ContentPost } from "@/shared/lib/types/showcase"
import { BarChart3, Eye, MousePointer } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function ContentAnalyticsPage() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContentPosts(DEMO_TENANT).then((data) => {
      setPosts(data.filter((p) => p.status === "LIVE"))
      setLoading(false)
    })
  }, [])

  const totalViews = posts.reduce((s, p) => s + (p.analytics?.views ?? 0), 0)
  const totalClicks = posts.reduce((s, p) => s + (p.analytics?.clicks ?? 0), 0)
  const totalApplications = posts.reduce((s, p) => s + (p.analytics?.applications ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Back</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Content analytics</h1>
            <p className="mt-2 text-base text-white/60">Performance, engagement.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total</p>
                  <p className="mt-1 text-sm text-white/60">Views</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Eye className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-400">{totalViews.toLocaleString()}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total</p>
                  <p className="mt-1 text-sm text-white/60">Clicks</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <MousePointer className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Total</p>
                  <p className="mt-1 text-sm text-white/60">Applications</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{totalApplications.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Top Content */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Top content</h3>
            <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Export</Button>
          </div>
          {loading ? (
            <p className="py-8 text-center text-white/60">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="py-8 text-center text-white/60">No content yet.</p>
          ) : (
            <div className="space-y-3">
              {posts
                .sort((a, b) => (b.analytics?.views ?? 0) - (a.analytics?.views ?? 0))
                .map((post) => (
                  <div key={post._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                    <div>
                      <p className="font-medium text-white">{post.title}</p>
                      <p className="text-xs text-white/50">{post.type}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="text-white/60">{post.analytics?.views?.toLocaleString() ?? 0} views</span>
                      <span className="text-white/60">{post.analytics?.applications ?? 0} applications</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
