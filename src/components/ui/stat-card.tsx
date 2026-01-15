import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
} from "@/components/ui/enhanced-card";

/**
 * Stat Card Component - Reusable component for displaying statistics
 * Based on Forge College design system
 */

const statCardVariants = cva("", {
  variants: {
    variant: {
      default: "",
      gradient: "",
      minimal: "",
    },
    colorScheme: {
      blue: "bg-gradient-soft-blue", // Cream tones
      green: "bg-gradient-soft-green", // Dark green light tones
      yellow: "bg-gradient-soft-yellow", // Orange light tones
      purple: "bg-gradient-soft-purple", // Orange medium tones
      orange: "bg-gradient-soft-orange",
      brand: "bg-gradient-brand text-white",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    colorScheme: "blue",
    size: "md",
  },
});

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof statCardVariants> {
  /** Icon to display */
  icon?: LucideIcon;
  /** Stat label/title */
  label: string;
  /** Stat value */
  value: string | number;
  /** Optional description/subtitle */
  description?: string;
  /** Trend indicator */
  trend?: {
    value: number | string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  /** Loading state */
  isLoading?: boolean;
  /** Custom icon color */
  iconColor?: string;
  /** Custom card variant override */
  cardVariant?: "default" | "elevated" | "outlined" | "ghost" | "gradient";
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      variant = "default",
      colorScheme,
      size = "md",
      icon: Icon,
      label,
      value,
      description,
      trend,
      isLoading = false,
      iconColor,
      cardVariant,
      ...props
    },
    ref
  ) => {
    // Determine card variant based on component variant
    const effectiveCardVariant = cardVariant || (variant === "gradient" ? "gradient" : "default");

    // Icon sizes based on card size
    const iconSizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    // Value text sizes
    const valueSizes = {
      sm: "text-2xl font-bold",
      md: "text-3xl font-bold",
      lg: "text-4xl font-bold",
    };

    // Label text sizes
    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    // Get icon color based on color scheme if not provided
    const getIconColor = () => {
      if (iconColor) return iconColor;

      // All icons use the same color for consistency
      return "text-forge-orange-600";
    };

    if (isLoading) {
      return (
        <EnhancedCard
          ref={ref}
          variant={effectiveCardVariant}
          className={cn(statCardVariants({ variant, colorScheme }), className)}
          {...props}
        >
          <EnhancedCardContent spacing="md">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
                <div className="h-8 bg-muted animate-pulse rounded w-24" />
              </div>
              <div className={cn("rounded-full bg-muted animate-pulse", iconSizes[size || "md"])} />
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      );
    }

    return (
      <EnhancedCard
        ref={ref}
        variant={effectiveCardVariant}
        className={cn(statCardVariants({ variant, colorScheme }), "relative overflow-hidden", className)}
        {...props}
      >
        <EnhancedCardContent spacing="md">
          <div className="flex items-start justify-between">
            {/* Left side: Label and Value */}
            <div className="space-y-1 flex-1">
              <p className={cn("font-medium text-forge-dark-700", labelSizes[size || "md"])}>
                {label}
              </p>
              <p className={cn(valueSizes[size || "md"], "tracking-tight")}>
                {value}
              </p>

              {description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              )}

              {/* Trend indicator */}
              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  {trend.direction === "up" && (
                    <TrendingUp className="h-4 w-4 text-success" />
                  )}
                  {trend.direction === "down" && (
                    <TrendingDown className="h-4 w-4 text-error" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.direction === "up" && "text-success",
                      trend.direction === "down" && "text-error",
                      trend.direction === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {trend.value}
                  </span>
                  {trend.label && (
                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                  )}
                </div>
              )}
            </div>

            {/* Right side: Icon */}
            {Icon && (
              <div
                className={cn(
                  "rounded-full p-2 bg-background/50",
                  iconSizes[size || "md"]
                )}
              >
                <Icon className={cn("h-full w-full", getIconColor())} />
              </div>
            )}
          </div>
        </EnhancedCardContent>

        {/* Decorative gradient overlay for gradient variant */}
        {variant === "gradient" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        )}
      </EnhancedCard>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };
