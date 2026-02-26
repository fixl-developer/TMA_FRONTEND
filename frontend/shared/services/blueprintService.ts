/**
 * Blueprint Service
 * 
 * Service functions for blueprint management operations.
 * Uses seed data for Phase 1 implementation.
 */

import {
  seedBlueprints,
  getBlueprintById,
  getBlueprintsByCategory,
  getBlueprintsByStatus,
  getActiveBlueprints,
  getBlueprintStats,
  type Blueprint,
  type BlueprintId,
  type BlueprintCategory,
  type BlueprintStatus
} from "@/data/seed/blueprints"

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get all blueprints
 */
export async function getBlueprints(): Promise<Blueprint[]> {
  await delay(300)
  return seedBlueprints
}

/**
 * Get blueprint by ID
 */
export async function getBlueprint(id: BlueprintId): Promise<Blueprint | null> {
  await delay(200)
  const blueprint = getBlueprintById(id)
  return blueprint || null
}

/**
 * Get blueprints by category
 */
export async function getBlueprintsByCategoryAsync(
  category: BlueprintCategory
): Promise<Blueprint[]> {
  await delay(250)
  return getBlueprintsByCategory(category)
}

/**
 * Get blueprints by status
 */
export async function getBlueprintsByStatusAsync(
  status: BlueprintStatus
): Promise<Blueprint[]> {
  await delay(250)
  return getBlueprintsByStatus(status)
}

/**
 * Get active blueprints only
 */
export async function getActiveBlueprintsAsync(): Promise<Blueprint[]> {
  await delay(250)
  return getActiveBlueprints()
}

/**
 * Get blueprint statistics
 */
export async function getBlueprintStatsAsync() {
  await delay(200)
  return getBlueprintStats()
}

/**
 * Search blueprints by query
 */
export async function searchBlueprints(query: string): Promise<Blueprint[]> {
  await delay(300)
  const lowerQuery = query.toLowerCase()
  return seedBlueprints.filter(
    bp =>
      bp.name.toLowerCase().includes(lowerQuery) ||
      bp.description.toLowerCase().includes(lowerQuery) ||
      bp.usedBy.some(u => u.toLowerCase().includes(lowerQuery)) ||
      bp.keyWorkflows.some(w => w.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get blueprints used by a specific agency type
 */
export async function getBlueprintsByAgencyType(
  agencyType: string
): Promise<Blueprint[]> {
  await delay(250)
  const lowerType = agencyType.toLowerCase()
  return seedBlueprints.filter(bp =>
    bp.usedBy.some(u => u.toLowerCase().includes(lowerType))
  )
}

/**
 * Get tenants using a specific blueprint (mock data)
 */
export async function getTenantsUsingBlueprint(
  blueprintId: BlueprintId
): Promise<any[]> {
  await delay(300)
  const blueprint = getBlueprintById(blueprintId)
  if (!blueprint) return []

  // Mock tenant data
  const mockTenants = []
  for (let i = 0; i < blueprint.tenantCount; i++) {
    mockTenants.push({
      id: `tenant_${blueprintId}_${i + 1}`,
      name: `${blueprint.usedBy[i % blueprint.usedBy.length]} ${i + 1}`,
      status: i % 10 === 0 ? "SUSPENDED" : "ACTIVE",
      plan: i % 3 === 0 ? "ENTERPRISE" : i % 2 === 0 ? "PRO" : "STARTER",
      activatedAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    })
  }
  return mockTenants
}

/**
 * Get blueprint analytics (mock data)
 */
export async function getBlueprintAnalytics(
  blueprintId: BlueprintId
): Promise<any> {
  await delay(300)
  const blueprint = getBlueprintById(blueprintId)
  if (!blueprint) return null

  return {
    blueprintId,
    tenantCount: blueprint.tenantCount,
    adoptionRate: blueprint.adoptionRate,
    avgSetupTime: "3-5 days",
    successRate: 92 + Math.floor(Math.random() * 8),
    monthlyGrowth: Math.floor(Math.random() * 20) - 5,
    topUseCases: blueprint.usedBy.slice(0, 3),
    avgKpiScore: 75 + Math.floor(Math.random() * 20),
    revenueImpact: `₹${Math.floor(Math.random() * 500) + 100}K/month`
  }
}

/**
 * Assign blueprint to tenant (mock)
 */
export async function assignBlueprintToTenant(
  tenantId: string,
  blueprintId: BlueprintId,
  config?: any
): Promise<{ success: boolean; message: string }> {
  await delay(500)
  
  const blueprint = getBlueprintById(blu
eprintId)
  if (!blueprint) {
    return {
      success: false,
      message: `Blueprint ${blueprintId} not found`
    }
  }

  // Check dependencies
  if (blueprint.dependencies.length > 0) {
    // In real implementation, check if tenant has required blueprints
    console.log(`Blueprint ${blueprintId} requires: ${blueprint.dependencies.join(", ")}`)
  }

  return {
    success: true,
    message: `Blueprint ${blueprint.name} assigned to tenant ${tenantId}`
  }
}

/**
 * Remove blueprint from tenant (mock)
 */
export async function removeBlueprintFromTenant(
  tenantId: string,
  blueprintId: BlueprintId
): Promise<{ success: boolean; message: string }> {
  await delay(400)
  
  const blueprint = getBlueprintById(blueprintId)
  if (!blueprint) {
    return {
      success: false,
      message: `Blueprint ${blueprintId} not found`
    }
  }

  return {
    success: true,
    message: `Blueprint ${blueprint.name} removed from tenant ${tenantId}`
  }
}

/**
 * Get blueprint health metrics (mock)
 */
export async function getBlueprintHealth(
  blueprintId: BlueprintId
): Promise<any> {
  await delay(300)
  
  return {
    blueprintId,
    overallHealth: 85 + Math.floor(Math.random() * 15),
    metrics: {
      adoption: 85 + Math.floor(Math.random() * 10),
      satisfaction: 80 + Math.floor(Math.random() * 15),
      performance: 90 + Math.floor(Math.random() * 10),
      stability: 95 + Math.floor(Math.random() * 5)
    },
    issues: Math.floor(Math.random() * 3),
    lastChecked: new Date().toISOString()
  }
}

/**
 * Compare blueprints (mock)
 */
export async function compareBlueprints(
  blueprintIds: BlueprintId[]
): Promise<Blueprint[]> {
  await delay(300)
  return blueprintIds
    .map(id => getBlueprintById(id))
    .filter((bp): bp is Blueprint => bp !== undefined)
}
