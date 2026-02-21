/**
 * Talent Service - Modelling / Talent CRM
 *
 * Mock service for talent operations. Tenant-scoped.
 */

import { seedTalents, seedTalentTags, seedAssets, seedTalentAvailability } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Talent {
  _id: string
  tenantId: string
  userId?: string
  stageName: string
  status?: string
  tagIds?: string[]
  email?: string
  phone?: string
  height?: string
  measurements?: Record<string, string>
  location?: string
  createdAt?: string
}

export interface TalentTag {
  _id: string
  tenantId: string
  name: string
}

export interface Asset {
  _id: string
  tenantId: string
  talentId: string
  kind: string
  url: string
  status: string
  createdAt?: string
}

export const getTalents = async (tenantId?: string | null): Promise<Talent[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  return (seedTalents as Talent[]).filter((t) => t.tenantId === id)
}

export const getTalentById = async (talentId: string, tenantId?: string | null): Promise<Talent | null> => {
  await delay(100)
  const tid = tenantId || "tenant_001"
  const t = (seedTalents as Talent[]).find((x) => x._id === talentId && x.tenantId === tid)
  return t ?? null
}

export const getTalentTags = async (tenantId?: string | null): Promise<TalentTag[]> => {
  await delay(80)
  const id = tenantId || "tenant_001"
  return (seedTalentTags as TalentTag[]).filter((t) => t.tenantId === id)
}

export const getTalentAssets = async (talentId: string, tenantId?: string | null): Promise<Asset[]> => {
  await delay(100)
  const id = tenantId || "tenant_001"
  return (seedAssets as Asset[]).filter((a) => a.talentId === talentId && a.tenantId === id)
}

export interface TalentAvailability {
  _id: string
  talentId: string
  from: string
  to: string
  status: string
  notes?: string
}

export const getTalentAvailability = async (talentId: string): Promise<TalentAvailability[]> => {
  await delay(80)
  return (seedTalentAvailability as TalentAvailability[]).filter((a) => a.talentId === talentId)
}

export const getTalentsWithFilters = async (
  tenantId?: string | null,
  filters?: { status?: string; tagId?: string }
): Promise<Talent[]> => {
  await delay(150)
  const id = tenantId || "tenant_001"
  let list = (seedTalents as Talent[]).filter((t) => t.tenantId === id)
  if (filters?.status) {
    list = list.filter((t) => (t.status ?? "ACTIVE") === filters.status)
  }
  if (filters?.tagId) {
    list = list.filter((t) => t.tagIds?.includes(filters.tagId!))
  }
  return list
}
