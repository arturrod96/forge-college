import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesignBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
  className?: string;
}

const DesignBadge = ({
  children,
  icon = <Flame size={20} />,
  variant = "primary",
  className,
}: DesignBadgeProps) => {
  const variantClasses = {
    primary: "bg-forge-orange/10 text-forge-orange",
    secondary: "bg-forge-dark/10 text-forge-dark",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};

export default DesignBadge;
