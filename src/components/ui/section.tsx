import React from "react";
import { cn } from "@/lib/utils";
import { getSectionClasses, designTokens } from "@/lib/design-system";

interface SectionProps {
  children: React.ReactNode;
  variant?: "hero" | "content" | "alternate" | "dark";
  className?: string;
  withDecorations?: boolean;
  decorationType?: "blur" | "grid" | "gradient";
}

const Section = ({
  children,
  variant = "content",
  className,
  withDecorations = false,
  decorationType = "blur",
}: SectionProps) => {
  const decorations = {
    blur: (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-forge-cream/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>
    ),
    grid: (
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-forge-orange/10"></div>
          ))}
        </div>
      </div>
    ),
    gradient: (
      <div className="absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent pointer-events-none"></div>
    ),
  };

  return (
    <section className={cn(getSectionClasses(variant), "relative", className)}>
      {withDecorations && decorations[decorationType]}
      <div className={designTokens.spacing.container}>{children}</div>
    </section>
  );
};

export default Section;
