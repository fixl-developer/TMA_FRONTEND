/**
 * Card Component
 *
 * - default: Light theme for Super Admin
 * - dark: Dark theme for Admin, Modelling, Pageant dashboards
 */

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark"
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border px-5 py-4 shadow-sm",
        variant === "dark"
          ? "border-slate-700/80 bg-slate-900/90 shadow-black/20 backdrop-blur-sm"
          : "border-slate-200 bg-white shadow-sm",
        className
      )}
      style={
        variant === "dark"
          ? style
          : {
              backgroundColor: "var(--agency-card-bg, #ffffff)",
              borderColor: "var(--agency-card-border, #e2e8f0)",
              color: "var(--agency-text, inherit)",
              ...style,
            }
      }
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

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: "default" | "dark"
}

export const CardTitle = ({
  className,
  variant,
  ...props
}: CardTitleProps) => (
  <h3
    className={cn(
      "text-sm font-semibold tracking-wide",
      variant === "dark" ? "text-slate-200" : "text-slate-800",
      className
    )}
    {...props}
  />
)

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "dark"
}

export const CardDescription = ({
  className,
  variant,
  ...props
}: CardDescriptionProps) => (
  <p
    className={cn(
      "text-xs leading-relaxed",
      variant === "dark" ? "text-slate-400" : "text-slate-500",
      className
    )}
    {...props}
  />
)

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark"
}

export const CardContent = ({
  className,
  variant,
  ...props
}: CardContentProps) => (
  <div
    className={cn("mt-2", variant === "dark" ? "text-slate-300" : "", className)}
    {...props}
  />
)

