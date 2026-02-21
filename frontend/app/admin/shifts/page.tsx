"use client"

import { useEffect, useMemo, useState } from "react"
import { getShiftsByTenant, getEventStaffingEvents } from "@/shared/services/shiftService"
import { useTenant } from "@/shared/context/TenantContext"
import { Calendar, Clock, MapPin, UserCheck, LogIn, LogOut, Plus, Download } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

type ShiftStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "TIMESHEET_SUBMITTED" | "PAID" | "CANCELLED"

const STATUS_LABEL: Record<ShiftStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked In",
  CHECKED_OUT: "Checked Out",
  TIMESHEET_SUBMITTED: "Timesheet Submitted",
  PAID: "Paid",
  CANCELLED: "Cancelled",
}

const STATUS_VARIANT: Record<ShiftStatus, "default" | "success" | "warning" | "danger"> = {
  PENDING: "default",
  CONFIRMED: "warning",
  CHECKED_IN: "success",
  CHECKED_OUT: "success",
  TIMESHEET_SUBMITTED: "warning",
  PAID: "success",
  CANCELLED: "danger",
}

const NEXT_ACTIONS: Partial<Record<ShiftStatus, { label: string; next: ShiftStatus }>> = {
  PENDING: { label: "Confirm", next: "CONFIRMED" },
  CONFIRMED: { label: "Check In", next: "CHECKED_IN" },
  CHECKED_IN: { label: "Check Out", next: "CHECKED_OUT" },
  CHECKED_OUT: { label: "Submit Timesheet", next: "TIMESHEET_SUBMITTED" },
  TIMESHEET_SUBMITTED: { label: "Mark Paid", next: "PAID" },
}

const STORAGE_KEY = "talentos_shifts_overrides"

function getOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
}
function saveOverride(id: string, patch: any) {
  const o = getOverrides(); o[id] = { ...o[id], ...patch }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(o))
}

const LIFECYCLE_STAGES: ShiftStatus[] = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "TIMESHEET_SUBMITTED", "PAID"]

