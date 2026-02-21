/**
 * Casting Service - Modelling Agency (Jobs)
 *
 * Mock service for casting/job operations. Tenant-scoped.
 */

import { seedCastings, seedCastingSubmissions, seedHolds, seedTalents } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** In-memory cache for created castings (mock persistence) */
const createdCastings: Casting[] = []
/** Overrides for seed castings (mock edit persistence) */
const castingOverrides: Record<string, Partial<Casting>> = {}

export interface Casting {
  _id: string
  tenantId: string
  title: string
  client: string
  type: string
  status: string
  deadline: string
  submissionsCount: number
  shortlistedCount: number
  description?: string
}

export interface CastingSubmission {
  _id: string
  tenantId: string
  castingId: string
  talentId: string
  status: string
  notes?: string
  createdAt?: string
}

export interface Hold {
  _id: string
  tenantId: string
  castingId: string
  talentId: string
  fromTs: string
  toTs: string
  status: string
  createdAt?: string
}

function applyOverrides(list: Casting[], tid: string): Casting[] {
  return list.map((c) => {
    const override = castingOverrides[`${tid}:${c._id}`]
    return override ? { ...c, ...override } : c
  })
}

export const getCastings = async (tenantId?: string | null): Promise<Casting[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  const seed = (seedCastings as Casting[]).filter((c) => c.tenantId === id)
  const created = createdCastings.filter((c) => c.tenantId === id)
  return [...created, ...applyOverrides(seed, id)]
}

export interface CastingsFilterParams {
  status?: string
  dateFrom?: string
  dateTo?: string
}

export const getCastingsWithFilters = async (
  tenantId?: string | null,
  params?: CastingsFilterParams
): Promise<Casting[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  const seed = (seedCastings as Casting[]).filter((c) => c.tenantId === id)
  const created = createdCastings.filter((c) => c.tenantId === id)
  let list = [...created, ...applyOverrides(seed, id)]

  if (params?.status) {
    list = list.filter((c) => c.status === params.status)
  }
  if (params?.dateFrom) {
    const from = new Date(params.dateFrom).getTime()
    list = list.filter((c) => new Date(c.deadline).getTime() >= from)
  }
  if (params?.dateTo) {
    const to = new Date(params.dateTo).getTime()
    list = list.filter((c) => new Date(c.deadline).getTime() <= to)
  }

  return list
}

export const getCastingById = async (castingId: string, tenantId?: string | null): Promise<Casting | null> => {
  await delay(100)
  const tid = tenantId || "tenant_001"
  const fromCreated = createdCastings.find((x) => x._id === castingId && x.tenantId === tid)
  if (fromCreated) return fromCreated
  const c = (seedCastings as Casting[]).find((x) => x._id === castingId && x.tenantId === tid)
  if (!c) return null
  const override = castingOverrides[`${tid}:${castingId}`]
  return override ? { ...c, ...override } : c
}

export const getCastingSubmissions = async (castingId: string, tenantId?: string | null): Promise<(CastingSubmission & { talentName?: string })[]> => {
  await delay(120)
  const tid = tenantId || "tenant_001"
  const subs = (seedCastingSubmissions as CastingSubmission[]).filter((s) => s.castingId === castingId && s.tenantId === tid)
  const talents = seedTalents as { _id: string; stageName: string; height?: string; location?: string }[]
  return subs.map((s) => {
    const t = talents.find((x) => x._id === s.talentId)
    return { ...s, talentName: t?.stageName ?? s.talentId }
  })
}

/** Shortlisted talent for client viewer room (B2) */
export const getShortlistedByCasting = async (
  castingId: string,
  tenantId?: string | null
): Promise<(CastingSubmission & { talentName?: string; height?: string; location?: string })[]> => {
  await delay(120)
  const all = await getCastingSubmissions(castingId, tenantId)
  const shortlisted = all.filter((s) => s.status === "SHORTLISTED")
  const talents = seedTalents as { _id: string; stageName: string; height?: string; location?: string }[]
  return shortlisted.map((s) => {
    const t = talents.find((x) => x._id === s.talentId)
    return {
      ...s,
      talentName: t?.stageName ?? s.talentId,
      height: t?.height,
      location: t?.location,
    }
  })
}

