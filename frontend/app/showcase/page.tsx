"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getContentPosts } from "@/shared/services/showcaseService"
import type { ContentPost } from "@/shared/lib/types/showcase"
import { Film, ImageIcon, Heart, MessageCircle } from "lucide-react"

export default function ShowcaseFeedPage() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "VIDEO" | "IMAGE">("ALL")

  useEffect(() => {
    getContentPosts().then((data) => {
      setPosts(data.filter((p) => p.status === "LIVE"))
      setLoading(false)
    })
  }, [])

  const filtered = filter === "ALL" ? posts : posts.filter((p) => p.type === filter)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative h-12 w-32 shrink-0">
            <Image src="/images/mta-logo.png" alt="Multi Talent Agency" fill className="object-contain object-left" />
          </div>
          <div className="relative h-9 w-40 shrink-0">
            <Image src="/images/indias-first-platform.png" alt="India's First Platform" fill className="object-contain object-left" />
          </div>
        </div>
        <div>
        <h1 className="text-2xl font-bold text-white">Talent Showcase</h1>
        <p className="mt-1 text-slate-400">Discover talent content from pageants and campaigns</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {(["ALL", "VIDEO", "IMAGE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {f === "ALL" ? "All" : f === "VIDEO" ? "Video" : "Image"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-slate-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No content yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => (
            <Link key={post._id} href={`/showcase/${post._id}`}>
              <article className="group overflow-hidden rounded-xl border border-slate-700/80 bg-slate-800/50 transition-all hover:border-slate-600">
                <div className="aspect-[4/5] flex items-center justify-center bg-slate-900">
                  {post.type === "VIDEO" ? (
                    <Film className="h-16 w-16 text-slate-600 group-hover:text-slate-500" />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-slate-600 group-hover:text-slate-500" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white line-clamp-1">{post.title}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {post.analytics?.views?.toLocaleString() ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> —
                    </span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded bg-slate-700 px-1.5 py-0.5 text-xs text-slate-300">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