export default function ShiftRostersPage() {
  const { tenantId } = useTenant()
  const [events, setEvents] = useState<any[]>([])
  const [shifts, setShifts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [eventFilter, setEventFilter] = useState<string>("ALL")
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: { label: string; next: ShiftStatus } } | null>(null)
  const [timesheetNotes, setTimesheetNotes] = useState("")

  useEffect(() => {
    Promise.all([
      getEventStaffingEvents(tenantId),
      getShiftsByTenant(tenantId),
    ]).then(([e, s]) => {
      const overrides = getOverrides()
      setEvents(e)
      setShifts(s.map((sh: any) => ({ ...sh, ...overrides[sh._id] })))
      setLoading(false)
    })
  }, [tenantId])

  const filtered = useMemo(() => {
    let result = shifts
    if (statusFilter !== "ALL") result = result.filter((s) => s.status === statusFilter)
    if (eventFilter !== "ALL") result = result.filter((s) => s.eventId === eventFilter)
    return result
  }, [shifts, statusFilter, eventFilter])

  const stats = useMemo(() => ({
    total: shifts.length,
    active: shifts.filter((s) => ["CONFIRMED", "CHECKED_IN"].includes(s.status)).length,
    checkedIn: shifts.filter((s) => s.checkedInAt).length,
    totalPay: shifts.filter((s) => s.status === "PAID").reduce((sum, s) => sum + (s.payRate * 8), 0),
  }), [shifts])

  function handleAction(id: string, action: { label: string; next: ShiftStatus }) {
    setConfirmAction({ id, action })
  }

  function confirmStatusChange() {
    if (!confirmAction) return
    const { id, action } = confirmAction
    const patch: any = { status: action.next }
    if (action.next === "CHECKED_IN") patch.checkedInAt = new Date().toISOString()
    if (action.next === "CHECKED_OUT") patch.checkedOutAt = new Date().toISOString()
    if (action.next === "TIMESHEET_SUBMITTED") patch.timesheetNotes = timesheetNotes
    setShifts((prev) => prev.map((s) => s._id === id ? { ...s, ...patch } : s))
    saveOverride(id, patch)
    setConfirmAction(null)
    setTimesheetNotes("")
  }

  function exportCsv() {
    const rows = [
      ["ID", "Assignee", "Event", "Role", "Date", "Start", "End", "Status", "Pay Rate"],
      ...shifts.map((s) => [s._id, s.assigneeName, s.eventName, s.role, s.date, s.startTime, s.endTime, s.status, s.payRate]),
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const a = document.createElement("a")
    a.href = "data:text/csv," + encodeURIComponent(csv)
    a.download = "shifts.csv"
    a.click()
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Shift Roster"
        subtitle="Assign, check-in, track timesheets and process payouts for event staff"
        action={
          <div className="flex gap-2">
            <AdminButton variant="ghost" onClick={exportCsv}>
              <Download className="mr-1 h-4 w-4" /> Export
            </AdminButton>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <AdminStatCard title="Total Shifts" value={stats.total} icon={Calendar} />
        <AdminStatCard title="Active Today" value={stats.active} icon={Clock} />
        <AdminStatCard title="Checked In" value={stats.checkedIn} icon={LogIn} />
        <AdminStatCard title="Paid Out" value={`₹${stats.totalPay.toLocaleString("en-IN")}`} icon={UserCheck} />
      </div>

      {/* Lifecycle pipeline */}
      <AdminCard>
        <h3 className="mb-4 text-sm font-semibold text-white/70">SHIFT LIFECYCLE</h3>
        <div className="flex flex-wrap items-center gap-1">
          {LIFECYCLE_STAGES.map((stage, i) => {
            const count = shifts.filter((s) => s.status === stage).length
            return (
              <div key={stage} className="flex items-center">
                {i > 0 && <span className="mx-1 text-white/20">→</span>}
                <button
                  onClick={() => setStatusFilter(stage)}
                  className={`rounded-lg border px-3 py-2 text-center text-xs transition hover:bg-white/10 ${
                    statusFilter === stage ? "border-blue-400 bg-blue-500/20" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-base font-bold text-white">{count}</p>
                  <p className="text-white/50">{STATUS_LABEL[stage]}</p>
                </button>
              </div>
            )
          })}
        </div>
      </AdminCard>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
        >
          <option value="ALL">All Events</option>
          {events.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
        </select>
        {(statusFilter !== "ALL" || eventFilter !== "ALL") && (
          <AdminButton variant="ghost" size="sm" onClick={() => { setStatusFilter("ALL"); setEventFilter("ALL") }}>
            Clear Filters
          </AdminButton>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />)}</div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState title="No shifts found" description="No shifts match the selected filters." />
      ) : (
        <AdminCard>
          <AdminTable headers={["Assignee", "Event", "Role / Location", "Date & Time", "Status", "Pay Rate", "Actions"]}>
            {filtered.map((shift) => {
              const action = NEXT_ACTIONS[shift.status as ShiftStatus]
              return (
                <AdminTableRow key={shift._id}>
                  <td className="whitespace-nowrap py-3 pr-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                        {shift.assigneeName?.charAt(0)}
                      </div>
                      {shift.assigneeName}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-white/70">{shift.eventName}</td>
                  <td className="py-3 pr-4 text-sm">
                    <div className="text-white/80">{shift.role}</div>
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <MapPin className="h-3 w-3" />{shift.location}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-sm">
                    <div className="text-white/80">{shift.date}</div>
                    <div className="text-xs text-white/40">{shift.startTime} – {shift.endTime}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <AdminBadge variant={STATUS_VARIANT[shift.status as ShiftStatus]}>
                      {STATUS_LABEL[shift.status as ShiftStatus] || shift.status}
                    </AdminBadge>
                    {shift.checkedInAt && !shift.checkedOutAt && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-emerald-400">
                        <LogIn className="h-3 w-3" /> Active
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-white/70">₹{shift.payRate}/hr</td>
                  <td className="py-3 pr-4">
                    {action && (
                      <AdminButton variant="secondary" size="sm" onClick={() => handleAction(shift._id, action)}>
                        {action.label}
                      </AdminButton>
                    )}
                  </td>
                </AdminTableRow>
              )
            })}
          </AdminTable>
        </AdminCard>
      )}

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="border border-white/10 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Confirm: {confirmAction?.action.label}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/60">
            Are you sure you want to {confirmAction?.action.label.toLowerCase()} this shift?
          </p>
          {confirmAction?.action.next === "TIMESHEET_SUBMITTED" && (
            <div className="mt-2">
              <label className="mb-1 block text-sm text-white/60">Notes (optional)</label>
              <textarea
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Timesheet notes, overtime, adjustments..."
                value={timesheetNotes}
                onChange={(e) => setTimesheetNotes(e.target.value)}
              />
            </div>
          )}
          {confirmAction?.action.next === "PAID" && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              This will mark the shift as paid and trigger a payout record.
            </div>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setConfirmAction(null)}>Cancel</AdminButton>
            <AdminButton onClick={confirmStatusChange}>Confirm</AdminButton>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  )
}
