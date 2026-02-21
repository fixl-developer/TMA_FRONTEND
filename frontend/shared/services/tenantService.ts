/**
 * Tenant Service - Super Admin
 *
 * Mock service for tenant-related operations in the Super Admin app.
 * Uses local seed data and simulates API latency.
 * Runtime tenants (from signup or Super Admin create) persist in localStorage.
 */

import { seedTenants } from "@/data/seed"
import type { Tenant } from "@/shared/lib/types/tenants"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const STORAGE_KEY = "talentos_runtime_tenants"
const SESSION_TENANT_IDS_KEY = "talentos_session_tenant_ids"
const TENANTS_UPDATED_EVENT = "talentos_tenants_updated"
const COMPLIANCE_OVERRIDES_KEY = "talentos_tenant_compliance_overrides"
const BLUEPRINT_OVERRIDES_KEY = "talentos_tenant_blueprint_overrides"
const GROUP_POLICY_OVERRIDES_KEY = "talentos_group_policy_overrides"

// In-memory overrides for tenant status (suspend/activate - persists until refresh)
const tenantStatusOverrides: Record<string, Tenant["status"]> = {}

interface TenantComplianceState {
  kycVerified: boolean
  agencyVerified: boolean
  payoutsEnabled: boolean
}

interface TenantBlueprintState {
  blueprints: string[]
  enabledBlueprints: string[]
  approvedBlueprints: string[]
  requestedBlueprints: string[]
  blueprintApprovalLog: BlueprintApprovalLogEntry[]
}

type GroupPolicyPack = Record<string, any>

function getComplianceOverridesSync(): Record<string, TenantComplianceState> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(COMPLIANCE_OVERRIDES_KEY)
    if (!s) return {}
    return JSON.parse(s) as Record<string, TenantComplianceState>
  } catch {
    return {}
  }
}

function saveComplianceOverrides(overrides: Record<string, TenantComplianceState>) {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPLIANCE_OVERRIDES_KEY, JSON.stringify(overrides))
}

function getBlueprintOverridesSync(): Record<string, TenantBlueprintState> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(BLUEPRINT_OVERRIDES_KEY)
    if (!s) return {}
    return JSON.parse(s) as Record<string, TenantBlueprintState>
  } catch {
    return {}
  }
}

function saveBlueprintOverrides(overrides: Record<string, TenantBlueprintState>) {
  if (typeof window === "undefined") return
  localStorage.setItem(BLUEPRINT_OVERRIDES_KEY, JSON.stringify(overrides))
}

function getGroupPolicyOverridesSync(): Record<string, GroupPolicyPack> {
  if (typeof window === "undefined") return {}
  try {
    const s = localStorage.getItem(GROUP_POLICY_OVERRIDES_KEY)
    if (!s) return {}
    return JSON.parse(s) as Record<string, GroupPolicyPack>
  } catch {
    return {}
  }
}

function saveGroupPolicyOverrides(overrides: Record<string, GroupPolicyPack>) {
  if (typeof window === "undefined") return
  localStorage.setItem(GROUP_POLICY_OVERRIDES_KEY, JSON.stringify(overrides))
}

const DEMO_SEED_COMPLIANCE: Record<string, TenantComplianceState> = {
  tenant_001: { kycVerified: true, agencyVerified: true, payoutsEnabled: false },
  tenant_002: { kycVerified: false, agencyVerified: true, payoutsEnabled: false },
  tenant_005: { kycVerified: true, agencyVerified: false, payoutsEnabled: false },
}

const DEMO_SEED_REQUESTS: Record<string, string[]> = {
  tenant_001: ["B7"],
  tenant_002: ["B4"],
  tenant_005: ["B10"],
}

function getRuntimeTenantsSync(): Tenant[] {
  if (typeof window === "undefined") return []
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return []
    return JSON.parse(s) as Tenant[]
  } catch {
    return []
  }
}

function saveRuntimeTenants(tenants: Tenant[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants))
  window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
}

