import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Enhanced Skeleton Component with shimmer effect and variants
 */

const skeletonVariants = cva("bg-muted", {
  variants: {
    variant: {
      pulse: "animate-pulse",
      shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
    },
    shape: {
      default: "rounded-md",
      circle: "rounded-full",
      rectangle: "rounded-none",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
  },
  defaultVariants: {
    variant: "shimmer",
    shape: "default",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, shape, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, shape }), className)}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
}

// Preset skeleton components for common use cases
function SkeletonText({
  className,
  lines = 1,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-4/5" : "w-full")}
        />
      ))}
    </div>
  );
}

function SkeletonCircle({
  className,
  size = "md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return <Skeleton shape="circle" className={cn(sizes[size], className)} {...props} />;
}

function SkeletonButton({
  className,
  size = "md",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return <Skeleton className={cn(sizes[size], className)} {...props} />;
}

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonButton, skeletonVariants };
