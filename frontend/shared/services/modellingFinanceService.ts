/**
 * Modelling Finance Service - Wallets, Ledger, Credits, Statements
 *
 * Mock service for modelling agency finance. Tenant-scoped.
 */

import {
  seedWallets,
  seedLedgerEntries,
  seedCreditsAccounts,
  seedStatements,
} from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Wallet {
  _id: string
  scope: string
  tenantId?: string
  currency: string
  balanceMinor: number
}

export interface LedgerEntry {
  _id: string
  walletId: string
  tenantId?: string
  type: string
  direction: string
  amountMinor: number
  currency: string
  description: string
  referenceType?: string
  referenceId?: string
  status: string
  createdAt: string
}

export interface CreditsAccount {
  _id: string
  tenantId: string
  balance: number
  currency: string
  lastActivityAt?: string
}

export interface Statement {
  _id: string
  tenantId: string
  periodStart: string
  periodEnd: string
  status: string
  totalInMinor: number
  totalOutMinor: number
  createdAt: string
}

export const getTenantWallets = async (
  tenantId?: string | null
): Promise<Wallet[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  return (seedWallets as Wallet[]).filter(
    (w) => w.scope === "TENANT" && w.tenantId === id
  )
}

export const getWalletById = async (
  walletId: string,
  tenantId?: string | null
): Promise<Wallet | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const w = (seedWallets as Wallet[]).find(
    (x) => x._id === walletId && (x.tenantId === tid || !x.tenantId)
  )
  return w ?? null
}

export const getLedgerEntries = async (
  walletId: string,
  tenantId?: string | null,
  page = 1,
  pageSize = 10
): Promise<{ entries: LedgerEntry[]; total: number }> => {
  await delay(150)
  const tid = tenantId || "tenant_001"
  const all = (seedLedgerEntries as LedgerEntry[]).filter(
    (e) => e.walletId === walletId && (e.tenantId === tid || !e.tenantId)
  )
  const total = all.length
  const start = (page - 1) * pageSize
  const entries = all.slice(start, start + pageSize)
  return { entries, total }
}

export const getCreditsAccount = async (
  tenantId?: string | null
): Promise<CreditsAccount | null> => {
  await delay(100)
  const id = tenantId || "tenant_001"
  const c = (seedCreditsAccounts as CreditsAccount[]).find(
    (x) => x.tenantId === id
  )
  return c ?? null
}

const CREDITS_LEDGER_MOCK: Record<string, { type: string; amount: number; description: string; createdAt: string }[]> = {
  tenant_001: [
    { type: "ISSUE", amount: 500, description: "Platform bonus", createdAt: "2024-06-01T10:00:00.000Z" },
    { type: "CONSUME", amount: -200, description: "Redeemed for feature", createdAt: "2024-06-05T14:00:00.000Z" },
    { type: "ISSUE", amount: 1000, description: "Campaign reward", createdAt: "2024-06-10T09:00:00.000Z" },
  ],
  tenant_006: [
    { type: "ISSUE", amount: 300, description: "New tenant bonus", createdAt: "2024-06-20T10:00:00.000Z" },
    { type: "CONSUME", amount: -50, description: "Feature unlock", createdAt: "2024-06-25T14:00:00.000Z" },
  ],
}

export const getCreditsLedger = async (
  tenantId?: string | null
): Promise<{ type: string; amount: number; description: string; createdAt: string }[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  return CREDITS_LEDGER_MOCK[id] ?? CREDITS_LEDGER_MOCK.tenant_001
}

export const getStatements = async (
  tenantId?: string | null
): Promise<Statement[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  return (seedStatements as Statement[]).filter((s) => s.tenantId === id)
}

export const getStatementById = async (
  statementId: string,
  tenantId?: string | null
): Promise<Statement | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const s = (seedStatements as Statement[]).find(
    (x) => x._id === statementId && x.tenantId === tid
  )
  return s ?? null
}

/** Mock: issue credits */
export const issueCredits = async (
  tenantId: string,
  amount: number,
  reason: string,
  _tenantId?: string | null
): Promise<void> => {
  await delay(200)
}

/** Mock: revoke credits */
export const revokeCredits = async (
  tenantId: string,
  amount: number,
  reason: string,
  _tenantId?: string | null
): Promise<void> => {
  await delay(200)
}