/** Add tenant ID to session so current user can access it (e.g. after signup) */
export function addSessionTenantId(tenantId: string) {
  if (typeof window === "undefined") return
  const ids = (() => {
    try {
      const s = sessionStorage.getItem(SESSION_TENANT_IDS_KEY)
      return s ? JSON.parse(s) as string[] : []
    } catch {
      return []
    }
  })()
  if (!ids.includes(tenantId)) {
    ids.push(tenantId)
    sessionStorage.setItem(SESSION_TENANT_IDS_KEY, JSON.stringify(ids))
  }
}

/** Get session tenant IDs (for signup flow) */
export function getSessionTenantIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const s = sessionStorage.getItem(SESSION_TENANT_IDS_KEY)
    return s ? (JSON.parse(s) as string[]) : []
  } catch {
    return []
  }
}

export const getTenants = async (): Promise<Tenant[]> => {
  await delay(200)
  const seed = seedTenants as Tenant[]
  const runtime = getRuntimeTenantsSync()
  const seedIds = new Set(seed.map((t) => t._id))
  const complianceOverrides = getComplianceOverridesSync()
  const blueprintOverrides = getBlueprintOverridesSync()
  const groupPolicyOverrides = getGroupPolicyOverridesSync()
  const all = [...seed, ...runtime]
  return all.map((t) => {
    const override = tenantStatusOverrides[t._id]
    const statusApplied = override ? { ...t, status: override } : t
    const isSeedTenant = seedIds.has(t._id)
    const compliance =
      complianceOverrides[t._id] ??
      ((statusApplied.settings as any)?.compliance as TenantComplianceState | undefined) ??
      (isSeedTenant ? DEMO_SEED_COMPLIANCE[t._id] : undefined)
    const blueprintOverride = blueprintOverrides[t._id]
    const defaultRequested = isSeedTenant ? DEMO_SEED_REQUESTS[t._id] ?? [] : []
    const requestedBlueprints =
      blueprintOverride?.requestedBlueprints ??
      ((statusApplied.requestedBlueprints as string[] | undefined) ?? defaultRequested)
    const approvedBlueprints =
      blueprintOverride?.approvedBlueprints ??
      ((statusApplied.approvedBlueprints as string[] | undefined) ??
        (statusApplied.blueprints as string[] | undefined) ??
        [])
    const enabledBlueprints =
      blueprintOverride?.enabledBlueprints ??
      ((statusApplied.enabledBlueprints as string[] | undefined) ??
        Array.from(new Set([...approvedBlueprints, ...requestedBlueprints])))
    const blueprints = blueprintOverride?.blueprints ?? approvedBlueprints
    const existingLog = (((statusApplied.settings as any)?.blueprintApprovalLog as BlueprintApprovalLogEntry[] | undefined) ??
      [])
    const seededRequestLog: BlueprintApprovalLogEntry[] = isSeedTenant
      ? defaultRequested.map((blueprintId) => ({
          id: `${statusApplied._id}_${blueprintId}_seed_requested`,
          blueprintId,
          action: "REQUESTED",
          reason: "Seeded request for enterprise workflow demo",
          actor: "seed@talentos.io",
          at: "2026-02-01T10:00:00.000Z",
        }))
      : []
    const approvalLog =
      blueprintOverride?.blueprintApprovalLog ??
      (existingLog.length > 0 ? existingLog : seededRequestLog)

    return {
      ...statusApplied,
      blueprints,
      approvedBlueprints,
      enabledBlueprints,
      requestedBlueprints,
      settings: {
        ...(statusApplied.settings || {}),
        ...(compliance ? { compliance } : {}),
        ...(groupPolicyOverrides[t._id]
          ? { groupPolicyPack: groupPolicyOverrides[t._id] }
          : {}),
        blueprintApprovalLog: approvalLog,
      },
    }
  })
}

