/**
 * Invitation Service - Mock
 *
 * Persists invitations to localStorage for demo.
 * Merges with seed invitations.
 */

import { seedInvitations } from "@/data/seed"

const STORAGE_KEY = "talentos_runtime_invitations"
const SEED_OVERRIDE_KEY = "talentos_seed_invitation_overrides"

function getRuntimeInvitations(): any[] {
  if (typeof window === "undefined") return []
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : []
  } catch {
    return []
  }
}

function saveRuntimeInvitations(invitations: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations))
}

function getSeedInvitationOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(SEED_OVERRIDE_KEY)
    return s ? JSON.parse(s) : {}
  } catch {
    return {}
  }
}

function saveSeedInvitationOverrides(overrides: Record<string, any>) {
  if (typeof window === "undefined") return
  localStorage.setItem(SEED_OVERRIDE_KEY, JSON.stringify(overrides))
}

function getMergedInvitations(): any[] {
  const seed = seedInvitations as any[]
  const runtime = getRuntimeInvitations()
  const overrides = getSeedInvitationOverrides()
  const seedResolved = seed.map((invite) =>
    overrides[invite._id] ? { ...invite, ...overrides[invite._id] } : invite
  )
  return [...seedResolved, ...runtime]
}

function updateInvitationRecord(inviteId: string, patch: Record<string, any>): boolean {
  const runtime = getRuntimeInvitations()
  const runtimeIdx = runtime.findIndex((i) => i._id === inviteId)
  if (runtimeIdx >= 0) {
    runtime[runtimeIdx] = { ...runtime[runtimeIdx], ...patch }
    saveRuntimeInvitations(runtime)
    return true
  }

  const seed = seedInvitations as any[]
  const seedExists = seed.some((i) => i._id === inviteId)
  if (!seedExists) return false
  const overrides = getSeedInvitationOverrides()
  overrides[inviteId] = { ...(overrides[inviteId] || {}), ...patch }
  saveSeedInvitationOverrides(overrides)
  return true
}

export async function getInvitationsByTenant(tenantId: string): Promise<any[]> {
  return getMergedInvitations().filter((i) => i.tenantId === tenantId)
}

export async function inviteUser(
  tenantId: string,
  email: string,
  roleId: string,
  invitedByEmail?: string
): Promise<any> {
  const runtime = getRuntimeInvitations()
  const id = `inv_${Date.now()}`
  const invite = {
    _id: id,
    tenantId,
    email: email.trim().toLowerCase(),
    roleId,
    invitedByEmail: invitedByEmail?.trim().toLowerCase() || undefined,
    status: "PENDING",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  }
  runtime.push(invite)
  saveRuntimeInvitations(runtime)
  return invite
}

export interface BulkInviteRow {
  email: string
  roleId: string
}

export interface BulkInviteResult {
  success: number
  failed: number
  invitations: any[]
  errors: { email: string; reason: string }[]
}

export async function inviteUsersBulk(
  tenantId: string,
  rows: BulkInviteRow[],
  invitedByEmail?: string,
  existingUserEmails?: string[]
): Promise<BulkInviteResult> {
  const runtime = getRuntimeInvitations()
  const existingEmails = new Set(
    (runtime as any[]).map((i) => i.email?.toLowerCase()).filter(Boolean)
  )
  const seed = seedInvitations as any[]
  seed.forEach((i) => {
    if (i.email) existingEmails.add(i.email.toLowerCase())
  })
  ;(existingUserEmails || []).forEach((e) => {
    if (e) existingEmails.add(e.toLowerCase())
  })
  const invitations: any[] = []
  const errors: { email: string; reason: string }[] = []

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase()
    if (!email) continue
    if (existingEmails.has(email)) {
      errors.push({ email, reason: "Already invited or user exists" })
      continue
    }
    const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const invite = {
      _id: id,
      tenantId,
      email,
      roleId: row.roleId || "",
      invitedByEmail: invitedByEmail?.trim().toLowerCase() || undefined,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }
    runtime.push(invite)
    invitations.push(invite)
    existingEmails.add(email)
  }

  saveRuntimeInvitations(runtime)
  return {
    success: invitations.length,
    failed: errors.length,
    invitations,
    errors,
  }
}

export async function getInvitationByToken(token: string): Promise<any | null> {
  // For demo, token is the invite ID
  const all = getMergedInvitations()
  return all.find((i) => i._id === token) ?? null
}

export async function acceptInvitation(inviteId: string): Promise<boolean> {
  return updateInvitationRecord(inviteId, {
    status: "ACCEPTED",
    acceptedAt: new Date().toISOString(),
  })
}

export async function cancelInvitation(inviteId: string): Promise<boolean> {
  return updateInvitationRecord(inviteId, {
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
  })
}

export async function resendInvitation(inviteId: string): Promise<boolean> {
  return updateInvitationRecord(inviteId, {
    status: "PENDING",
    resentAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })
}
