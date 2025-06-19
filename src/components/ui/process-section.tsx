import React from "react";
import { cn } from "@/lib/utils";
import Section from "./section";
import EnhancedButton from "./enhanced-button";
import { designTokens } from "@/lib/design-system";

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface CalloutCard {
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  decorativeIcon?: React.ReactNode;
}

interface ProcessSectionProps {
  title: string;
  titleIcon?: React.ReactNode;
  steps: ProcessStep[];
  calloutCard?: CalloutCard;
}

const ProcessSection = ({
  title,
  titleIcon,
  steps,
  calloutCard,
}: ProcessSectionProps) => {
  return (
    <Section variant="alternate" withDecorations decorationType="grid">
      <div className={designTokens.patterns.layout.heroGrid}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            {titleIcon}
            <h2
              className={cn(
                designTokens.typography.sizes.h1,
                designTokens.typography.weights.bold,
                "text-forge-dark tracking-tight",
              )}
            >
              {title}
            </h2>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 group">
                <div className="bg-forge-orange rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-forge-dark mb-3 flex items-center gap-2">
                    {step.title}
                    {step.icon && (
                      <span className="text-forge-orange opacity-60">
                        {step.icon}
                      </span>
                    )}
                  </h3>
                  <p className="text-forge-gray leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {calloutCard && (
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-forge-cream relative overflow-hidden">
            {/* Decorative elements */}
            {calloutCard.decorativeIcon && (
              <div className="absolute top-4 right-4 opacity-10">
                {calloutCard.decorativeIcon}
              </div>
            )}

            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                {titleIcon}
                <h3
                  className={cn(
                    designTokens.typography.sizes.h3,
                    designTokens.typography.weights.bold,
                    "text-forge-dark",
                  )}
                >
                  {calloutCard.title}
                </h3>
              </div>

              <p
                className={cn(
                  designTokens.typography.sizes.hero,
                  designTokens.typography.weights.bold,
                  "text-forge-orange mb-3",
                )}
              >
                {calloutCard.highlight}
              </p>

              <p
                className={cn(
                  designTokens.typography.sizes.body,
                  "text-forge-gray mb-8",
                )}
              >
                {calloutCard.subtitle}
              </p>

              <div className="bg-forge-cream/50 rounded-2xl p-6 mb-8 relative">
                {calloutCard.decorativeIcon && (
                  <div className="absolute top-2 right-2 opacity-20">
                    {React.cloneElement(
                      calloutCard.decorativeIcon as React.ReactElement,
                      { size: 20 },
                    )}
                  </div>
                )}
                <p className="text-sm font-medium text-forge-gray uppercase tracking-wide mb-2">
                  {calloutCard.description}
                </p>
              </div>

              <EnhancedButton
                onClick={calloutCard.onCtaClick}
                variant="secondary"
                size="lg"
                className="w-full"
                withGradient
              >
                {calloutCard.ctaText}
              </EnhancedButton>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default ProcessSection;