/** Sync version for contexts that need it (merges seed + runtime) */
export function getTenantsSync(): Tenant[] {
  const seed = seedTenants as Tenant[]
  const runtime = getRuntimeTenantsSync()
  const seedIds = new Set(seed.map((t) => t._id))
  const complianceOverrides = getComplianceOverridesSync()
  const blueprintOverrides = getBlueprintOverridesSync()
  const groupPolicyOverrides = getGroupPolicyOverridesSync()
  const all = [...seed, ...runtime]
  return all.map((t) => {
    const override = tenantStatusOverrides[t._id]
    const statusApplied = override ? { ...t, status: override } : t
    const isSeedTenant = seedIds.has(t._id)
    const compliance =
      complianceOverrides[t._id] ??
      ((statusApplied.settings as any)?.compliance as TenantComplianceState | undefined) ??
      (isSeedTenant ? DEMO_SEED_COMPLIANCE[t._id] : undefined)
    const blueprintOverride = blueprintOverrides[t._id]
    const defaultRequested = isSeedTenant ? DEMO_SEED_REQUESTS[t._id] ?? [] : []
    const requestedBlueprints =
      blueprintOverride?.requestedBlueprints ??
      ((statusApplied.requestedBlueprints as string[] | undefined) ?? defaultRequested)
    const approvedBlueprints =
      blueprintOverride?.approvedBlueprints ??
      ((statusApplied.approvedBlueprints as string[] | undefined) ??
        (statusApplied.blueprints as string[] | undefined) ??
        [])
    const enabledBlueprints =
      blueprintOverride?.enabledBlueprints ??
      ((statusApplied.enabledBlueprints as string[] | undefined) ??
        Array.from(new Set([...approvedBlueprints, ...requestedBlueprints])))
    const blueprints = blueprintOverride?.blueprints ?? approvedBlueprints
    const existingLog = (((statusApplied.settings as any)?.blueprintApprovalLog as BlueprintApprovalLogEntry[] | undefined) ??
      [])
    const seededRequestLog: BlueprintApprovalLogEntry[] = isSeedTenant
      ? defaultRequested.map((blueprintId) => ({
          id: `${statusApplied._id}_${blueprintId}_seed_requested`,
          blueprintId,
          action: "REQUESTED",
          reason: "Seeded request for enterprise workflow demo",
          actor: "seed@talentos.io",
          at: "2026-02-01T10:00:00.000Z",
        }))
      : []
    const approvalLog =
      blueprintOverride?.blueprintApprovalLog ??
      (existingLog.length > 0 ? existingLog : seededRequestLog)

    return {
      ...statusApplied,
      blueprints,
      approvedBlueprints,
      enabledBlueprints,
      requestedBlueprints,
      settings: {
        ...(statusApplied.settings || {}),
        ...(compliance ? { compliance } : {}),
        ...(groupPolicyOverrides[t._id]
          ? { groupPolicyPack: groupPolicyOverrides[t._id] }
          : {}),
        blueprintApprovalLog: approvalLog,
      },
    }
  })
}

export interface CreateTenantPayload {
  name: string
  type: Tenant["type"]
  agencyType?: string
  blueprints?: string[]
  enabledBlueprints?: string[]
  approvedBlueprints?: string[]
  requestedBlueprints?: string[]
  slug?: string
  ownerName?: string
  ownerEmail?: string
  subdomain?: string
  countryCode?: string
  timezone?: string
}

interface BlueprintApprovalLogEntry {
  id: string
  blueprintId: string
  action: "REQUESTED" | "REVIEWED" | "APPROVED"
  reason: string
  actor: string
  at: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Mock: create tenant (self-serve signup or Super Admin) */
export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  await delay(300)
  const runtime = getRuntimeTenantsSync()
  const slug = payload.slug?.trim() || slugify(payload.name) || "org"
  const baseId = `tenant_${String(24 + runtime.length).padStart(3, "0")}`
  let tenantId = baseId
  let suffix = 0
  while (runtime.some((t) => t._id === tenantId) || (seedTenants as Tenant[]).some((t: Tenant) => t._id === tenantId)) {
    suffix++
    tenantId = `${baseId}_${suffix}`
  }

