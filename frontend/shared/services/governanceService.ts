/**
 * Governance Service - Super Admin
 *
 * Mock service for moderation logs, disputes, enforcement, appeals, takedowns.
 */

import {
  seedModerationLogs,
  seedDisputes,
  seedEnforcementActions,
  seedAppeals,
  seedTakedowns,
  seedSupportCases,
} from "@/data/seed"
import type { ModerationLog } from "@/shared/lib/types/governance"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getModerationLogs = async (): Promise<ModerationLog[]> => {
  await delay(220)
  return seedModerationLogs as ModerationLog[]
}

export const getDisputes = async () => {
  await delay(200)
  return seedDisputes
}

export const getEnforcementActions = async () => {
  await delay(200)
  return seedEnforcementActions
}

export const getAppeals = async () => {
  await delay(200)
  return seedAppeals
}

export const getTakedowns = async () => {
  await delay(200)
  return seedTakedowns
}

export const getSupportCases = async () => {
  await delay(180)
  return seedSupportCases
}