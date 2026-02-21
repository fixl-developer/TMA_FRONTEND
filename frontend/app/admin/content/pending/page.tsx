"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPendingContentPosts } from "@/shared/services/showcaseService"
import type { ContentPost } from "@/shared/lib/types/showcase"
import { Film, ImageIcon, CheckCircle2, XCircle, Upload, FileImage } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"

const DEMO_TENANT = "tenant_001"

export default function ContentApprovalQueuePage() {
  const [posts, setPosts] = useState<ContentPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPendingContentPosts(DEMO_TENANT).then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const videoPosts = posts.filter((p) => p.type === "VIDEO")
  const imagePosts = posts.filter((p) => p.type === "IMAGE")

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Approval Queue"
        subtitle="Pending content to approve or reject"
        action={
          <Link href="/admin/content/upload">
            <AdminButton>
              <Upload className="mr-2 h-4 w-4" />
              Upload Content
            </AdminButton>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Pending"
          value={posts.length}
          subtitle="Awaiting review"
          icon={FileImage}
          color="purple"
        />
        <AdminStatCard
          title="Videos"
          value={videoPosts.length}
          subtitle="Video content"
          icon={Film}
          color="blue"
        />
        <AdminStatCard
          title="Images"
          value={imagePosts.length}
          subtitle="Image content"
          icon={ImageIcon}
          color="pink"
        />
        <AdminStatCard
          title="Queue Status"
          value={posts.length > 0 ? "Active" : "Empty"}
          subtitle="Current state"
          icon={CheckCircle2}
          color={posts.length > 0 ? "yellow" : "green"}
        />
      </div>

      {/* Content Grid */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Pending Content</h3>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <AdminEmptyState
            icon={FileImage}
            title="No pending content"
            description="All content has been reviewed"
            action={
              <Link href="/admin/content/upload">
                <AdminButton>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                  {post.type === "VIDEO" ? (
                    <Film className="h-12 w-12 text-white/30" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-white/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{post.title}</h3>
                  <p className="mt-1 text-xs text-white/50">
                    {post.ownerType} {post.ownerId}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <AdminButton size="sm" className="flex-1">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Approve
                    </AdminButton>
                    <AdminButton size="sm" variant="danger" className="flex-1">
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Reject
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
