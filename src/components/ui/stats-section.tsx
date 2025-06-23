import React from "react";
import { cn } from "@/lib/utils";
import Section from "./section";
import { designTokens } from "@/lib/design-system";

interface Stat {
  value: string;
  label: string;
  description: string;
  color?: "blue" | "purple" | "green" | "orange";
}

interface StatsSectionProps {
  title: string;
  subtitle?: string;
  stats: Stat[];
  variant?: "light" | "dark";
}

const StatsSection = ({
  title,
  subtitle,
  stats,
  variant = "dark",
}: StatsSectionProps) => {
  const colorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    orange: "text-orange-400",
  };

  const cardClasses =
    variant === "dark"
      ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-forge-orange/30 text-white"
      : "bg-white border-forge-cream hover:shadow-lg hover:border-forge-orange/20 text-forge-dark";

  return (
    <Section variant={variant}>
      <div className="text-center mb-12">
        <h2
          className={cn(
            designTokens.typography.sizes.h1,
            designTokens.typography.weights.bold,
            variant === "dark" ? "text-white" : "text-forge-dark",
            "mb-4",
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              designTokens.typography.sizes.body,
              variant === "dark" ? "text-forge-cream/80" : "text-forge-gray",
              "max-w-3xl mx-auto",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className={designTokens.patterns.layout.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "rounded-3xl p-8 shadow-sm border transition-all duration-300 text-center",
              cardClasses,
            )}
          >
            <div
              className={cn(
                "text-4xl font-bold mb-2",
                stat.color
                  ? colorClasses[stat.color]
                  : variant === "dark"
                    ? "text-white"
                    : "text-forge-dark",
              )}
            >
              {stat.value}
            </div>
            <div
              className={cn(
                "text-lg font-semibold mb-2",
                variant === "dark" ? "text-white" : "text-forge-dark",
              )}
            >
              {stat.label}
            </div>
            <p
              className={cn(
                "text-sm",
                variant === "dark" ? "text-forge-cream/70" : "text-forge-gray",
              )}
            >
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default StatsSection;
