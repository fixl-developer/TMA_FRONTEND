/**
 * Finance & Wallets Types - Super Admin
 *
 * Minimal types for finance snapshots used on the Finance dashboard.
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

