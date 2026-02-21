"use client"

import { cn } from "@/shared/lib/utils"

interface SignupStepperProps {
  steps: { label: string }[]
  currentStep: number
  variant?: "teal" | "amber"
  className?: string
}

const variantStyles = {
  teal: {
    active: "bg-teal-500 text-slate-900",
    current: "bg-teal-500 text-slate-900 ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-950",
    line: "bg-teal-500",
  },
  amber: {
    active: "bg-amber-500 text-slate-900",
    current: "bg-amber-500 text-slate-900 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950",
    line: "bg-amber-500",
  },
}

export function SignupStepper({ steps, currentStep, variant = "teal", className }: SignupStepperProps) {
  const styles = variantStyles[variant]
  return (
    <nav aria-label="Progress" className={cn("flex items-center justify-center gap-2", className)}>
      {steps.map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
              i < currentStep && styles.active,
              i === currentStep && styles.current,
              i > currentStep && "bg-slate-800 text-slate-500"
            )}
          >
            {i < currentStep ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={cn("mx-1 h-0.5 w-6 sm:w-10", i < currentStep ? styles.line : "bg-slate-700")} />
          )}
        </div>
      ))}
    </nav>
  )
}
