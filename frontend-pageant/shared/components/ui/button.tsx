import * as React from "react"
import { cn } from "@/shared/lib/utils"

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "icon"
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 px-3",
        size === "icon" && "h-9 w-9",
        variant === "default" && "bg-violet-500 text-white hover:bg-violet-400",
        variant === "outline" && "border border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50",
        variant === "ghost" && "text-slate-300 hover:bg-slate-800 hover:text-white",
        className
      )}
      {...props}
    />
  )
}
