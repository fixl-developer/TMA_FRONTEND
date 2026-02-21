/**
 * Pageant Process Service
 * Process Builder – stages, config, actions (UI + seed data)
 */

import { seedPageantProcesses, seedPageantTemplates } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface PageantStage {
  id: string
  name: string
  order: number
  entryCriteria?: string
  exitCriteria?: string
  visibility?: string
  responsibleRoles?: string[]
  actions?: string[]
}

export interface PageantProcess {
  _id: string
  pageantId: string
  tenantId: string
  name: string
  stages: PageantStage[]
  scoringCriteria?: string[]
  version?: number
}

const ACTION_LABELS: Record<string, string> = {
  media_upload: "Media upload",
  form_submission: "Form submission",
  payment_collection: "Payment collection",
  judge_scoring: "Judge scoring",
  admin_approval: "Admin approval",
  auto_shortlisting: "Auto shortlisting",
  guardian_consent: "Guardian consent",
  sponsor_approval: "Sponsor approval",
}

export const getActionLabel = (action: string) => ACTION_LABELS[action] ?? action

export const getPageantProcess = async (pageantId: string, tenantId?: string): Promise<PageantProcess | null> => {
  await delay(100)
  const processes = seedPageantProcesses as PageantProcess[]
  let proc = processes.find((p) => p.pageantId === pageantId)
  if (tenantId && proc && proc.tenantId !== tenantId) return null
  return proc ?? null
}

export const getPageantProcessById = async (processId: string): Promise<PageantProcess | null> => {
  await delay(100)
  const processes = seedPageantProcesses as PageantProcess[]
  return processes.find((p) => p._id === processId) ?? null
}

export const getStagesForPageant = async (
  pageantId: string,
  tenantId?: string
): Promise<PageantStage[]> => {
  const proc = await getPageantProcess(pageantId, tenantId)
  if (proc?.stages?.length) return proc.stages

  // Fallback: template stages
  const templates = seedPageantTemplates as { _id: string; stages: PageantStage[] }[]
  const t = templates[0]
  return t?.stages ?? [
    { id: "reg", name: "Registration", order: 1 },
    { id: "prelims", name: "Prelims", order: 2 },
    { id: "semi", name: "Semi-finals", order: 3 },
    { id: "finals", name: "Finals", order: 4 },
  ]
}
