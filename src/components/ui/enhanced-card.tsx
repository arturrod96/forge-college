import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Enhanced Card Component with multiple variants and size options
 * Based on Forge College design system
 */

const enhancedCardVariants = cva(
  "rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border shadow-sm hover:shadow-md",
        elevated: "bg-card text-card-foreground shadow-md hover:shadow-lg",
        outlined: "bg-transparent border-2 hover:border-forge-orange",
        ghost: "bg-transparent hover:bg-accent/50",
        gradient: "bg-gradient-soft-blue text-card-foreground border-0 shadow-sm",
        "gradient-brand": "bg-gradient-brand text-white border-0 shadow-md",
        "gradient-success": "bg-gradient-soft-green text-card-foreground border-0 shadow-sm",
        "gradient-warning": "bg-gradient-soft-yellow text-card-foreground border-0 shadow-sm",
        "gradient-purple": "bg-gradient-soft-purple text-card-foreground border-0 shadow-sm",
        "gradient-orange": "bg-gradient-soft-orange text-card-foreground border-0 shadow-sm",
      },
      size: {
        sm: "p-4",
        md: "p-card-padding",
        lg: "p-card-padding-lg",
      },
      hover: {
        true: "cursor-pointer hover:scale-[1.02]",
        false: "",
      },
      interactive: {
        true: "hover:shadow-lg active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: false,
      interactive: false,
    },
  }
);

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardVariants> {
  as?: React.ElementType;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, size, hover, interactive, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(enhancedCardVariants({ variant, size, hover, interactive }), className)}
        {...props}
      />
    );
  }
);
EnhancedCard.displayName = "EnhancedCard";

const enhancedCardHeaderVariants = cva("flex flex-col", {
  variants: {
    spacing: {
      none: "space-y-0",
      sm: "space-y-1",
      md: "space-y-1.5",
      lg: "space-y-2",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

interface EnhancedCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardHeaderVariants> {}

const EnhancedCardHeader = React.forwardRef<HTMLDivElement, EnhancedCardHeaderProps>(
  ({ className, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardHeaderVariants({ spacing }), className)}
      {...props}
    />
  )
);
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const enhancedCardTitleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl lg:text-2xl",
      lg: "text-2xl lg:text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface EnhancedCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof enhancedCardTitleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const EnhancedCardTitle = React.forwardRef<HTMLHeadingElement, EnhancedCardTitleProps>(
  ({ className, size, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(enhancedCardTitleVariants({ size }), className)}
      {...props}
    />
  )
);
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const enhancedCardDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface EnhancedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof enhancedCardDescriptionVariants> {}

const EnhancedCardDescription = React.forwardRef<HTMLParagraphElement, EnhancedCardDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(enhancedCardDescriptionVariants({ size }), className)}
      {...props}
    />
  )
);
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const enhancedCardContentVariants = cva("", {
  variants: {
    spacing: {
      none: "pt-0",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

interface EnhancedCardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardContentVariants> {}

const EnhancedCardContent = React.forwardRef<HTMLDivElement, EnhancedCardContentProps>(
  ({ className, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardContentVariants({ spacing }), className)}
      {...props}
    />
  )
);
EnhancedCardContent.displayName = "EnhancedCardContent";

const enhancedCardFooterVariants = cva("flex items-center", {
  variants: {
    spacing: {
      none: "pt-0",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    spacing: "md",
    justify: "start",
  },
});

interface EnhancedCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardFooterVariants> {}

const EnhancedCardFooter = React.forwardRef<HTMLDivElement, EnhancedCardFooterProps>(
  ({ className, spacing, justify, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardFooterVariants({ spacing, justify }), className)}
      {...props}
    />
  )
);
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
};
