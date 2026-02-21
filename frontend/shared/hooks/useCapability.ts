"use client"

import { useMemo } from "react"
import { useAuth } from "@/shared/context/AuthContext"
import { useTenant } from "@/shared/context/TenantContext"
import { hasCapability } from "@/shared/services/capabilityService"

/**
 * Hook to check if the current user has a capability.
 * Superadmin always has all capabilities.
 */
export function useCapability(capability: string): boolean {
  const { user } = useAuth()
  const { tenantId } = useTenant()

  return useMemo(() => {
    if (!user?.email) return false
    return hasCapability(user.email, tenantId, capability)
  }, [user?.email, tenantId, capability])
}

/**
 * Hook to check multiple capabilities. Returns true if user has ALL.
 */
export function useCapabilities(capabilities: string[]): boolean {
  const { user } = useAuth()
  const { tenantId } = useTenant()

  return useMemo(() => {
    if (!user?.email || capabilities.length === 0) return false
    return capabilities.every((cap) => hasCapability(user.email, tenantId, cap))
  }, [user?.email, tenantId, capabilities.join(",")])
}

/**
 * Hook to check multiple capabilities. Returns true if user has ANY.
 */
export function useAnyCapability(capabilities: string[]): boolean {
  const { user } = useAuth()
  const { tenantId } = useTenant()

  return useMemo(() => {
    if (!user?.email || capabilities.length === 0) return false
    return capabilities.some((cap) => hasCapability(user.email, tenantId, cap))
  }, [user?.email, tenantId, capabilities.join(",")])
}
