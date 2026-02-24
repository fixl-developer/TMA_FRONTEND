/**
 * Moderation Service - Super Admin
 *
 * Seed-backed service for moderation queue, rules, appeals, moderators, analytics.
 */

import {
  seedModerationQueue,
  seedModerationRules,
  seedModerators,
  seedModerationAnalytics,
  seedAppeals,
} from "@/data/seed"
import type {
  ModerationItem,
  ModerationRule,
  Appeal,
  Moderator,
  ModerationAnalytics,
  ModerationStatus,
  ContentType,
  ModerationAction,
} from "@/shared/lib/types/moderation"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getModerationQueue = async (): Promise<ModerationItem[]> => {
  await delay(180)
  return seedModerationQueue as ModerationItem[]
}

export const getModerationItemById = async (id: string): Promise<ModerationItem | undefined> => {
  await delay(100)
  return (seedModerationQueue as ModerationItem[]).find((item) => item._id === id)
}

export const getModerationRules = async (): Promise<ModerationRule[]> => {
  await delay(160)
  return seedModerationRules as ModerationRule[]
}

export const getModerationRuleById = async (id: string): Promise<ModerationRule | undefined> => {
  await delay(100)
  return (seedModerationRules as ModerationRule[]).find((rule) => rule._id === id)
}

export const getModerators = async (): Promise<Moderator[]> => {
  await delay(150)
  return seedModerators as Moderator[]
}

export const getModeratorById = async (id: string): Promise<Moderator | undefined> => {
  await delay(100)
  return (seedModerators as Moderator[]).find((mod) => mod._id === id)
}

export const getModerationAnalytics = async (): Promise<ModerationAnalytics> => {
  await delay(140)
  return seedModerationAnalytics as ModerationAnalytics
}

export const getAppeals = async (): Promise<Appeal[]> => {
  await delay(150)
  return seedAppeals as Appeal[]
}

export const getAppealById = async (id: string): Promise<Appeal | undefined> => {
  await delay(100)
  return (seedAppeals as Appeal[]).find((a) => a._id === id)
}

export type ModerationQueueFilters = {
  status?: ModerationStatus
  contentType?: ContentType
  tenantId?: string
  priority?: string
}

export const getModerationQueueFiltered = async (
  filters: ModerationQueueFilters
): Promise<ModerationItem[]> => {
  await delay(150)
  let items = seedModerationQueue as ModerationItem[]
  if (filters.status) items = items.filter((i) => i.status === filters.status)
  if (filters.contentType) items = items.filter((i) => i.contentType === filters.contentType)
  if (filters.tenantId) items = items.filter((i) => i.tenantId === filters.tenantId)
  if (filters.priority) items = items.filter((i) => i.priority === filters.priority)
  return items
}
