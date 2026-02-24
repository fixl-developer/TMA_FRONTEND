/**
 * Finance Service - Super Admin
 *
 * Mock service for platform finance: wallets, escrow, ledger, commissions.
 */

import {
  seedTransactions,
  seedWallets,
  seedBillingPlans,
  seedRevenueReports,
  seedEscrowAccounts,
  seedPaymentRiskFlags,
  seedWalletsList,
  seedLedgerAccounts,
  seedLedgerEntries,
} from "@/data/seed"
import { seedCommissionRules, seedCommissionSettlements } from "@/data/seed"
import type {
  FinanceTransaction,
  WalletSnapshot,
  Wallet,
  EscrowAccount,
  LedgerAccount,
  LedgerEntry,
  CommissionRule,
} from "@/shared/lib/types/finance"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getWalletSnapshots = async (): Promise<WalletSnapshot[]> => {
  await delay(220)
  return seedWallets as WalletSnapshot[]
}

export const getRecentTransactions = async (): Promise<FinanceTransaction[]> => {
  await delay(260)
  return seedTransactions as FinanceTransaction[]
}

export const getBillingPlans = async () => {
  await delay(200)
  return seedBillingPlans
}

export const getRevenueReports = async () => {
  await delay(200)
  return seedRevenueReports
}

export const getEscrowAccounts = async () => {
  await delay(200)
  return seedEscrowAccounts
}

export const getPaymentRiskFlags = async () => {
  await delay(200)
  return seedPaymentRiskFlags
}

// Phase 1: Wallets list/detail
export const getWallets = async (): Promise<Wallet[]> => {
  await delay(180)
  return seedWalletsList as Wallet[]
}

export const getWalletById = async (id: string): Promise<Wallet | undefined> => {
  await delay(100)
  return (seedWalletsList as Wallet[]).find((w) => w.id === id)
}

// Escrow by id
export const getEscrowById = async (id: string): Promise<EscrowAccount | undefined> => {
  await delay(100)
  return (seedEscrowAccounts as EscrowAccount[]).find((e) => e._id === id)
}

// Ledger
export const getLedgerAccounts = async (): Promise<LedgerAccount[]> => {
  await delay(150)
  return seedLedgerAccounts as LedgerAccount[]
}

export const getLedgerEntries = async (): Promise<LedgerEntry[]> => {
  await delay(150)
  return seedLedgerEntries as LedgerEntry[]
}

export const getLedgerEntriesByAccountId = async (accountId: string): Promise<LedgerEntry[]> => {
  await delay(120)
  return (seedLedgerEntries as LedgerEntry[]).filter((e) => e.accountId === accountId)
}

// Commissions (use commissionRules seed - ensure it's exported)
export const getCommissionRules = async (): Promise<CommissionRule[]> => {
  await delay(160)
  return (seedCommissionRules || []) as CommissionRule[]
}

export const getCommissionRuleById = async (id: string): Promise<CommissionRule | undefined> => {
  await delay(100)
  const rules = (seedCommissionRules || []) as CommissionRule[]
  return rules.find((r) => r.id === id)
}

export const getCommissionSettlements = async () => {
  await delay(150)
  return (seedCommissionSettlements || []) as any[]
}

