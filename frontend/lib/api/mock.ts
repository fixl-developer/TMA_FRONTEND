/**
 * Mock API Layer - Phase 1
 *
 * Centralized mock API for UI development with seed data.
 * Swap for real API when backend is ready via NEXT_PUBLIC_USE_MOCK_API=false.
 */

import {
  seedTenants,
  seedUsers,
  seedRoles,
  seedTeams,
  seedInvitations,
} from "@/data/seed"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useMockApi(): boolean {
  return USE_MOCK
}

/** Simulate network delay (150–300ms) */
export async function mockDelay() {
  await delay(150 + Math.random() * 150)
}

// --- Auth (mock) ---
export const mockAuth = {
  async login(email: string, password: string) {
    await mockDelay()
    const key = email.trim().toLowerCase()
    // Seed users: any seed user + password "demo123"
    const user = (seedUsers as any[]).find((u) => u.email?.toLowerCase() === key)
    if (user && password === "demo123") {
      const roleMap: Record<string, string> = {
        SUPER_ADMIN: "superadmin",
        TENANT_OWNER: "admin",
        ADMIN: "admin",
        AGENT: "modelling",
        TALENT: "modelling",
      }
      return {
        ok: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: roleMap[user.role] ?? "admin",
          tenantIds: user.tenantIds ?? [],
        },
      }
    }
    return { ok: false, error: "Invalid email or password" }
  },
}

// --- Tenants ---
export const mockTenants = {
  async list() {
    await mockDelay()
    return seedTenants as any[]
  },
  async get(id: string) {
    await mockDelay()
    return (seedTenants as any[]).find((t) => t._id === id) ?? null
  },
}

// --- Users (tenant-scoped) ---
export const mockUsers = {
  async list(tenantId: string) {
    await mockDelay()
    return (seedUsers as any[]).filter((u) => u.tenantIds?.includes(tenantId))
  },
  async get(tenantId: string, userId: string) {
    await mockDelay()
    const users = (seedUsers as any[]).filter((u) => u.tenantIds?.includes(tenantId))
    return users.find((u) => u._id === userId) ?? null
  },
}

// --- Roles ---
export const mockRoles = {
  async list(tenantId: string) {
    await mockDelay()
    return (seedRoles as any[]).filter((r: any) => r.tenantId === tenantId)
  },
}

// --- Teams ---
export const mockTeams = {
  async list(tenantId: string) {
    await mockDelay()
    return (seedTeams as any[]).filter((t: any) => t.tenantId === tenantId)
  },
  async get(tenantId: string, teamId: string) {
    await mockDelay()
    const teams = (seedTeams as any[]).filter((t: any) => t.tenantId === tenantId)
    return teams.find((t) => t._id === teamId) ?? null
  },
}

// --- Invitations ---
export const mockInvitations = {
  async list(tenantId: string) {
    await mockDelay()
    return (seedInvitations as any[]).filter((i: any) => i.tenantId === tenantId)
  },
}
