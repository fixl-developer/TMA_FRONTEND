/**
 * Button Component - Super Admin
 *
 * Reusable button component with variants.
 * Based on shadcn/ui design system.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#106ebe]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#a4262c]",
        outline:
          "border border-[#8a8886] bg-white text-[#323130] hover:bg-[#f3f2f1]",
        secondary:
          "bg-[#f3f2f1] text-[#323130] hover:bg-[#e1dfdd]",
        ghost: "text-[#323130] hover:bg-[#f3f2f1]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-4 py-1.5",
        sm: "h-7 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

