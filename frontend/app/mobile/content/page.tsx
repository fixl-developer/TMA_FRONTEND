"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ImageIcon, ChevronLeft, Video, Star, Eye, Filter } from "lucide-react"
import { useTenant } from "@/shared/context/TenantContext"
import seedPosts from "@/data/seed/contentPosts.json"

const STATUS_COLOR: Record<string, string> = {
  LIVE: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
}

export default function MobileContentPage() {
  const { tenantId } = useTenant()
  const [filter, setFilter] = useState("ALL")
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const tid = tenantId || "tenant_001"
    setPosts((seedPosts as any[]).filter((p) => p.tenantId === tid || true).slice(0, 10))
  }, [tenantId])

  const filtered = useMemo(() =>
    filter === "ALL" ? posts : posts.filter((p) => p.status === filter),
    [posts, filter]
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/mobile">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
        </Link>
        <h1 className="text-lg font-bold text-slate-800">My Content</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: posts.length, icon: ImageIcon },
            { label: "Live", value: posts.filter((p) => p.status === "LIVE").length, icon: Eye },
            { label: "Pending", value: posts.filter((p) => p.status === "PENDING").length, icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white border border-slate-200 p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["ALL", "LIVE", "PENDING", "DRAFT", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === s ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <ImageIcon className="h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">No content found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div key={post._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    post.type === "VIDEO" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {post.type === "VIDEO" ? <Video className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-slate-800">{post.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[post.status] || "bg-slate-100 text-slate-600"}`}>
                        {post.status}
                      </span>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs text-slate-400">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {post.analytics?.views > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                        <Eye className="h-3.5 w-3.5" />{post.analytics.views.toLocaleString()} views
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
