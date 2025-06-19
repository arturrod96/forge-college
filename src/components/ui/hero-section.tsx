import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import Section from "./section";
import DesignBadge from "./design-badge";
import EnhancedButton from "./enhanced-button";
import { designTokens } from "@/lib/design-system";

interface FeatureHighlight {
  icon: React.ReactNode;
  text: string;
}

interface HeroSectionProps {
  badge?: {
    icon?: React.ReactNode;
    text: string;
  };
  title: string;
  subtitle: string;
  description: string;
  features?: FeatureHighlight[];
  ctaText: string;
  onCtaClick: () => void;
  image: {
    src: string;
    alt: string;
  };
  floatingBadge?: {
    icon?: React.ReactNode;
    text: string;
  };
  floatingStatus?: {
    text: string;
    isActive?: boolean;
  };
}

const HeroSection = ({
  badge,
  title,
  subtitle,
  description,
  features = [],
  ctaText,
  onCtaClick,
  image,
  floatingBadge,
  floatingStatus,
}: HeroSectionProps) => {
  return (
    <Section variant="hero" withDecorations decorationType="blur">
      <div className={designTokens.patterns.layout.heroGrid}>
        <div className="text-left relative">
          {/* Decorative flame icon */}
          <div className="absolute -top-8 -left-4 opacity-10">
            <Flame size={80} className="text-forge-orange" />
          </div>

          {badge && (
            <div className="flex items-center gap-3 mb-6">
              <DesignBadge icon={badge.icon || <Flame size={20} />}>
                {badge.text}
              </DesignBadge>
            </div>
          )}

          <h1
            className={cn(
              designTokens.typography.sizes.hero,
              designTokens.typography.weights.bold,
              "text-forge-dark mb-8 leading-[1.1] tracking-tight",
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              designTokens.typography.sizes.h4,
              designTokens.typography.weights.medium,
              "text-forge-gray mb-6",
            )}
          >
            {subtitle}
          </p>

          <p
            className={cn(
              designTokens.typography.sizes.body,
              "text-forge-gray/80 mb-12 leading-relaxed",
            )}
          >
            {description}
          </p>

          {/* Feature highlights */}
          {features.length > 0 && (
            <div className="flex items-center gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  {feature.icon}
                  <span className="text-sm text-forge-gray">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <EnhancedButton
            onClick={onCtaClick}
            variant="primary"
            size="lg"
            withGradient
          >
            {ctaText}
          </EnhancedButton>
        </div>

        <div className="relative">
          <div className="relative">
            {/* Outer dark green container */}
            <div className="bg-forge-dark rounded-3xl p-4 shadow-2xl border-2 border-forge-orange/20 relative overflow-hidden">
              {/* Grid pattern background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-forge-cream/20"></div>
                  ))}
                </div>
              </div>

              {/* Grey intermediate layer - full width to match image */}
              <div
                className="w-full rounded-2xl relative overflow-hidden"
                style={{
                  backgroundColor: designTokens.colors.forge.greyLayer,
                  padding: "24px 0 24px 1px",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-11/12 h-auto rounded-lg mx-auto relative z-10"
                />
              </div>
            </div>
          </div>

          {floatingBadge && (
            <div className="absolute -top-4 -right-4 bg-forge-orange text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2">
              {floatingBadge.icon || <Flame size={16} />}
              {floatingBadge.text}
            </div>
          )}

          {floatingStatus && (
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-forge-cream">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    floatingStatus.isActive
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400",
                  )}
                ></div>
                <span className="text-sm font-medium text-forge-dark">
                  {floatingStatus.text}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
