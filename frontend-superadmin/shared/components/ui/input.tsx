/**
 * Input Component - Super Admin
 *
 * Reusable input field component.
 */

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded border border-[#8a8886] bg-white px-3 py-1.5 text-sm text-[#323130] placeholder:text-[#a19f9d] focus-visible:outline-none focus-visible:border-[#0078d4] focus-visible:ring-1 focus-visible:ring-[#0078d4] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

