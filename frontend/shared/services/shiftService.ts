/**
 * Shift Service - B7 Event Staffing
 *
 * Shift rosters and check-ins for event staffing agencies.
 */

import { seedShifts, seedEventStaffingEvents } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? "tenant_001"
}

export interface Shift {
  _id: string
  tenantId: string
  eventId: string
  eventName: string
  assigneeId: string
  assigneeName: string
  role: string
  location: string
  date: string
  startTime: string
  endTime: string
  status: string
  checkedInAt: string | null
  checkedOutAt: string | null
  payRate?: number
}

export interface EventStaffingEvent {
  _id: string
  tenantId: string
  name: string
  type: string
  date: string
  location: string
  status: string
  shiftsRequired: number
  shiftsFilled: number
}

export async function getShiftsByTenant(tenantId?: string | null, eventId?: string): Promise<Shift[]> {
  await delay(150)
  const id = resolveTenant(tenantId)
  let list = (seedShifts as Shift[]).filter((s) => s.tenantId === id)
  if (eventId) list = list.filter((s) => s.eventId === eventId)
  return list.sort((a, b) => {
    const d = a.date.localeCompare(b.date)
    if (d !== 0) return d
    return a.startTime.localeCompare(b.startTime)
  })
}

export async function getEventStaffingEvents(tenantId?: string | null): Promise<EventStaffingEvent[]> {
  await delay(150)
  const id = resolveTenant(tenantId)
  return (seedEventStaffingEvents as EventStaffingEvent[]).filter((e) => e.tenantId === id)
}
