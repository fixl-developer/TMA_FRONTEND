"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getBookingById,
  getCallSheetByBookingId,
  confirmBooking,
  cancelBooking,
  createCallSheet,
  updateCallSheet,
  publishCallSheet,
  type Booking,
  type CallSheet,
} from "@/shared/services/bookingService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ArrowLeft, Calendar, User, FileText, CheckCircle2, XCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName } from "@/shared/lib/creator"

const stageStyles: Record<string, string> = {
  INQUIRY: "bg-slate-100 text-slate-600",
  OPTION_HOLD: "bg-[#FEF3C7] text-[#B8860B]",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-600",
}

const STAGE_ORDER = ["INQUIRY", "OPTION_HOLD", "CONFIRMED"]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function BookingDetailPage() {
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
  const [booking, setBooking] = useState<(Booking & { talentName?: string }) | null>(null)
  const [callSheet, setCallSheet] = useState<CallSheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [editCallSheetOpen, setEditCallSheetOpen] = useState(false)
  const [editCallDate, setEditCallDate] = useState("")
  const [editCallTime, setEditCallTime] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editWardrobe, setEditWardrobe] = useState("")
  const [editNotes, setEditNotes] = useState("")

  useEffect(() => {
    if (!id) return
    Promise.all([
      getBookingById(id, tenantId),
      getCallSheetByBookingId(id, tenantId),
    ]).then(([b, cs]) => {
      setBooking(b ?? null)
      setCallSheet(cs ?? null)
      setLoading(false)
    })
  }, [id, tenantId])

  useEffect(() => {
    if (editCallSheetOpen && callSheet) {
      setEditCallDate(callSheet.content?.callDate ?? "")
      setEditCallTime(callSheet.content?.callTime ?? "")
      setEditLocation(callSheet.content?.location ?? "")
      setEditWardrobe(callSheet.content?.wardrobe ?? "")
      setEditNotes(callSheet.content?.notes ?? "")
    } else if (editCallSheetOpen && !callSheet) {
      setEditCallDate(booking?.dates?.start ? new Date(booking.dates.start).toISOString().slice(0, 10) : "")
      setEditCallTime("08:00")
      setEditLocation("")
      setEditWardrobe("")
      setEditNotes("")
    }
  }, [editCallSheetOpen, callSheet, booking?.dates?.start])

  const handleConfirm = async () => {
    setActionLoading(true)
    await confirmBooking(id, tenantId)
    showToast("Booking confirmed (mock)", "success")
    setBooking((b) => (b ? { ...b, stage: "CONFIRMED" } : null))
    setActionLoading(false)
  }

  const handleCancel = async () => {
    setActionLoading(true)
    await cancelBooking(id, tenantId)
    showToast("Booking cancelled (mock)", "success")
    setBooking((b) => (b ? { ...b, stage: "CANCELLED" } : null))
    setActionLoading(false)
  }

  const handleCreateCallSheet = async () => {
    setActionLoading(true)
    const callDate = booking?.dates?.start ? new Date(booking.dates.start).toISOString().slice(0, 10) : ""
    const newCs = await createCallSheet(
      id,
      { callDate, callTime: "08:00", location: "", wardrobe: "", notes: "" },
      tenantId
    )
    setCallSheet(newCs)
    setEditCallSheetOpen(true)
    setEditCallDate(callDate)
    setEditCallTime("08:00")
    setEditLocation("")
    setEditWardrobe("")
    setEditNotes("")
    showToast("Call sheet created (mock)", "success")
    setActionLoading(false)
  }

  const handleSaveCallSheet = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const content = { callDate: editCallDate, callTime: editCallTime, location: editLocation, wardrobe: editWardrobe, notes: editNotes }
    if (callSheet) {
      await updateCallSheet(callSheet._id, content, tenantId)
      setCallSheet((cs) => (cs ? { ...cs, content } : null))
      showToast("Call sheet updated (mock)", "success")
    } else {
      const newCs = await createCallSheet(id, content, tenantId)
      setCallSheet({ ...newCs, content })
      showToast("Call sheet created (mock)", "success")
    }
    setEditCallSheetOpen(false)
    setActionLoading(false)
  }

  const handlePublishCallSheet = async () => {
    if (!callSheet) return
    setActionLoading(true)
    await publishCallSheet(callSheet._id, tenantId)
    setCallSheet((cs) => (cs ? { ...cs, status: "PUBLISHED", publishedAt: new Date().toISOString() } : null))
    showToast("Call sheet published (mock)", "success")
    setActionLoading(false)
  }

  const currentStageIndex = booking ? STAGE_ORDER.indexOf(booking.stage) : -1

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!booking) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Booking not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/bookings">Back to bookings</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>{booking.projectName}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{booking.clientName}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/bookings" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to bookings
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Booking details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageStyles[booking.stage] ?? ""}`}>
                  {booking.stage.replace(/_/g, " ")}
                </span>
              </div>
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <p className="text-[11px] font-medium" style={{ color: theme.text }}>Ownership & attribution</p>
                <p className="mt-0.5 text-xs" style={{ color: theme.textSecondary }}>
                  Created by:{" "}
                  {getCreatorName((booking as any).createdByUserId ?? (booking as any).createdBy) ??
                    (booking as any).createdByUserId ??
                    (booking as any).createdBy ??
                    "System"}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: theme.textSecondary }}>
                  Created: {formatDateTime((booking as any).createdAt)} · Updated: {formatDateTime((booking as any).updatedAt)}
                </p>
              </div>

              {/* Status timeline */}
              {booking.stage !== "CANCELLED" && (
                <div className="rounded-lg border p-4" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  <p className="mb-3 text-xs font-medium" style={{ color: theme.textSecondary }}>Status timeline</p>
                  <div className="flex items-center gap-2">
                    {STAGE_ORDER.map((stage, i) => {
                      const isActive = currentStageIndex >= i
                      const isCurrent = booking.stage === stage
                      return (
                        <div key={stage} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                isActive ? "bg-[#B8860B] text-white" : "text-[#57534E]"
                              } ${isCurrent ? "ring-2 ring-[#B8860B] ring-offset-2" : ""}`}
                              style={!isActive ? { backgroundColor: theme.border } : {}}
                            >
                              {isActive ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                            </div>
                            <span className={`mt-1 text-xs ${isCurrent ? "font-medium" : ""}`} style={{ color: isCurrent ? theme.text : theme.textSecondary }}>
                              {stage.replace(/_/g, " ")}
                            </span>
                          </div>
                          {i < STAGE_ORDER.length - 1 && (
                            <div className={`mx-1 h-0.5 flex-1 ${isActive ? "bg-[#B8860B]/50" : ""}`} style={!isActive ? { backgroundColor: theme.border } : {}} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-[#B8860B]" />
                  <span style={{ color: theme.textSecondary }}>Talent: {booking.talentName ?? booking.talentId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#B8860B]" />
                  <span style={{ color: theme.textSecondary }}>
                    {formatDate(booking.dates.start)} – {formatDate(booking.dates.end)}
                  </span>
                </div>
              </div>
              {booking.notes && (
                <p className="text-sm" style={{ color: theme.textSecondary }}>{booking.notes}</p>
              )}
              {booking.stage !== "CANCELLED" && (
                <div className="flex gap-2">
                  {(booking.stage === "INQUIRY" || booking.stage === "OPTION_HOLD") && (
                    <Button
                      size="sm"
                      className="bg-[#B8860B] hover:bg-[#9A7209]"
                      onClick={handleConfirm}
                      disabled={actionLoading}
                    >
                      Confirm
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={handleCancel}
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <FileText className="h-5 w-5 text-[#B8860B]" />
                Call sheet
              </CardTitle>
              {callSheet ? (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${callSheet.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {callSheet.status}
                </span>
              ) : (
                <Button size="sm" variant="outline" className="border" style={{ borderColor: theme.border }} onClick={handleCreateCallSheet} disabled={actionLoading}>
                  Create call sheet
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!callSheet ? (
                <p className="py-6 text-center" style={{ color: theme.textSecondary }}>No call sheet yet.</p>
              ) : (
                <div className="space-y-3 rounded-lg border p-4" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                  {Object.entries(callSheet.content || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="font-medium capitalize" style={{ color: theme.textSecondary }}>{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                      <span style={{ color: theme.text }}>{value}</span>
                    </div>
                  ))}
                  {callSheet.status === "DRAFT" && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-[#B8860B] hover:bg-[#9A7209]" onClick={handlePublishCallSheet} disabled={actionLoading}>
                        Publish
                      </Button>
                      <Button size="sm" variant="outline" className="border" style={{ borderColor: theme.border }} onClick={() => setEditCallSheetOpen(true)}>
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full bg-[#B8860B] hover:bg-[#9A7209]">
                <Link href={`/modelling/talent/${booking.talentId}`}>View talent</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border" style={{ borderColor: theme.border }}>
                <Link href={`/modelling/contracts/new?bookingId=${booking._id}`}>Create contract</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editCallSheetOpen} onOpenChange={setEditCallSheetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{callSheet ? "Edit call sheet" : "Create call sheet"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCallSheet} className="space-y-4">
            <div>
              <Label>Call date</Label>
              <Input
                type="date"
                value={editCallDate}
                onChange={(e) => setEditCallDate(e.target.value)}
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label>Call time</Label>
              <Input
                type="time"
                value={editCallTime}
                onChange={(e) => setEditCallTime(e.target.value)}
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. Studio A, Mumbai"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label>Wardrobe</Label>
              <Input
                value={editWardrobe}
                onChange={(e) => setEditWardrobe(e.target.value)}
                placeholder="e.g. Bring 3 outfits"
                className="mt-1 border"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditCallSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={actionLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
