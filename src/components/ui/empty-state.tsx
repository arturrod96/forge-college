import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon, Search, FileX, AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Empty State Component
 * Used to display empty states with icon, message, and optional action
 */

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      sm: "py-8 px-4",
      md: "py-12 px-6",
      lg: "py-16 px-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const emptyStateIconVariants = cva("rounded-full flex items-center justify-center mb-4", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      search: "bg-info-100 text-info-600",
      error: "bg-error-100 text-error-600",
      "no-data": "bg-muted text-muted-foreground",
      success: "bg-success-100 text-success-600",
    },
    size: {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-20 w-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  icon?: LucideIcon;
}

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Icon to display (uses default icon based on variant if not provided) */
  icon?: LucideIcon;
  /** Variant determines the default icon and color scheme */
  variant?: "default" | "search" | "error" | "no-data" | "success";
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Custom icon size override */
  iconSize?: "sm" | "md" | "lg";
}

// Default icons for each variant
const defaultIcons: Record<string, LucideIcon> = {
  default: Inbox,
  search: Search,
  error: AlertCircle,
  "no-data": FileX,
  success: Inbox,
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size = "md",
      variant = "default",
      icon,
      title,
      description,
      action,
      secondaryAction,
      iconSize,
      ...props
    },
    ref
  ) => {
    const Icon = icon || defaultIcons[variant || "default"];
    const effectiveIconSize = iconSize || size;

    const iconSizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    };

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size }), className)}
        role="status"
        aria-live="polite"
        {...props}
      >
        {/* Icon */}
        <div
          className={cn(emptyStateIconVariants({ variant, size: effectiveIconSize }))}
          aria-hidden="true"
        >
          <Icon className={iconSizes[effectiveIconSize || "md"]} />
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-semibold tracking-tight text-foreground",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className={cn(
              "mt-2 text-muted-foreground max-w-md",
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              size === "lg" && "text-lg"
            )}
          >
            {description}
          </p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="w-full sm:w-auto"
                aria-label={action.label}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || "outline"}
                className="w-full sm:w-auto"
                aria-label={secondaryAction.label}
              >
                {secondaryAction.icon && <secondaryAction.icon className="mr-2 h-4 w-4" />}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

// Preset empty state components for common use cases

export function EmptySearchResults({
  query,
  onClear,
  ...props
}: Omit<EmptyStateProps, "variant" | "title" | "description"> & {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      variant="search"
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try adjusting your search.`
          : "Try different keywords or filters to find what you're looking for."
      }
      action={
        onClear
          ? {
              label: "Clear search",
              onClick: onClear,
              variant: "outline",
            }
          : undefined
      }
      {...props}
    />
  );
}

export function EmptyDataState({
  entityName = "items",
  onCreate,
  ...props
}: Omit<EmptyStateProps, "variant" | "title" | "description"> & {
  entityName?: string;
  onCreate?: () => void;
}) {
  return (
    <EmptyState
      variant="no-data"
      title={`No ${entityName} yet`}
      description={`Get started by creating your first ${entityName.toLowerCase()}.`}
      action={
        onCreate
          ? {
              label: `Create ${entityName.toLowerCase()}`,
              onClick: onCreate,
            }
          : undefined
      }
      {...props}
    />
  );
}

export function EmptyErrorState({
  error,
  onRetry,
  ...props
}: Omit<EmptyStateProps, "variant" | "title" | "description"> & {
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description={error || "We encountered an error loading this content. Please try again."}
      action={
        onRetry
          ? {
              label: "Try again",
              onClick: onRetry,
              variant: "outline",
            }
          : undefined
      }
      {...props}
    />
  );
}

export { emptyStateVariants, emptyStateIconVariants };
