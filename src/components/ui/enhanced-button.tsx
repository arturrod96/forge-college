import React from "react";
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
}

const EnhancedButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  withGradient = false,
  withIcon = false,
  className,
  ...props
}: EnhancedButtonProps) => {
  const gradientOverlay = withGradient && (
    <div className="absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
  );

  const defaultIcon = withIcon && !icon && <Flame size={16} />;
  const displayIcon = icon || defaultIcon;

  return (
    <button
      className={cn(getButtonClasses(variant, size), className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {displayIcon}
        {children}
      </span>
      {gradientOverlay}
    </button>
  );
};

export default EnhancedButton;
