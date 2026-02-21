/**
 * Optimized Button Component
 * 
 * Memoized version of Button for performance optimization.
 * Use this for buttons that render frequently (e.g., in lists, tables).
 */

"use client"

import { memo } from "react"
import { Button, type ButtonProps } from "./button"

export const OptimizedButton = memo(function OptimizedButton(props: ButtonProps) {
  return <Button {...props} />
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if props actually changed
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className
  )
})

OptimizedButton.displayName = "OptimizedButton"
