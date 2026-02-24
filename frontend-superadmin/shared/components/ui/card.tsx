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
        "relative overflow-hidden rounded border border-[#e1e1e1] bg-white px-6 py-5 shadow-sm",
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
      "text-sm font-semibold text-[#323130]",
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
      "text-xs text-[#605e5c] leading-relaxed",
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