export const getHolds = async (castingId: string, tenantId?: string | null): Promise<(Hold & { talentName?: string })[]> => {
  await delay(100)
  const tid = tenantId || "tenant_001"
  const holds = (seedHolds as Hold[]).filter((h) => h.castingId === castingId && h.tenantId === tid)
  const talents = seedTalents as { _id: string; stageName: string }[]
  return holds.map((h) => {
    const t = talents.find((x) => x._id === h.talentId)
    return { ...h, talentName: t?.stageName ?? h.talentId }
  })
}

/** Mock: shortlist selected submissions */
export const shortlistSubmissions = async (
  castingId: string,
  submissionIds: string[],
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
  // Mock – no persistence; caller should refetch
}

/** Mock: reject selected submissions */
export const rejectSubmissions = async (
  castingId: string,
  submissionIds: string[],
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
  // Mock – no persistence; caller should refetch
}

/** Mock: add hold */
export const addHold = async (
  castingId: string,
  talentId: string,
  fromTs: string,
  toTs: string,
  tenantId?: string | null
): Promise<Hold & { talentName?: string }> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const talents = seedTalents as { _id: string; stageName: string }[]
  const t = talents.find((x) => x._id === talentId)
  return {
    _id: `hold_${Date.now()}`,
    tenantId: tid,
    castingId,
    talentId,
    fromTs,
    toTs,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    talentName: t?.stageName ?? talentId,
  }
}

/** Mock: remove hold */
export const removeHold = async (holdId: string, tenantId?: string | null): Promise<void> => {
  await delay(150)
  // Mock – no persistence; caller should refetch
}

/** Mock: publish casting */
export const publishCasting = async (castingId: string, tenantId?: string | null): Promise<void> => {
  await delay(200)
  // Mock – no persistence
}

/** Mock: close casting */
export const closeCasting = async (castingId: string, tenantId?: string | null): Promise<void> => {
  await delay(200)
  // Mock – no persistence
}

export interface CreateCastingParams {
  title: string
  client?: string
  type?: string
  description?: string
  deadline?: string
}

/** Mock: create casting – stored in-memory for session */
export const createCasting = async (
  params: CreateCastingParams,
  tenantId?: string | null
): Promise<Casting | null> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const deadline = params.deadline
    ? new Date(params.deadline).toISOString().replace("T00:00:00", "T18:00:00")
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const casting: Casting = {
    _id: `casting_new_${Date.now()}`,
    tenantId: tid,
    title: params.title,
    client: params.client ?? "",
    type: params.type ?? "FASHION",
    status: "OPEN",
    deadline,
    submissionsCount: 0,
    shortlistedCount: 0,
    description: params.description,
  }
  createdCastings.push(casting)
  return casting
}

export interface UpdateCastingParams {
  title?: string
  client?: string
  type?: string
  status?: string
  description?: string
  deadline?: string
}

/** Mock: update casting – updates in-memory or returns false for seed castings */
export const updateCasting = async (
  castingId: string,
  params: UpdateCastingParams,
  tenantId?: string | null
): Promise<Casting | null> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const idx = createdCastings.findIndex((c) => c._id === castingId && c.tenantId === tid)
  if (idx >= 0) {
    const existing = createdCastings[idx]
    createdCastings[idx] = {
      ...existing,
      title: params.title ?? existing.title,
      client: params.client ?? existing.client,
      type: params.type ?? existing.type,
      status: params.status ?? existing.status,
      description: params.description ?? existing.description,
      deadline: params.deadline
        ? new Date(params.deadline).toISOString().replace("T00:00:00", "T18:00:00")
        : existing.deadline,
    }
    return createdCastings[idx]
  }
  // Seed castings: store override for getCastingById
  const seed = (seedCastings as Casting[]).find((c) => c._id === castingId && c.tenantId === tid)
  if (seed) {
    const key = `${tid}:${castingId}`
    const updated: Partial<Casting> = {
      title: params.title ?? seed.title,
      client: params.client ?? seed.client,
      type: params.type ?? seed.type,
      status: params.status ?? seed.status,
      description: params.description ?? seed.description,
      deadline: params.deadline
        ? new Date(params.deadline).toISOString().replace("T00:00:00", "T18:00:00")
        : seed.deadline,
    }
    castingOverrides[key] = { ...castingOverrides[key], ...updated }
    return { ...seed, ...castingOverrides[key] }
  }
  return null
}
