"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  getCastingById,
  getCastingSubmissions,
  getHolds,
  shortlistSubmissions,
  rejectSubmissions,
  addHold,
  removeHold,
  publishCasting,
  closeCasting,
  type Casting,
} from "@/shared/services/castingService"
import { getTalents } from "@/shared/services/talentService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, Calendar, Users, Award, UserCheck, Trash2, Briefcase } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName } from "@/shared/lib/creator"

const statusStyles: Record<string, string> = {
  OPEN: "bg-[#FEF3C7] text-[#B8860B]",
  SHORTLISTING: "bg-[#FEF3C7] text-[#9A7209]",
  CLOSED: "bg-[#E7E5E4]/60 text-[#57534E]",
}

const subStatusStyles: Record<string, string> = {
  SUBMITTED: "bg-slate-100 text-slate-600",
  SHORTLISTED: "bg-[#FEF3C7] text-[#9A7209]",
  REJECTED: "bg-rose-100 text-rose-600",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function fetchData(
  id: string,
  tenantId: string | null,
  setCasting: (c: Casting | null) => void,
  setSubmissions: (s: any[]) => void,
  setHolds: (h: any[]) => void,
  setLoading: (l: boolean) => void
) {
  Promise.all([
    getCastingById(id, tenantId),
    getCastingSubmissions(id, tenantId),
    getHolds(id, tenantId),
  ]).then(([c, s, h]) => {
    setCasting(c ?? null)
    setSubmissions(s)
    setHolds(h)
    setLoading(false)
  })
}

export default function CastingDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }
  const id = params.id as string
  const [casting, setCasting] = useState<Casting | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [holds, setHolds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubIds, setSelectedSubIds] = useState<Set<string>>(new Set())
  const [addHoldOpen, setAddHoldOpen] = useState(false)
  const [addHoldTalentId, setAddHoldTalentId] = useState("__none__")
  const [addHoldFrom, setAddHoldFrom] = useState("")
  const [addHoldTo, setAddHoldTo] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [talents, setTalents] = useState<{ _id: string; stageName: string }[]>([])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchData(id, tenantId, setCasting, setSubmissions, setHolds, setLoading)
  }, [id, tenantId])

  useEffect(() => {
    if (addHoldOpen) {
      getTalents(tenantId).then((t) => setTalents(t))
    }
  }, [addHoldOpen, tenantId])

  const handleShortlist = async () => {
    if (selectedSubIds.size === 0) {
      showToast("Select at least one submission", "warning")
      return
    }
    setActionLoading(true)
    await shortlistSubmissions(id, Array.from(selectedSubIds), tenantId)
    showToast(`${selectedSubIds.size} submission(s) shortlisted (mock)`, "success")
    setSubmissions((prev) =>
      prev.map((s) => (selectedSubIds.has(s._id) ? { ...s, status: "SHORTLISTED" } : s))
    )
    setSelectedSubIds(new Set())
    setActionLoading(false)
  }

  const handleReject = async () => {
    if (selectedSubIds.size === 0) {
      showToast("Select at least one submission", "warning")
      return
    }
    setActionLoading(true)
    await rejectSubmissions(id, Array.from(selectedSubIds), tenantId)
    showToast(`${selectedSubIds.size} submission(s) rejected (mock)`, "success")
    setSubmissions((prev) =>
      prev.map((s) => (selectedSubIds.has(s._id) ? { ...s, status: "REJECTED" } : s))
    )
    setSelectedSubIds(new Set())
    setActionLoading(false)
  }

  const handleAddHold = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addHoldTalentId || addHoldTalentId === "__none__" || !addHoldFrom || !addHoldTo) {
      showToast("Fill talent and date range", "warning")
      return
    }
    setActionLoading(true)
    const newHold = await addHold(id, addHoldTalentId, addHoldFrom, addHoldTo, tenantId)
    setHolds((prev) => [...prev, newHold])
    showToast("Hold added (mock)", "success")
    setAddHoldOpen(false)
    setAddHoldTalentId("__none__")
    setAddHoldFrom("")
    setAddHoldTo("")
    setActionLoading(false)
  }

  const handleRemoveHold = async (holdId: string) => {
    setActionLoading(true)
    await removeHold(holdId, tenantId)
    setHolds((prev) => prev.filter((h) => h._id !== holdId))
    showToast("Hold removed (mock)", "success")
    setActionLoading(false)
  }

  const handlePublish = async () => {
    setActionLoading(true)
    await publishCasting(id, tenantId)
    showToast("Casting published (mock)", "success")
    setCasting((c) => (c ? { ...c, status: "SHORTLISTING" } : null))
    setActionLoading(false)
  }

  const handleClose = async () => {
    setActionLoading(true)
    await closeCasting(id, tenantId)
    showToast("Casting closed (mock)", "success")
    setCasting((c) => (c ? { ...c, status: "CLOSED" } : null))
    setActionLoading(false)
  }

  const toggleSubSelection = (subId: string) => {
    setSelectedSubIds((prev) => {
      const next = new Set(prev)
      if (next.has(subId)) next.delete(subId)
      else next.add(subId)
      return next
    })
  }

  const toggleAllSubs = () => {
    const allSubmitted = submissions.filter((s) => s.status === "SUBMITTED").map((s) => s._id)
    if (selectedSubIds.size === allSubmitted.length) {
      setSelectedSubIds(new Set())
    } else {
      setSelectedSubIds(new Set(allSubmitted))
    }
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!casting) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Casting not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/castings">Back to castings</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{casting.title}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{casting.client}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/castings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to castings
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border" style={{ borderColor: theme.border }}>
          <Link href={`/modelling/castings/${id}/edit`}>Edit casting</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[casting.status] ?? ""}`}>
                  {casting.status}
                </span>
                <span className="rounded-lg px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5", color: theme.textSecondary }}>
                  {casting.type}
                </span>
              </div>
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <p className="text-[11px] font-medium" style={{ color: theme.text }}>Ownership & attribution</p>
                <p className="mt-0.5 text-xs" style={{ color: theme.textSecondary }}>
                  Created by:{" "}
                  {getCreatorName((casting as any).createdByUserId ?? (casting as any).createdBy) ??
                    (casting as any).createdByUserId ??
                    (casting as any).createdBy ??
                    "System"}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: theme.textSecondary }}>
                  Created: {formatDateTime((casting as any).createdAt)} · Updated: {formatDateTime((casting as any).updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                  <Calendar className="h-4 w-4 text-[#B8860B]" />
                  Deadline: {formatDate(casting.deadline)}
                </span>
                <span className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                  <Users className="h-4 w-4 text-[#B8860B]" />
                  {casting.submissionsCount} submissions
                </span>
                <span className="flex items-center gap-1.5 text-[#B8860B] font-medium">
                  <Award className="h-4 w-4" />
                  {casting.shortlistedCount} shortlisted
                </span>
              </div>
              {casting.description && (
                <p className="text-sm" style={{ color: theme.textSecondary }}>{casting.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-[#B8860B] hover:bg-[#9A7209]"
                  onClick={handleShortlist}
                  disabled={actionLoading || selectedSubIds.size === 0}
                >
                  Shortlist ({selectedSubIds.size})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={handleReject}
                  disabled={actionLoading || selectedSubIds.size === 0}
                >
                  Reject ({selectedSubIds.size})
                </Button>
                <Button size="sm" variant="outline" className="border" style={{ borderColor: theme.border }} asChild>
                  <Link href={`/modelling/bookings/new?castingId=${id}`}>
                    <Briefcase className="mr-1.5 h-4 w-4" />
                    Create booking
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="border" style={{ borderColor: theme.border }}>
                  Add talent
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <UserCheck className="h-5 w-5 text-[#B8860B]" />
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="py-6 text-center" style={{ color: theme.textSecondary }}>No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.some((s) => s.status === "SUBMITTED") && (
                    <div className="mb-2 flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: theme.textSecondary }}>
                        <input
                          type="checkbox"
                          checked={
                            submissions.filter((s) => s.status === "SUBMITTED").length > 0 &&
                            selectedSubIds.size ===
                              submissions.filter((s) => s.status === "SUBMITTED").length
                          }
                          onChange={toggleAllSubs}
                          className="rounded border"
                          style={{ borderColor: theme.border }}
                        />
                        Select all submitted
                      </label>
                    </div>
                  )}
                  {submissions.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{ borderColor: theme.border }}
                    >
                      <div className="flex items-center gap-3">
                        {s.status === "SUBMITTED" && (
                          <input
                            type="checkbox"
                            checked={selectedSubIds.has(s._id)}
                            onChange={() => toggleSubSelection(s._id)}
                            className="rounded border"
                            style={{ borderColor: theme.border }}
                          />
                        )}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3C7]">
                          <Users className="h-5 w-5 text-[#B8860B]" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: theme.text }}>{s.talentName}</p>
                          {s.notes && <p className="text-xs" style={{ color: theme.textSecondary }}>{s.notes}</p>}
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${subStatusStyles[s.status] ?? ""}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Availability holds</CardTitle>
            </CardHeader>
            <CardContent>
              {holds.length === 0 ? (
                <p className="py-4 text-sm" style={{ color: theme.textSecondary }}>No holds.</p>
              ) : (
                <div className="space-y-2">
                  {holds.map((h) => (
                    <div
                      key={h._id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                      style={{ borderColor: theme.border }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: theme.text }}>{h.talentName}</p>
                        <p style={{ color: theme.textSecondary }}>
                          {formatDate(h.fromTs)} – {formatDate(h.toTs)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleRemoveHold(h._id)}
                        disabled={actionLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full border"
                style={{ borderColor: theme.border }}
                onClick={() => setAddHoldOpen(true)}
              >
                Add hold
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(casting.status === "OPEN" || casting.status === "SHORTLISTING") && (
                <Button
                  className="w-full bg-[#B8860B] hover:bg-[#9A7209]"
                  onClick={handlePublish}
                  disabled={actionLoading}
                >
                  Publish
                </Button>
              )}
              {casting.status !== "CLOSED" && (
                <Button
                  variant="outline"
                  className="w-full border"
                  style={{ borderColor: theme.border }}
                  onClick={handleClose}
                  disabled={actionLoading}
                >
                  Close casting
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={addHoldOpen} onOpenChange={setAddHoldOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add hold</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddHold} className="space-y-4">
            <div>
              <Label>Talent</Label>
              <Select value={addHoldTalentId} onValueChange={setAddHoldTalentId}>
                <SelectTrigger className="mt-1 border" style={{ borderColor: theme.border }}>
                  <SelectValue placeholder="Select talent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select talent</SelectItem>
                  {talents.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.stageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>From date</Label>
              <Input
                type="date"
                value={addHoldFrom}
                onChange={(e) => setAddHoldFrom(e.target.value)}
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                required
              />
            </div>
            <div>
              <Label>To date</Label>
              <Input
                type="date"
                value={addHoldTo}
                onChange={(e) => setAddHoldTo(e.target.value)}
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddHoldOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={actionLoading}>
                Add hold
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
