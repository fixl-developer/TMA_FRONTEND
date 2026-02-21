"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getResultsForPageant,
  isResultsPublished,
  requestResultsPublish,
  markResultsReviewed,
  approveResultsPublish,
  rejectResultsPublish,
  getResultsPublishApprovalState,
  unpublishResults,
  exportResultsCSV,
  type PageantResult,
} from "@/shared/services/pageantScoringService"
import { getPageants } from "@/shared/services/pageantService"
import { Trophy, Crown, Award, Download, Eye, EyeOff, Lock } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { PageantPageHeader } from "@/shared/components/layout/PageantPageHeader"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { usePageantModeStyles } from "@/shared/lib/pageantModeStyles"

const rankIcons: Record<number, typeof Crown> = {
  1: Crown,
  2: Award,
  3: Award,
}

export default function PageantResultsPage() {
  const { cardVariant, colors } = usePageantModeStyles()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const pageantIdParam = searchParams.get("pageant")
  const [pageants, setPageants] = useState<{ _id: string; name: string }[]>([])
  const [selectedPageantId, setSelectedPageantId] = useState<string>("")
  const [results, setResults] = useState<PageantResult[]>([])
  const [published, setPublished] = useState(false)
  const [publishStatus, setPublishStatus] = useState<
    "DRAFT" | "PENDING_REVIEW" | "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED"
  >("DRAFT")
  const [role, setRole] = useState<"DIRECTOR" | "AUDITOR" | "APPROVER">("DIRECTOR")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPageants(tenantId ?? "tenant_002").then((pgs) => {
      setPageants(pgs)
      const id = pageantIdParam || pgs[0]?._id || ""
      setSelectedPageantId(id)
    })
  }, [tenantId, pageantIdParam])

  useEffect(() => {
    if (!selectedPageantId) {
      setLoading(false)
      return
    }
    Promise.all([
      getResultsForPageant(selectedPageantId),
      Promise.resolve(isResultsPublished(selectedPageantId)),
    ]).then(([res, pub]) => {
      setResults(res)
      setPublished(pub)
      setPublishStatus(getResultsPublishApprovalState(selectedPageantId).status)
      setLoading(false)
    })
  }, [selectedPageantId])

  const handleUnpublish = async () => {
    await unpublishResults(selectedPageantId)
    setPublished(false)
    setPublishStatus("DRAFT")
  }

  const handleExport = () => {
    const csv = exportResultsCSV(results)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `results-${selectedPageantId}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AgenciesPage>
      <PageantPageHeader title="Results" subtitle="Publish, export, embargo." />
      <section className="mt-6 min-w-0">
        <Card variant={cardVariant}>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <CardTitle>Results</CardTitle>
              {pageants.length > 1 && (
                <select
                  value={selectedPageantId}
                  onChange={(e) => setSelectedPageantId(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm"
                  style={{ borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }}
                >
                  {pageants.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={role === "DIRECTOR" ? "default" : "outline"}
                className={role !== "DIRECTOR" ? "bg-transparent" : ""}
                style={role !== "DIRECTOR" ? { borderColor: colors.border, color: colors.textMuted } : undefined}
                onClick={() => setRole("DIRECTOR")}
              >
                Director
              </Button>
              <Button
                size="sm"
                variant={role === "AUDITOR" ? "default" : "outline"}
                className={role !== "AUDITOR" ? "bg-transparent" : ""}
                style={role !== "AUDITOR" ? { borderColor: colors.border, color: colors.textMuted } : undefined}
                onClick={() => setRole("AUDITOR")}
              >
                Auditor
              </Button>
              <Button
                size="sm"
                variant={role === "APPROVER" ? "default" : "outline"}
                className={role !== "APPROVER" ? "bg-transparent" : ""}
                style={role !== "APPROVER" ? { borderColor: colors.border, color: colors.textMuted } : undefined}
                onClick={() => setRole("APPROVER")}
              >
                Approver
              </Button>
              <CapabilityGate capability="exports.generate">
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-colors"
                  style={{ borderColor: colors.border, color: colors.text }}
                  onClick={handleExport}
                  disabled={results.length === 0}
                >
                  <Download className="mr-1.5 h-4 w-4" /> Export CSV
                </Button>
              </CapabilityGate>
              {published ? (
                <CapabilityGate capability="scoring.publish">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500/50 text-amber-700"
                    onClick={handleUnpublish}
                  >
                    <Lock className="mr-1.5 h-4 w-4" /> Unpublish (embargo)
                  </Button>
                </CapabilityGate>
              ) : (
                <>
                  {publishStatus === "DRAFT" || publishStatus === "REJECTED" ? (
                    <CapabilityGate capability="scoring.publish">
                      <Button
                        size="sm"
                        className="bg-violet-500 text-white hover:bg-violet-400"
                        onClick={async () => {
                          await requestResultsPublish(
                            selectedPageantId,
                            reason || "Requesting publish approval",
                            "director@talentos.io"
                          )
                          setPublishStatus("PENDING_REVIEW")
                          setReason("")
                          showToast("Publish request submitted to auditor queue.", "success")
                        }}
                        disabled={results.length === 0 || role !== "DIRECTOR" || reason.trim().length < 6}
                      >
                        <Eye className="mr-1.5 h-4 w-4" /> Request publish
                      </Button>
                    </CapabilityGate>
                  ) : null}
                  {publishStatus === "PENDING_REVIEW" ? (
                    <CapabilityGate capability="scoring.publish">
                      <Button
                        size="sm"
                        className="bg-sky-500 text-white hover:bg-sky-400"
                        onClick={async () => {
                          await markResultsReviewed(
                            selectedPageantId,
                            reason || "Auditor reviewed and forwarded",
                            "auditor@talentos.io"
                          )
                          setPublishStatus("PENDING_APPROVAL")
                          setReason("")
                          showToast("Results reviewed. Waiting for approver.", "success")
                        }}
                        disabled={role !== "AUDITOR" || reason.trim().length < 6}
                      >
                        <Eye className="mr-1.5 h-4 w-4" /> Mark reviewed
                      </Button>
                    </CapabilityGate>
                  ) : null}
                  {publishStatus === "PENDING_APPROVAL" ? (
                    <>
                      <CapabilityGate capability="scoring.publish">
                        <Button
                          size="sm"
                          className="bg-violet-500 text-white hover:bg-violet-400"
                          onClick={async () => {
                            await approveResultsPublish(
                              selectedPageantId,
                              reason || "Approved for publication",
                              "approver@talentos.io"
                            )
                            setPublishStatus("PUBLISHED")
                            setPublished(true)
                            setReason("")
                            showToast("Results published.", "success")
                          }}
                          disabled={role !== "APPROVER" || reason.trim().length < 6}
                        >
                          <Eye className="mr-1.5 h-4 w-4" /> Approve publish
                        </Button>
                      </CapabilityGate>
                      <CapabilityGate capability="scoring.publish">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400/40 text-red-600"
                          onClick={async () => {
                            await rejectResultsPublish(
                              selectedPageantId,
                              reason || "Rejected publish request",
                              "approver@talentos.io"
                            )
                            setPublishStatus("REJECTED")
                            setPublished(false)
                            setReason("")
                            showToast("Publish request rejected.", "info")
                          }}
                          disabled={role !== "APPROVER" || reason.trim().length < 6}
                        >
                          <Lock className="mr-1.5 h-4 w-4" /> Reject
                        </Button>
                      </CapabilityGate>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className="mb-3 space-y-2 rounded-lg border p-3"
              style={{ borderColor: colors.border, backgroundColor: colors.surfaceAlt }}
            >
              <p className="text-xs font-semibold uppercase" style={{ color: colors.textMuted }}>Publish workflow</p>
              <p className="text-sm" style={{ color: colors.text }}>
                Status: <span className="font-semibold">{publishStatus}</span>
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason / reviewer note (minimum 6 chars)"
                className="min-h-[62px] w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }}
              />
            </div>
            {loading ? (
              <p className="py-8 text-center" style={{ color: colors.textSoft }}>Loading…</p>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Trophy className="h-12 w-12" style={{ color: colors.textSoft }} />
                <p className="mt-4 font-medium" style={{ color: colors.textMuted }}>No results yet</p>
                <p className="mt-1 text-sm" style={{ color: colors.textSoft }}>
                  Complete judge scoring and finalize rankings to see results.
                </p>
              </div>
            ) : (
              <>
                {!published && (
                  <div
                    className="mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: "rgba(245, 158, 11, 0.35)",
                      backgroundColor: cardVariant === "dark" ? "rgba(120, 53, 15, 0.35)" : "rgb(255 251 235)",
                      color: cardVariant === "dark" ? "#fcd34d" : "#92400e",
                    }}
                  >
                    <EyeOff className="h-4 w-4" />
                    Results are under embargo. Publish to make them visible to participants.
                  </div>
                )}
                <div className="space-y-3">
                  {results.map((r) => {
                    const Icon = rankIcons[r.rank] ?? Trophy
                    return (
                      <div
                        key={r._id}
                        className="flex items-center justify-between rounded-xl border p-3.5 transition-all hover:shadow-md"
                        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                            <Icon className="h-6 w-6 text-violet-600" />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: colors.text }}>{r.contestantName}</p>
                            <p className="text-sm text-violet-600">{r.title}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-600">
                          #{r.rank}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-4 text-center text-xs" style={{ color: colors.textSoft }}>
                  {published
                    ? "Results are published and visible to participants."
                    : "Results are placeholder until finals are published."}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