  const approvedBlueprints = payload.approvedBlueprints ?? payload.blueprints ?? []
  const enabledBlueprints = payload.enabledBlueprints ?? payload.blueprints ?? approvedBlueprints
  const requestedBlueprints = payload.requestedBlueprints ?? []
  const nowIso = new Date().toISOString()
  const approvalLog: BlueprintApprovalLogEntry[] = requestedBlueprints.map((blueprintId) => ({
    id: `${tenantId}_${blueprintId}_requested`,
    blueprintId,
    action: "REQUESTED",
    reason: "Requested during signup flow",
    actor: payload.ownerEmail || "founder@tenant",
    at: nowIso,
  }))

  const tenant: Tenant = {
    _id: tenantId,
    name: payload.name,
    type: payload.type,
    slug: slug || tenantId,
    status: "PENDING",
    agencyType: payload.agencyType as Tenant["agencyType"],
    blueprints: approvedBlueprints,
    enabledBlueprints,
    approvedBlueprints,
    requestedBlueprints,
    email: payload.ownerEmail,
    countryCode: payload.countryCode || "IN",
    timezone: payload.timezone || "Asia/Kolkata",
    settings: {
      ...(payload.subdomain ? { subdomain: payload.subdomain } : {}),
      compliance: {
        kycVerified: false,
        agencyVerified: false,
        payoutsEnabled: false,
      },
      blueprintApprovalLog: approvalLog,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  runtime.push(tenant)
  saveRuntimeTenants(runtime)
  return tenant
}

/** Mock: approve pending blueprint for tenant */
export async function approveTenantBlueprint(
  tenantId: string,
  blueprintId: string,
  reason: string,
  actor = "superadmin@talentos.io"
): Promise<Tenant | null> {
  await delay(200)
  if (!reason.trim()) return null
  const allTenants = getTenantsSync()
  const current = allTenants.find((t) => t._id === tenantId)
  if (!current) return null

  const requested = new Set((current.requestedBlueprints as string[] | undefined) ?? [])
  if (!requested.has(blueprintId)) return current

  requested.delete(blueprintId)
  const approved = new Set((current.approvedBlueprints as string[] | undefined) ?? (current.blueprints as string[] | undefined) ?? [])
  approved.add(blueprintId)
  const enabled = new Set((current.enabledBlueprints as string[] | undefined) ?? [])
  enabled.add(blueprintId)
  const existingLog = ((current.settings as any)?.blueprintApprovalLog as BlueprintApprovalLogEntry[] | undefined) ?? []
  const approvalEntry: BlueprintApprovalLogEntry = {
    id: `${current._id}_${blueprintId}_${Date.now()}`,
    blueprintId,
    action: "APPROVED",
    reason: reason.trim(),
    actor,
    at: new Date().toISOString(),
  }

  const updatedState: TenantBlueprintState = {
    approvedBlueprints: Array.from(approved),
    blueprints: Array.from(approved),
    enabledBlueprints: Array.from(enabled),
    requestedBlueprints: Array.from(requested),
    blueprintApprovalLog: [...existingLog, approvalEntry],
  }

  const runtime = getRuntimeTenantsSync()
  const runtimeIdx = runtime.findIndex((t) => t._id === tenantId)
  if (runtimeIdx >= 0) {
    const tenant = runtime[runtimeIdx]
    const updated: Tenant = {
      ...tenant,
      approvedBlueprints: updatedState.approvedBlueprints,
      blueprints: updatedState.blueprints,
      enabledBlueprints: updatedState.enabledBlueprints,
      requestedBlueprints: updatedState.requestedBlueprints,
      settings: {
        ...(tenant.settings || {}),
        blueprintApprovalLog: updatedState.blueprintApprovalLog,
      },
      updatedAt: new Date(),
    }
    runtime[runtimeIdx] = updated
    saveRuntimeTenants(runtime)
    return updated
  }

  const blueprintOverrides = getBlueprintOverridesSync()
  blueprintOverrides[tenantId] = updatedState
  saveBlueprintOverrides(blueprintOverrides)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
  }
  const refreshed = getTenantsSync().find((t) => t._id === tenantId)
  return refreshed ?? {
    ...current,
    approvedBlueprints: updatedState.approvedBlueprints,
    blueprints: updatedState.blueprints,
    enabledBlueprints: updatedState.enabledBlueprints,
    requestedBlueprints: updatedState.requestedBlueprints,
    settings: {
      ...(current.settings || {}),
      blueprintApprovalLog: updatedState.blueprintApprovalLog,
    },
    updatedAt: new Date(),
  }
}

/** Mock: reviewer marks request as checked (maker-checker stage 1). */
export async function markTenantBlueprintReviewed(
  tenantId: string,
  blueprintId: string,
  reason: string,
  actor = "compliance.reviewer@talentos.io"
): Promise<Tenant | null> {
  await delay(180)
  if (!reason.trim()) return null
  const allTenants = getTenantsSync()
  const current = allTenants.find((t) => t._id === tenantId)
  if (!current) return null

  const requested = new Set((current.requestedBlueprints as string[] | undefined) ?? [])
  if (!requested.has(blueprintId)) return current

  const existingLog = ((current.settings as any)?.blueprintApprovalLog as BlueprintApprovalLogEntry[] | undefined) ?? []
  const reviewEntry: BlueprintApprovalLogEntry = {
    id: `${current._id}_${blueprintId}_${Date.now()}_reviewed`,
    blueprintId,
    action: "REVIEWED",
    reason: reason.trim(),
    actor,
    at: new Date().toISOString(),
  }

  const currentState: TenantBlueprintState = {
    approvedBlueprints:
      (current.approvedBlueprints as string[] | undefined) ??
      (current.blueprints as string[] | undefined) ??
      [],
    blueprints:
      (current.blueprints as string[] | undefined) ??
      (current.approvedBlueprints as string[] | undefined) ??
      [],
    enabledBlueprints:
      (current.enabledBlueprints as string[] | undefined) ??
      Array.from(
        new Set([
          ...((current.approvedBlueprints as string[] | undefined) ?? []),
          ...Array.from(requested),
        ])
      ),
    requestedBlueprints: Array.from(requested),
    blueprintApprovalLog: [...existingLog, reviewEntry],
  }

  const runtime = getRuntimeTenantsSync()
  const runtimeIdx = runtime.findIndex((t) => t._id === tenantId)
  if (runtimeIdx >= 0) {
    const tenant = runtime[runtimeIdx]
    const updated: Tenant = {
      ...tenant,
      approvedBlueprints: currentState.approvedBlueprints,
      blueprints: currentState.blueprints,
      enabledBlueprints: currentState.enabledBlueprints,
      requestedBlueprints: currentState.requestedBlueprints,
      settings: {
        ...(tenant.settings || {}),
        blueprintApprovalLog: currentState.blueprintApprovalLog,
      },
      updatedAt: new Date(),
    }
    runtime[runtimeIdx] = updated
    saveRuntimeTenants(runtime)
    return updated
  }

  const blueprintOverrides = getBlueprintOverridesSync()
  blueprintOverrides[tenantId] = currentState
  saveBlueprintOverrides(blueprintOverrides)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
  }
  const refreshed = getTenantsSync().find((t) => t._id === tenantId)
  return refreshed ?? {
    ...current,
    approvedBlueprints: currentState.approvedBlueprints,
    blueprints: currentState.blueprints,
    enabledBlueprints: currentState.enabledBlueprints,
    requestedBlueprints: currentState.requestedBlueprints,
    settings: {
      ...(current.settings || {}),
      blueprintApprovalLog: currentState.blueprintApprovalLog,
    },
    updatedAt: new Date(),
  }
}

