"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getContentPostById } from "@/shared/services/showcaseService"
import type { ContentPost } from "@/shared/lib/types/showcase"
import { Film, ImageIcon, Heart, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export default function ShowcaseDetailPage() {
  const params = useParams()
  const postId = params.postId as string
  const [post, setPost] = useState<ContentPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContentPostById(postId).then((data) => {
      setPost(data)
      setLoading(false)
    })
  }, [postId])

  if (loading || !post) {
    return <p className="py-12 text-center text-slate-400">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/showcase">
        <Button variant="ghost" size="sm" className="mb-6 text-slate-400 hover:text-white">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to feed
        </Button>
      </Link>

      <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/50">
        <div className="aspect-video flex items-center justify-center bg-slate-900">
          {post.type === "VIDEO" ? (
            <Film className="h-24 w-24 text-slate-600" />
          ) : (
            <ImageIcon className="h-24 w-24 text-slate-600" />
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">{post.title}</h1>
          {post.description && <p className="mt-2 text-slate-400">{post.description}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2 text-slate-400">
              <Heart className="h-4 w-4" /> {post.analytics?.views?.toLocaleString() ?? 0} views
            </span>
            <span className="text-slate-400">{post.analytics?.applications ?? 0} applications</span>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
              <Share2 className="mr-1.5 h-4 w-4" /> Share
            </Button>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">#{t}</span>
              ))}
            </div>
          )}
          <p className="mt-4 text-sm text-slate-500">
            Tenant: {post.tenantId} · {post.ownerType} {post.ownerId}
          </p>
        </div>
      </article>
    </div>
  )
}
