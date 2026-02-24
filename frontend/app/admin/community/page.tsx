"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
  getCommunityPosts,
  createPost,
  type CommunityPost,
} from "@/shared/services/communityService"
import { MessageCircle, Users2, ShieldCheck, ChevronRight, Plus, CheckCircle, Clock } from "lucide-react"
import { useTenant } from "@/shared/context/TenantContext"

export default function CommunityFeedPage() {
  const { tenantId } = useTenant()
  const tid = tenantId ?? "tenant_001"
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newContent, setNewContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadPosts = () => {
    getCommunityPosts(tid)
      .then(setPosts)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [tid])

  const approved = posts.filter((p) => p.status === "APPROVED")
  const pending = posts.filter((p) => p.status === "PENDING")

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return
    setSubmitting(true)
    await createPost(tid, "user_current", "Current User", newContent.trim())
    setNewContent("")
    setCreateOpen(false)
    loadPosts()
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Community</h1>
          <p className="mt-2 text-base text-white/60">Feed, groups, and moderation</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 admin-light-theme:border-slate-200 admin-light-theme:bg-white">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-violet-100/50 blur-2xl admin-dark-theme:bg-purple-400/20" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Feed posts</p>
                  <p className="mt-1 text-sm text-white/60">Total posts</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{posts.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Approved</p>
                  <p className="mt-1 text-sm text-white/60">Live in feed</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{approved.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Pending review</p>
                  <p className="mt-1 text-sm text-white/60">Awaiting moderation</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{pending.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Feed */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:col-span-2">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-white">Recent feed</h3>
              <div className="flex gap-2">
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]">
                      <Plus className="mr-2 h-4 w-4" />
                      Create post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <textarea
                          id="content"
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Share something with the community..."
                          rows={4}
                          required
                          className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-md"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCreateOpen(false)}
                          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting || !newContent.trim()}
                          className="bg-[#d4ff00] text-black hover:bg-[#b8e600]"
                        >
                          Post
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Link href="/admin/community/moderation">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    Moderation queue
                  </Button>
                </Link>
              </div>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : approved.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <MessageCircle className="mx-auto mb-3 h-12 w-12 text-white/30" />
                <p className="text-white/60">No approved posts yet</p>
                <p className="mt-1 text-sm text-white/40">
                  Create a post or approve pending ones in Moderation
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approved.map((p) => (
                  <div
                    key={p._id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-sm font-medium text-white">{p.authorName}</p>
                    <p className="mt-1 text-sm text-white/70">{p.content}</p>
                    <p className="mt-2 text-xs text-white/40">
                      {p.likesCount} likes · {p.commentsCount} comments ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-bold text-white">Quick links</h3>
            <div className="space-y-2">
              <Link href="/admin/community/groups">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Groups</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </div>
              </Link>
              <Link href="/admin/community/moderation">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-white">Moderation</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