/** Mock: update compliance controls for a tenant (seed/runtime). */
export async function updateTenantCompliance(
  tenantId: string,
  compliance: TenantComplianceState
): Promise<Tenant | null> {
  await delay(180)
  const runtime = getRuntimeTenantsSync()
  const runtimeIdx = runtime.findIndex((t) => t._id === tenantId)
  if (runtimeIdx >= 0) {
    const tenant = runtime[runtimeIdx]
    const updated: Tenant = {
      ...tenant,
      settings: {
        ...(tenant.settings || {}),
        compliance,
      },
      updatedAt: new Date(),
    }
    runtime[runtimeIdx] = updated
    saveRuntimeTenants(runtime)
    return updated
  }

  // Seed tenants are immutable; persist override separately for UI-only behavior.
  const complianceOverrides = getComplianceOverridesSync()
  complianceOverrides[tenantId] = compliance
  saveComplianceOverrides(complianceOverrides)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
  }

  const seedTenant = (seedTenants as Tenant[]).find((t) => t._id === tenantId)
  if (!seedTenant) return null
  return {
    ...seedTenant,
    settings: {
      ...(seedTenant.settings || {}),
      compliance,
    },
  }
}

/** Mock: update B10 group policy pack (seed/runtime). */
export async function updateTenantGroupPolicyPack(
  tenantId: string,
  policyPack: GroupPolicyPack
): Promise<Tenant | null> {
  await delay(180)
  const runtime = getRuntimeTenantsSync()
  const runtimeIdx = runtime.findIndex((t) => t._id === tenantId)
  if (runtimeIdx >= 0) {
    const tenant = runtime[runtimeIdx]
    const updated: Tenant = {
      ...tenant,
      settings: {
        ...(tenant.settings || {}),
        groupPolicyPack: policyPack,
      },
      updatedAt: new Date(),
    }
    runtime[runtimeIdx] = updated
    saveRuntimeTenants(runtime)
    return updated
  }

  const overrides = getGroupPolicyOverridesSync()
  overrides[tenantId] = policyPack
  saveGroupPolicyOverrides(overrides)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
  }

  const seedTenant = (seedTenants as Tenant[]).find((t) => t._id === tenantId)
  if (!seedTenant) return null
  return {
    ...seedTenant,
    settings: {
      ...(seedTenant.settings || {}),
      groupPolicyPack: policyPack,
    },
  }
}

