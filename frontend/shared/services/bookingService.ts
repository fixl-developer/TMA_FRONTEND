/**
 * Booking Service - Modelling Agency
 *
 * Mock service for booking operations. Tenant-scoped.
 */

import { seedBookings, seedCallSheets, seedTalents } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** In-memory cache for created bookings (mock persistence) */
const createdBookings: Booking[] = []

export interface Booking {
  _id: string
  tenantId: string
  talentId: string
  stage: string
  clientName: string
  projectName: string
  dates: { start: string; end: string }
  notes?: string
  createdByUserId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CallSheet {
  _id: string
  tenantId: string
  bookingId: string
  content: Record<string, string>
  status: string
  publishedAt?: string | null
}

export const getBookings = async (tenantId?: string | null): Promise<(Booking & { talentName?: string })[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  const seed = (seedBookings as Booking[]).filter((b) => b.tenantId === id)
  const created = createdBookings.filter((b) => b.tenantId === id)
  const bookings = [...created, ...seed]
  const talents = seedTalents as { _id: string; stageName: string }[]
  return bookings.map((b) => {
    const t = talents.find((x) => x._id === b.talentId)
    return { ...b, talentName: t?.stageName ?? b.talentId }
  })
}

export interface BookingsFilterParams {
  stage?: string
  dateFrom?: string
  dateTo?: string
}

export const getBookingsWithFilters = async (
  tenantId?: string | null,
  params?: BookingsFilterParams
): Promise<(Booking & { talentName?: string })[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  const seed = (seedBookings as Booking[]).filter((b) => b.tenantId === id)
  const created = createdBookings.filter((b) => b.tenantId === id)
  let list = [...created, ...seed]
  const talents = seedTalents as { _id: string; stageName: string }[]

  if (params?.stage) {
    list = list.filter((b) => b.stage === params.stage)
  }
  if (params?.dateFrom) {
    const from = new Date(params.dateFrom).getTime()
    list = list.filter((b) => new Date(b.dates.start).getTime() >= from)
  }
  if (params?.dateTo) {
    const to = new Date(params.dateTo).getTime()
    list = list.filter((b) => new Date(b.dates.end).getTime() <= to)
  }

  return list.map((b) => {
    const t = talents.find((x) => x._id === b.talentId)
    return { ...b, talentName: t?.stageName ?? b.talentId }
  })
}

/** Mock: confirm booking */
export const confirmBooking = async (bookingId: string, tenantId?: string | null): Promise<void> => {
  await delay(200)
}

/** Mock: cancel booking */
export const cancelBooking = async (bookingId: string, tenantId?: string | null): Promise<void> => {
  await delay(200)
}

/** Mock: create call sheet */
export const createCallSheet = async (
  bookingId: string,
  content: Record<string, string>,
  tenantId?: string | null
): Promise<CallSheet> => {
  await delay(200)
  const id = tenantId || "tenant_001"
  return {
    _id: `cs_${Date.now()}`,
    tenantId: id,
    bookingId,
    content,
    status: "DRAFT",
    publishedAt: null,
  }
}

/** Mock: update call sheet */
export const updateCallSheet = async (
  callSheetId: string,
  content: Record<string, string>,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: publish call sheet */
export const publishCallSheet = async (callSheetId: string, tenantId?: string | null): Promise<void> => {
  await delay(200)
}

export const getBookingById = async (bookingId: string, tenantId?: string | null): Promise<(Booking & { talentName?: string }) | null> => {
  await delay(100)
  const tid = tenantId || "tenant_001"
  const fromCreated = createdBookings.find((x) => x._id === bookingId && x.tenantId === tid)
  const b = fromCreated ?? (seedBookings as Booking[]).find((x) => x._id === bookingId && x.tenantId === tid)
  if (!b) return null
  const talents = seedTalents as { _id: string; stageName: string }[]
  const t = talents.find((x) => x._id === b.talentId)
  return { ...b, talentName: t?.stageName ?? b.talentId }
}

export interface CreateBookingParams {
  talentId: string
  projectName: string
  clientName?: string
  startDate: string
  endDate: string
  notes?: string
  castingId?: string
}

/** Mock: create booking – stored in-memory for session */
export const createBooking = async (
  params: CreateBookingParams,
  tenantId?: string | null
): Promise<Booking | null> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const start = params.startDate ? new Date(params.startDate).toISOString() : new Date().toISOString()
  const end = params.endDate ? new Date(params.endDate).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const booking: Booking = {
    _id: `booking_new_${Date.now()}`,
    tenantId: tid,
    talentId: params.talentId,
    stage: "INQUIRY",
    clientName: params.clientName ?? "",
    projectName: params.projectName,
    dates: { start, end },
    notes: params.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  createdBookings.push(booking)
  return booking
}

export const getCallSheetByBookingId = async (bookingId: string, tenantId?: string | null): Promise<CallSheet | null> => {
  await delay(80)
  const id = tenantId || "tenant_001"
  const cs = (seedCallSheets as CallSheet[]).find((x) => x.bookingId === bookingId && x.tenantId === id)
  return cs ?? null
}
