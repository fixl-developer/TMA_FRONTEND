/**
 * Template Service - Super Admin
 *
 * Seed-backed service for T1–T8 tenant templates.
 * Mirrors patterns used in blueprintService.
 */

import { seedTemplates } from "@/data/seed"
import type { TenantTemplate, TemplateId } from "@/shared/lib/types/templates"
import type { Tenant } from "@/shared/lib/types/tenants"
import { getTenants } from "@/shared/services/tenantService"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getTemplates = async (): Promise<TenantTemplate[]> => {
  await delay(150)
  return seedTemplates as TenantTemplate[]
}

export const getTemplateById = async (id: TemplateId): Promise<TenantTemplate | undefined> => {
  await delay(120)
  return (seedTemplates as TenantTemplate[]).find((t) => t.id === id)
}

export interface TemplateTenantSummary {
  templateId: TemplateId
  tenants: Tenant[]
}

/** Tenants that have all of this template's included blueprints */
export const getTemplateTenants = async (id: TemplateId): Promise<TemplateTenantSummary> => {
  await delay(160)
  const template = (seedTemplates as TenantTemplate[]).find((t) => t.id === id)
  const tenants = await getTenants()
  const included = template?.includedBlueprints ?? []
  const matching = tenants.filter((t) => {
    const tenantBps = (t.blueprints as string[] | undefined) ?? []
    return included.every((bp) => tenantBps.includes(bp))
  })
  return { templateId: id, tenants: matching }
}
