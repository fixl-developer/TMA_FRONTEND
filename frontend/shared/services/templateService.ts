/**
 * Template Service
 * 
 * Service functions for template management operations.
 * Uses seed data for Phase 1 implementation.
 */

import {
  seedTemplates,
  getTemplateById,
  getTemplatesByComplexity,
  getTemplatesByBlueprint,
  getTemplateStats,
  type Template,
  type TemplateId,
  type TemplateComplexity
} from "@/data/seed/templates"

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all templates
 */
export async function getTemplates(): Promise<Template[]> {
  await delay(300)
  return seedTemplates
}

/**
 * Get template by ID
 */
export async function getTemplate(id: TemplateId): Promise<Template | null> {
  await delay(200)
  const template = getTemplateById(id)
  return template || null
}

/**
 * Get templates by complexity
 */
export async function getTemplatesByComplexityAsync(
  complexity: TemplateComplexity
): Promise<Template[]> {
  await delay(250)
  return getTemplatesByComplexity(complexity)
}

/**
 * Get templates by blueprint
 */
export async function getTemplatesByBlueprintAsync(
  blueprintId: string
): Promise<Template[]> {
  await delay(250)
  return getTemplatesByBlueprint(blueprintId)
}

/**
 * Get template statistics
 */
export async function getTemplateStatsAsync() {
  await delay(200)
  return getTemplateStats()
}

/**
 * Search templates by query
 */
export async function searchTemplates(query: string): Promise<Template[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return seedTemplates.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.usedBy.some(u => u.toLowerCase().includes(lowerQuery)) ||
      t.features.some(f => f.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get templates by agency type
 */
export async function getTemplatesByAgencyType(
  agencyType: string
): Promise<Template[]> {
  await delay(250)
  const lowerType = agencyType.toLowerCase()
  return seedTemplates.filter(t =>
    t.usedBy.some(u => u.toLowerCase().includes(lowerType))
  )
}

/**
 * Get tenants using a specific template (mock data)
 */
export async function getTenantsUsingTemplate(
  templateId: TemplateId
): Promise<any[]> {
  await delay(300)
  const template = getTemplateById(templateId)
  if (!template) return []

  // Mock tenant data
  const mockTenants = []
  for (let i = 0; i < template.tenantCount; i++) {
    mockTenants.push({
      id: `tenant_${templateId}_${i + 1}`,
      name: `${template.usedBy[i % template.usedBy.length]} ${i + 1}`,
      status: i % 10 === 0 ? "SUSPENDED" : "ACTIVE",
      plan: i % 3 === 0 ? "ENTERPRISE" : i % 2 === 0 ? "PRO" : "STARTER",
      activatedAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      setupCompleted: i % 5 !== 0
    })
  }
  return mockTenants
}

/**
 * Get template analytics (mock data)
 */
export async function getTemplateAnalytics(
  templateId: TemplateId
): Promise<any> {
  await delay(300)
  const template = getTemplateById(templateId)
  if (!template) return null

  return {
    templateId,
    tenantCount: template.tenantCount,
    successRate: template.successRate,
    avgSetupTime: template.setupTime,
    monthlyRevenue: template.monthlyRevenue,
    monthlyGrowth: Math.floor(Math.random() * 20) - 5,
    topUseCases: template.usedBy.slice(0, 3),
    avgKpiScore: 75 + Math.floor(Math.random() * 20),
    completionRate: 85 + Math.floor(Math.random() * 15),
    retentionRate: 80 + Math.floor(Math.random() * 15)
  }
}

/**
 * Apply template to tenant (mock)
 */
export async function applyTemplateToTenant(
  tenantId: string,
  templateId: TemplateId,
  customization?: any
): Promise<{ success: boolean; message: string }> {
  await delay(500)
  
  const template = getTemplateById(templateId)
  if (!template) {
    return {
      success: false,
      message: `Template ${templateId} not found`
    }
  }

  return {
    success: true,
    message: `Template ${template.name} applied to tenant ${tenantId}`
  }
}

/**
 * Get template preview (mock)
 */
export async function getTemplatePreview(
  templateId: TemplateId
): Promise<any> {
  await delay(300)
  const template = getTemplateById(templateId)
  if (!template) return null

  return {
    templateId,
    name: template.name,
    blueprints: template.blueprints,
    roles: template.defaultRoles,
    dashboards: template.defaultDashboards,
    workflows: [template.coreWorkflow],
    estimatedSetupTime: template.setupTime,
    complexity: template.complexity,
    features: template.features
  }
}

/**
 * Compare templates (mock)
 */
export async function compareTemplates(
  templateIds: TemplateId[]
): Promise<Template[]> {
  await delay(300)
  return templateIds
    .map(id => getTemplateById(id))
    .filter((t): t is Template => t !== undefined)
}

/**
 * Get template customization options (mock)
 */
export async function getTemplateCustomizationOptions(
  templateId: TemplateId
): Promise<any> {
  await delay(250)
  const template = getTemplateById(templateId)
  if (!template) return null

  return {
    templateId,
    customizableModules: template.blueprints,
    customizableRoles: template.defaultRoles,
    customizableDashboards: template.defaultDashboards,
    customizableKpis: Object.keys(template.kpiTargets.timing).concat(
      Object.keys(template.kpiTargets.cash),
      Object.keys(template.kpiTargets.quality)
    )
  }
}
