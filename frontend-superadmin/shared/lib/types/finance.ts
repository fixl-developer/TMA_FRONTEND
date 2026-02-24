/**
 * Finance & Wallets Types - Super Admin
 *
 * Minimal types for finance snapshots, wallets, escrow, ledger, commissions.
 */

export type WalletScope = "PLATFORM_ESCROW" | "PLATFORM_REVENUE" | "TENANT"

export interface WalletSnapshot {
  scope: WalletScope
  tenantId?: string
  currency: string
  balanceMinor: number
}

export type TransactionDirection = "INBOUND" | "OUTBOUND" | "INTERNAL"

export type TransactionStatus = "PENDING" | "SETTLED"

export interface FinanceTransaction {
  _id: string
  type: string
  direction: TransactionDirection
  amountMinor: number
  currency: string
  tenantId?: string
  description?: string
  status: TransactionStatus
  createdAt?: string
}

// Phase 1 Financial System: wallets, escrow, ledger, commissions

export type WalletType = "PLATFORM_ESCROW" | "PLATFORM_REVENUE" | "TENANT" | "TALENT"
export type WalletStatus = "ACTIVE" | "FROZEN" | "CLOSED"

export interface Wallet {
  id: string
  type: WalletType
  ownerId: string
  tenantId?: string
  currency: string
  balanceMinor: number
  status: WalletStatus
  frozen: boolean
  createdAt?: string
  updatedAt?: string
}

export interface EscrowAccount {
  _id: string
  tenantId: string
  referenceType: string
  referenceId: string
  amountMinor: number
  currency: string
  status: string
  createdAt?: string
  fundedAt?: string
  settledAt?: string
  milestones?: { id: string; name: string; amountMinor: number; status: string }[]
}

export interface LedgerAccount {
  id: string
  name: string
  type: string
  currency: string
  balanceMinor: number
  tenantId?: string
}

export interface LedgerEntry {
  id: string
  accountId: string
  type: "DEBIT" | "CREDIT"
  amountMinor: number
  currency: string
  description?: string
  referenceId?: string
  createdAt: string
}

export interface CommissionRule {
  id: string
  name: string
  blueprint: string
  roleType: string
  commissionType: string
  rate?: number
  tiers?: { min: number; max: number | null; rate: number }[]
  currency: string
  applicableOn: string
  minAmount?: number
  maxAmount?: number | null
  status: string
  createdAt?: string
  description?: string
}

