"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getPendingPosts,
  approvePost,
  rejectPost,
  getReportedContent,
  dismissReport,
  resolveReportTakedown,
  type CommunityPost,
} from "@/shared/services/communityService"
import { ShieldCheck, Check, X, AlertTriangle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { useTenant } from "@/shared/context/TenantContext"

export default function CommunityModerationPage() {
  const { page } = useDashboardTheme()
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
    <AgenciesPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageBanner
          title="Moderation"
          subtitle="Review and approve community posts."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c71ca15?w=1200&q=80"
        />
        <Link href="/admin/community">
          <span className="text-sm" style={{ color: page.accent }}>
            ← Back to Community
          </span>
        </Link>
      </div>

      {reported.length > 0 && (
        <Card className="mb-6" style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle>Reported content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reported.map((r) => (
                <div
                  key={r._id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                  style={{ borderColor: page.border }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-amber-600">{r.reason}</p>
                    {r.post && (
                      <>
                        <p className="mt-1 font-medium" style={{ color: page.text }}>
                          {r.post.authorName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{r.post.content}</p>
                      </>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      Reported {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={async () => {
                        await resolveReportTakedown(r._id, r.postId)
                        load()
                      }}
                    >
                      <X className="mr-1 h-4 w-4" /> Takedown
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500"
                      onClick={async () => {
                        await dismissReport(r._id)
                        load()
                      }}
                    >
                      <Check className="mr-1 h-4 w-4" /> Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card style={{ borderColor: page.border }}>
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldCheck className="h-5 w-5" style={{ color: page.accent }} />
          <CardTitle>Pending review</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-slate-500">Loading…</p>
          ) : pendingPosts.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <ShieldCheck className="h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-500">No posts pending review.</p>
              <p className="mt-1 text-sm text-slate-500">
                New posts will appear here for approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPosts.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                  style={{ borderColor: page.border }}
                >
                  <div>
                    <p className="font-medium" style={{ color: page.text }}>
                      {p.authorName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{p.content}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => handleApprove(p._id)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(p._id)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
