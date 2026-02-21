/**
 * Pageant Scoring & Results Service
 * Judge scoring, results, publish (UI + seed data)
 */

import {
  seedPageantScores,
  seedPageantResults,
  seedPageantProcesses,
} from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const RESULTS_APPROVAL_KEY = "talentos_results_publish_approval"

export interface PageantScore {
  _id: string
  pageantId: string
  registrationId: string
  stage: string
  judgeId: string
  criteriaScores: Record<string, number>
  total: number
  submittedAt: string
}

export interface PageantResult {
  _id: string
  pageantId: string
  stage: string
  rank: number
  registrationId: string
  contestantName: string
  title: string
  published: boolean
  publishedAt: string | null
  approvedBy: string | null
}

// In-memory overrides for demo (submit scores, publish)
const scoreOverrides: PageantScore[] = []
const resultPublishOverrides: Record<string, boolean> = {}

export interface ResultsPublishApprovalState {
  status: "DRAFT" | "PENDING_REVIEW" | "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED"
  requestedAt?: string
  requestedBy?: string
  reviewedAt?: string
  reviewedBy?: string
  approvedAt?: string
  approvedBy?: string
  reason?: string
}

function getResultsApprovalOverrides(): Record<string, ResultsPublishApprovalState> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(RESULTS_APPROVAL_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setResultsApprovalOverride(pageantId: string, patch: Partial<ResultsPublishApprovalState>) {
  if (typeof window === "undefined") return
  const current = getResultsApprovalOverrides()
  const existing = current[pageantId] ?? { status: "DRAFT" as const }
  current[pageantId] = { ...existing, ...patch }
  localStorage.setItem(RESULTS_APPROVAL_KEY, JSON.stringify(current))
}

export const getScoresForPageant = async (
  pageantId: string,
  stage?: string
): Promise<PageantScore[]> => {
  await delay(100)
  const all = [...(seedPageantScores as PageantScore[]), ...scoreOverrides]
  let list = all.filter((s) => s.pageantId === pageantId)
  if (stage) list = list.filter((s) => s.stage === stage)
  return list
}

export const getScoresByRegistration = async (
  pageantId: string,
  registrationId: string
): Promise<PageantScore[]> => {
  const all = await getScoresForPageant(pageantId)
  return all.filter((s) => s.registrationId === registrationId)
}

export const submitScores = async (
  pageantId: string,
  registrationId: string,
  stage: string,
  judgeId: string,
  criteriaScores: Record<string, number>
): Promise<PageantScore> => {
  await delay(200)
  const total = Object.values(criteriaScores).reduce((a, b) => a + b, 0)
  const score: PageantScore = {
    _id: `score_${Date.now()}`,
    pageantId,
    registrationId,
    stage,
    judgeId,
    criteriaScores,
    total,
    submittedAt: new Date().toISOString(),
  }
  scoreOverrides.push(score)
  return score
}

export const getScoringCriteria = (pageantId: string): string[] => {
  const proc = (seedPageantProcesses as { pageantId: string; scoringCriteria?: string[] }[]).find(
    (p) => p.pageantId === pageantId
  )
  return proc?.scoringCriteria ?? ["Ramp walk", "Q&A", "Talent", "Personality"]
}

export const getResultsForPageant = async (
  pageantId: string,
  stage?: string
): Promise<PageantResult[]> => {
  await delay(100)
  const all = seedPageantResults as PageantResult[]
  let list = all.filter((r) => r.pageantId === pageantId)
  if (stage) list = list.filter((r) => r.stage === stage)
  return list.sort((a, b) => a.rank - b.rank)
}

export const isResultsPublished = (pageantId: string): boolean => {
  return resultPublishOverrides[pageantId] ?? false
}

export const getResultsPublishApprovalState = (
  pageantId: string
): ResultsPublishApprovalState => {
  const overrides = getResultsApprovalOverrides()
  return overrides[pageantId] ?? { status: "DRAFT" }
}

export const requestResultsPublish = async (
  pageantId: string,
  reason: string,
  actor = "director@talentos.io"
): Promise<void> => {
  await delay(180)
  setResultsApprovalOverride(pageantId, {
    status: "PENDING_REVIEW",
    requestedAt: new Date().toISOString(),
    requestedBy: actor,
    reason: reason.trim(),
  })
}

export const markResultsReviewed = async (
  pageantId: string,
  reason: string,
  actor = "auditor@talentos.io"
): Promise<void> => {
  await delay(180)
  setResultsApprovalOverride(pageantId, {
    status: "PENDING_APPROVAL",
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor,
    reason: reason.trim(),
  })
}

export const publishResults = async (pageantId: string): Promise<void> => {
  await delay(200)
  resultPublishOverrides[pageantId] = true
  setResultsApprovalOverride(pageantId, {
    status: "PUBLISHED",
    approvedAt: new Date().toISOString(),
    approvedBy: "approver@talentos.io",
  })
}

export const unpublishResults = async (pageantId: string): Promise<void> => {
  await delay(200)
  resultPublishOverrides[pageantId] = false
  setResultsApprovalOverride(pageantId, {
    status: "DRAFT",
  })
}

export const approveResultsPublish = async (
  pageantId: string,
  reason: string,
  actor = "approver@talentos.io"
): Promise<void> => {
  await delay(200)
  resultPublishOverrides[pageantId] = true
  setResultsApprovalOverride(pageantId, {
    status: "PUBLISHED",
    approvedAt: new Date().toISOString(),
    approvedBy: actor,
    reason: reason.trim(),
  })
}

export const rejectResultsPublish = async (
  pageantId: string,
  reason: string,
  actor = "approver@talentos.io"
): Promise<void> => {
  await delay(200)
  resultPublishOverrides[pageantId] = false
  setResultsApprovalOverride(pageantId, {
    status: "REJECTED",
    approvedAt: new Date().toISOString(),
    approvedBy: actor,
    reason: reason.trim(),
  })
}

export const exportResultsCSV = (results: PageantResult[]): string => {
  const headers = ["Rank", "Contestant", "Title"]
  const rows = results.map((r) => [r.rank, r.contestantName, r.title].join(","))
  return [headers.join(","), ...rows].join("\n")
}
