/**
 * Badge Component - Phase 1 Design System
 *
 * Status badges, labels, and tags.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#323130] bg-[#323130] text-white",
        secondary: "border-[#8a8886] bg-[#f3f2f1] text-[#323130]",
        success: "border-[#107c10] bg-[#dff6dd] text-[#107c10]",
        warning: "border-[#797673] bg-[#fff4ce] text-[#797673]",
        destructive: "border-[#a80000] bg-[#fde7e9] text-[#a80000]",
        outline: "border-[#8a8886] bg-transparent text-[#323130]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
