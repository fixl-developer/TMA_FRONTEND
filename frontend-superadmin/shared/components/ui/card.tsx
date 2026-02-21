/**
 * Card Component - Super Admin
 *
 * Minimal white card for formal dashboard layout.
 */

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mb-2 flex items-center justify-between gap-2", className)}
    {...props}
  />
)

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-sm font-semibold tracking-wide text-slate-800",
      className
    )}
    {...props}
  />
)

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "text-xs text-slate-500 leading-relaxed",
      className
    )}
    {...props}
  />
)

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-2", className)}
    {...props}
  />
)

