"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle, XCircle, Clock, FileSearch, AlertTriangle, Building2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

interface BlueprintRequest {
  _id: string
  tenantId: string
  tenantName: string
  blueprintId: string
  blueprintName: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  requestedAt: string
  reviewedAt?: string
  reviewNote?: string
}

const SEED_REQUESTS: BlueprintRequest[] = [
  {
    _id: "bpr_001",
    tenantId: "tenant_001",
    tenantName: "StarCast Agency",
    blueprintId: "B4",
    blueprintName: "Brand Deals & Sponsorships",
    reason: "We manage brand collaborations for 50+ creators and need deal room functionality.",
    status: "PENDING",
    requestedAt: "2024-07-01T10:00:00.000Z",
  },
  {
    _id: "bpr_002",
    tenantId: "tenant_004",
    tenantName: "Fashion Forward Studio",
    blueprintId: "B9",
    blueprintName: "Marketplace & Aggregator",
    reason: "Planning to launch a marketplace for freelance stylists and photographers.",
    status: "PENDING",
    requestedAt: "2024-07-03T09:30:00.000Z",
  },
  {
    _id: "bpr_003",
    tenantId: "tenant_006",
    tenantName: "TalentPro Mumbai",
    blueprintId: "B10",
    blueprintName: "Holding Company / Group",
    reason: "We have 5 subsidiary agencies and need consolidated management.",
    status: "APPROVED",
    requestedAt: "2024-06-15T08:00:00.000Z",
    reviewedAt: "2024-06-17T11:00:00.000Z",
    reviewNote: "Verified subsidiary structure. Approved.",
  },
  {
    _id: "bpr_004",
    tenantId: "tenant_008",
    tenantName: "MediaHouse India",
    blueprintId: "B7",
    blueprintName: "Event Staffing",
    reason: "Large-scale event staffing requirements for corporate events.",
    status: "REJECTED",
    requestedAt: "2024-06-20T14:00:00.000Z",
    reviewedAt: "2024-06-22T09:00:00.000Z",
    reviewNote: "KYC documents incomplete. Reapply after verification.",
  },
]

const APPROVALS_KEY = "talentos_superadmin_bp_approvals"
const REQUESTS_KEY = "talentos_blueprint_requests"

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
          <Clock className="h-3 w-3" /> Pending
        </span>
      )
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <CheckCircle className="h-3 w-3" /> Approved
        </span>
      )
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" /> Rejected
        </span>
      )
    default:
      return <span className="text-xs text-slate-400">{status}</span>
  }
}

export default function SuperAdminBlueprintsPage() {
  const [requests, setRequests] = useState<BlueprintRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [reviewTarget, setReviewTarget] = useState<BlueprintRequest | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT" | null>(null)

  useEffect(() => {
    const seed = SEED_REQUESTS
    const approvals: any[] = (() => {
      try { return JSON.parse(localStorage.getItem(APPROVALS_KEY) || "[]") } catch { return [] }
    })()
    const merged = seed.map((r) => {
      const override = approvals.find((a: any) => a._id === r._id)
      return override ? { ...r, ...override } : r
    })
    const tenantRequests: any[] = (() => {
      try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]") } catch { return [] }
    })()
    const extra = tenantRequests.filter((tr: any) => !merged.find((m) => m._id === tr._id))
    setRequests([...extra, ...merged])
  }, [])

  const filtered = useMemo(() =>
    statusFilter === "ALL" ? requests : requests.filter((r) => r.status === statusFilter),
    [requests, statusFilter]
  )

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  }), [requests])

  function handleReview(request: BlueprintRequest, action: "APPROVE" | "REJECT") {
    setReviewTarget(request)
    setReviewAction(action)
    setReviewNote("")
  }

  function submitReview() {
    if (!reviewTarget || !reviewAction) return
    const updated = requests.map((r) =>
      r._id === reviewTarget._id
        ? { ...r, status: reviewAction === "APPROVE" ? "APPROVED" : "REJECTED" as any, reviewNote, reviewedAt: new Date().toISOString() }
        : r
    )
    setRequests(updated)
    const overrides = updated.map((r) => ({ _id: r._id, status: r.status, reviewNote: r.reviewNote, reviewedAt: r.reviewedAt }))
    localStorage.setItem(APPROVALS_KEY, JSON.stringify(overrides))
    setReviewTarget(null)
    setReviewAction(null)
    setReviewNote("")
  }

  return (
    <PageLayout>
      <PageHeader
        title="Blueprint Requests"
        description="Review and approve tenant blueprint activation requests."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileSearch className="h-3.5 w-3.5 text-blue-500" />
            Blueprint Approvals
          </span>
        }
      />

      {/* Stats */}
      <PageSection>
        <MetricsGrid>
          <Card className="hover:border-blue-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <FileSearch className="h-4 w-4 text-blue-500" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-amber-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-amber-500" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-emerald-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-red-400 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stats.rejected}</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      {/* Alert */}
      {stats.pending > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            <strong>{stats.pending} blueprint request{stats.pending > 1 ? "s" : ""}</strong> awaiting review.
          </p>
        </div>
      )}

      {/* Filters */}
      <PageSection title="All Requests">
        <div className="mb-4 flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                statusFilter === s
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s} ({s === "ALL" ? requests.length : requests.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Tenant</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Blueprint Requested</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Reason</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Requested</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {req.tenantName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{req.tenantName}</p>
                            <p className="text-xs text-slate-400">{req.tenantId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{req.blueprintName}</p>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500">{req.blueprintId}</span>
                      </td>
                      <td className="max-w-xs px-4 py-3 text-slate-600">
                        <p className="line-clamp-2">{req.reason}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(req.status)}
                        {req.reviewedAt && (
                          <p className="mt-0.5 text-xs text-slate-400">{new Date(req.reviewedAt).toLocaleDateString()}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {req.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleReview(req, "APPROVE")}>
                              <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => handleReview(req, "REJECT")}>
                              <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                            </Button>
                          </div>
                        ) : req.reviewNote ? (
                          <p className="max-w-xs text-xs italic text-slate-400">{req.reviewNote}</p>
                        ) : <span className="text-xs text-slate-300">—</span>}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        No requests match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={() => setReviewTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={reviewAction === "APPROVE" ? "text-emerald-700" : "text-red-700"}>
              {reviewAction === "APPROVE" ? "Approve Blueprint Request" : "Reject Blueprint Request"}
            </DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{reviewTarget.tenantName}</p>
                    <p className="text-sm text-slate-600">{reviewTarget.blueprintName} ({reviewTarget.blueprintId})</p>
                  </div>
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <p className="mt-2 text-sm text-slate-500">{reviewTarget.reason}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Review Note {reviewAction === "REJECT" ? "(required)" : "(optional)"}
                </label>
                <textarea
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder={reviewAction === "APPROVE" ? "Approval message for tenant..." : "Reason for rejection..."}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReviewTarget(null)}>Cancel</Button>
            <Button
              className={reviewAction === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
              onClick={submitReview}
              disabled={reviewAction === "REJECT" && !reviewNote}
            >
              Confirm {reviewAction === "APPROVE" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
