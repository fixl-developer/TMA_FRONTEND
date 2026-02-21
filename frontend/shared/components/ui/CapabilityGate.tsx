"use client"

import * as React from "react"
import { useCapability } from "@/shared/hooks/useCapability"

interface CapabilityGateProps {
  capability: string
  children: React.ReactNode
  /** When true, renders children but disabled (e.g. for buttons) */
  fallback?: React.ReactNode
}

/**
 * Renders children only if the current user has the specified capability.
 * Use fallback to show a disabled/alternative UI when lacking capability.
 */
export function CapabilityGate({ capability, children, fallback }: CapabilityGateProps) {
  const has = useCapability(capability)

  if (has) return <>{children}</>
  if (fallback !== undefined) return <>{fallback}</>
  return null
}
