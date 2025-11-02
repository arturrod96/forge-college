import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // New semantic variants
        success:
          "border-transparent bg-success text-white hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-white hover:bg-warning/80",
        info:
          "border-transparent bg-info text-white hover:bg-info/80",
        error:
          "border-transparent bg-error text-white hover:bg-error/80",
        // Brand variants
        brand:
          "border-transparent bg-forge-orange text-white hover:bg-forge-orange-500",
        "brand-subtle":
          "border-forge-orange/20 bg-forge-orange-50 text-forge-orange-600 hover:bg-forge-orange-100",
        // Additional variants
        "coming-soon":
          "border-transparent bg-info-100 text-info-700 hover:bg-info-200",
        enrolled:
          "border-transparent bg-forge-orange-100 text-forge-orange-700 hover:bg-forge-orange-200 ring-1 ring-forge-orange/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

function Badge({
  className,
  variant,
  size,
  shape,
  icon: Icon,
  iconPosition = "left",
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
      {Icon && iconPosition === "left" && <Icon className="h-3 w-3" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="h-3 w-3" />}
    </div>
  )
}

export { Badge, badgeVariants }
