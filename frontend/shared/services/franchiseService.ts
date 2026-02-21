/**
 * Franchise Service – Branches, templates, policy lock
 * Phase 36. Seed data only.
 */

import { seedBranches, seedFranchiseTemplates } from "@/data/seed"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface Branch {
  _id: string
  tenantId: string
  templateId: string
  name: string
  code: string
  city: string
  region: string
  country: string
  status: "ACTIVE" | "PENDING" | "INACTIVE"
  policyLock: { canCustomizeBranding: boolean; canOverridePricing: boolean; canAddLocalEvents: boolean }
  eventsCount?: number
  createdAt?: string
}

export interface FranchiseTemplate {
  _id: string
  tenantId: string
  name: string
  description: string
  includes: string[]
  policyDefaults: Record<string, boolean>
  branchesCount?: number
  createdAt?: string
}

export async function getBranches(tenantId: string): Promise<Branch[]> {
  await delay(100)
  return (seedBranches as Branch[]).filter((b) => b.tenantId === tenantId)
}

export async function getBranchById(id: string, tenantId: string): Promise<Branch | null> {
  await delay(80)
  const b = (seedBranches as Branch[]).find((x) => x._id === id && x.tenantId === tenantId)
  return b ?? null
}

export async function getFranchiseTemplates(tenantId: string): Promise<FranchiseTemplate[]> {
  await delay(100)
  return (seedFranchiseTemplates as FranchiseTemplate[]).filter((t) => t.tenantId === tenantId)
}
