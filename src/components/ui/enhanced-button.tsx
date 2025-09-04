import React from "react";
import * as React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { getButtonClasses } from "@/lib/design-system";

interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  withGradient?: boolean;
  withIcon?: boolean;
  asChild?: boolean;
}

const EnhancedButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  withGradient = false,
  withIcon = false,
  className,
  asChild = false,
  ...props
}: EnhancedButtonProps) => {
  const gradientOverlay = withGradient && (
    <div className="absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
  );

  const defaultIcon = withIcon && !icon && <Flame size={16} />;
  const displayIcon = icon || defaultIcon;

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>;
    const mergedClassName = cn(
      getButtonClasses(variant, size),
      childElement.props?.className,
      className
    );

    return React.cloneElement(
      childElement,
      {
        ...props,
        className: mergedClassName,
      },
      <>
        <span className="relative z-10 flex items-center gap-2">
          {displayIcon}
          {childElement.props?.children}
        </span>
        {gradientOverlay}
      </>
    );
  }

  return (
    <button className={cn(getButtonClasses(variant, size), className)} {...props}>
      <span className="relative z-10 flex items-center gap-2">
        {displayIcon}
        {children}
      </span>
      {gradientOverlay}
    </button>
  );
};

export default EnhancedButton;
