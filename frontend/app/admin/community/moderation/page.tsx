"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getPendingPosts,
  approvePost,
  rejectPost,
  getReportedContent,
  dismissReport,
  resolveReportTakedown,
  type CommunityPost,
} from "@/shared/services/communityService"
import { ShieldCheck, Check, X, AlertTriangle, ArrowLeft } from "lucide-react"
import { useTenant } from "@/shared/context/TenantContext"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function CommunityModerationPage() {
  const { tenantId } = useTenant()
  const tid = tenantId ?? "tenant_001"
  const [pendingPosts, setPendingPosts] = useState<CommunityPost[]>([])
  const [reported, setReported] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([getPendingPosts(tid), getReportedContent(tid)]).then(
      ([posts, reports]) => {
        setPendingPosts(posts)
        setReported(reports)
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    load()
  }, [tid])

  const handleApprove = async (postId: string) => {
    await approvePost(postId)
    load()
  }

  const handleReject = async (postId: string) => {
    await rejectPost(postId)
    load()
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Moderation"
        subtitle="Review and approve community posts"
        actions={
          <Link href="/admin/community">
            <AdminButton variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </AdminButton>
          </Link>
        }
      >
        >
        {reported.length > 0 && (
          <AdminCard title="Reported Content" subtitle={`${reported.length} reports requiring attention`} className="mb-6">
            <div className="space-y-4">
              {reported.map((r) => (
                <div
                  key={r._id}
                  className="flex flex-col gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <p className="text-xs font-medium text-amber-400">{r.reason}</p>
                    </div>
                    {r.post && (
                      <>
                        <p className="mt-2 font-medium text-white">{r.post.authorName}</p>
                        <p className="mt-1 text-sm text-white/70">{r.post.content}</p>
                      </>
                    )}
                    <p className="mt-2 text-xs text-white/40">
                      Reported {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await resolveReportTakedown(r._id, r.postId)
                        load()
                      }}
                    >
                      <X className="mr-1 h-4 w-4" /> Takedown
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      onClick={async () => {
                        await dismissReport(r._id)
                        load()
                      }}
                    >
                      <Check className="mr-1 h-4 w-4" /> Dismiss
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        )}

        <AdminCard title="Pending Review" subtitle={`${pendingPosts.length} posts awaiting approval`}>
          {loading ? (
            <AdminLoading rows={3} />
          ) : pendingPosts.length === 0 ? (
            <AdminEmptyState
              icon={ShieldCheck}
              title="No posts pending review"
              description="New posts will appear here for approval"
            />
          ) : (
            <div className="space-y-4">
              {pendingPosts.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{p.authorName}</p>
                    <p className="mt-1 text-sm text-white/70">{p.content}</p>
                    <p className="mt-2 text-xs text-white/40">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <AdminButton
                      size="sm"
                      onClick={() => handleApprove(p._id)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(p._id)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
