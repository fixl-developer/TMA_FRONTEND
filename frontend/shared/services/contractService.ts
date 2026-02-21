/**
 * Contract Service (CLM) - Contract Lifecycle Management
 *
 * Contracts, templates, clauses, obligations, e-sign.
 * UI-only with seed data.
 */

import {
  seedContracts,
  seedContractTemplates,
  seedClauses,
  seedContractSigners,
  seedObligations,
} from "@/data/seed"

const DEFAULT_TENANT = "tenant_001"
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const contractOverrides: Record<string, any> = {}
const signerOverrides: Record<string, any> = {}

function resolveTenant(tenantId?: string | null) {
  return tenantId ?? DEFAULT_TENANT
}

export interface Contract {
  _id: string
  tenantId: string
  talentId?: string
  bookingId?: string
  templateId?: string
  clientName?: string
  projectName: string
  status: string
  signedAt?: string | null
  amountMinor: number
  currency: string
  createdByUserId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface ContractSigner {
  _id: string
  tenantId: string
  contractId: string
  role: string
  status: string
  signedAt?: string | null
  order?: number
  signerName?: string
  [key: string]: any
}

function mergeContract(contract: any): Contract {
  return { ...contract, ...(contractOverrides[contract._id] ?? {}) }
}

function mergeSigner(signer: any): ContractSigner {
  return { ...signer, ...(signerOverrides[signer._id] ?? {}) }
}

export async function getContracts(tenantId?: string | null, filters?: { status?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedContracts as any[]).filter((c) => c.tenantId === id).map(mergeContract)
  if (filters?.status) list = list.filter((c) => c.status === filters.status)
  return list.sort((a, b) => {
    const da = a.signedAt ?? a.createdAt ?? ""
    const db = b.signedAt ?? b.createdAt ?? ""
    return db.localeCompare(da)
  })
}

export async function getContractById(contractId: string, tenantId?: string | null) {
  await delay(80)
  const found = (seedContracts as any[]).find((c) => c._id === contractId) ?? null
  return found ? mergeContract(found) : null
}

export async function getContractTemplates(tenantId?: string | null) {
  await delay(100)
  const id = resolveTenant(tenantId)
  return (seedContractTemplates as any[]).filter((t) => t.tenantId === id)
}

export async function getContractTemplateById(templateId: string) {
  await delay(60)
  return (seedContractTemplates as any[]).find((t) => t._id === templateId) ?? null
}

export async function getClauses(tenantId?: string | null, category?: string) {
  await delay(100)
  const id = resolveTenant(tenantId)
  let list = (seedClauses as any[]).filter((c) => c.tenantId === id)
  if (category) list = list.filter((c) => c.category === category)
  return list
}

export async function getClauseById(clauseId: string) {
  await delay(60)
  return (seedClauses as any[]).find((c) => c._id === clauseId) ?? null
}

export async function getSignersByContract(contractId: string, tenantId?: string | null) {
  await delay(60)
  return (seedContractSigners as any[])
    .filter((s) => s.contractId === contractId)
    .map(mergeSigner)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

/** Alias kept for modelling contract detail page */
export async function getContractSigners(contractId: string, tenantId?: string | null) {
  return getSignersByContract(contractId, tenantId)
}

export async function getObligationsByContract(contractId: string) {
  await delay(60)
  return (seedObligations as any[]).filter((o) => o.contractId === contractId)
}

export async function getObligations(tenantId?: string | null, filters?: { status?: string }) {
  await delay(120)
  const id = resolveTenant(tenantId)
  let list = (seedObligations as any[]).filter((o) => o.tenantId === id)
  if (filters?.status) list = list.filter((o) => o.status === filters.status)
  return list.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
}

export function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

export async function sendContract(contractId: string, tenantId?: string | null): Promise<void> {
  await delay(100)
  const current = await getContractById(contractId)
  if (!current) return
  contractOverrides[contractId] = {
    ...(contractOverrides[contractId] ?? {}),
    status: "SENT",
    updatedAt: new Date().toISOString(),
  }
}

export async function voidContract(contractId: string, tenantId?: string | null): Promise<void> {
  await delay(100)
  const current = await getContractById(contractId)
  if (!current) return
  contractOverrides[contractId] = {
    ...(contractOverrides[contractId] ?? {}),
    status: "VOID",
    updatedAt: new Date().toISOString(),
  }
}

export async function signContract(
  contractId: string,
  signerId: string,
  tenantId?: string | null
): Promise<void> {
  await delay(120)
  signerOverrides[signerId] = {
    ...(signerOverrides[signerId] ?? {}),
    status: "SIGNED",
    signedAt: new Date().toISOString(),
  }

  const signers = await getSignersByContract(contractId)
  const fullySigned = signers.length > 0 && signers.every((s) => s.status === "SIGNED")
  if (fullySigned) {
    contractOverrides[contractId] = {
      ...(contractOverrides[contractId] ?? {}),
      status: "SIGNED",
      signedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

export async function updateContractDraft(
  contractId: string,
  patch: { projectName?: string; clientName?: string; amountMinor?: number; currency?: string },
  tenantId?: string | null
): Promise<Contract | null> {
  await delay(120)
  const current = await getContractById(contractId)
  if (!current) return null
  contractOverrides[contractId] = {
    ...(contractOverrides[contractId] ?? {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  return (await getContractById(contractId)) as Contract | null
}