/** Mock: reject/remove pending tenant */
export async function rejectTenant(tenantId: string): Promise<void> {
  await delay(200)
  const runtime = getRuntimeTenantsSync().filter((t) => t._id !== tenantId)
  saveRuntimeTenants(runtime)
}

/** Mock: suspend tenant */
export const suspendTenant = async (tenantId: string): Promise<void> => {
  await delay(200)
  tenantStatusOverrides[tenantId] = "SUSPENDED"
}

/** Mock: activate tenant */
export const activateTenant = async (tenantId: string): Promise<void> => {
  await delay(200)
  tenantStatusOverrides[tenantId] = "ACTIVE"
}

/** Reset demo-only overrides while keeping seed data intact. */
export function resetTenantDemoOverrides(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(COMPLIANCE_OVERRIDES_KEY)
  localStorage.removeItem(BLUEPRINT_OVERRIDES_KEY)
  localStorage.removeItem(GROUP_POLICY_OVERRIDES_KEY)
  Object.keys(tenantStatusOverrides).forEach((key) => {
    delete tenantStatusOverrides[key]
  })
  window.dispatchEvent(new CustomEvent(TENANTS_UPDATED_EVENT))
}

/** Subscribe to tenant list updates (e.g. when new tenant created) */
export function onTenantsUpdated(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => callback()
  window.addEventListener(TENANTS_UPDATED_EVENT, handler)
  return () => window.removeEventListener(TENANTS_UPDATED_EVENT, handler)
}

