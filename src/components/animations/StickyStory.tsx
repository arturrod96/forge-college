"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

interface StoryStep {
  title: string;
  description: string;
  highlight?: string;
}

interface StickyStoryProps {
  title: string;
  codeBlock: string;
  steps: StoryStep[];
}

export const StickyStory = ({ title, codeBlock, steps }: StickyStoryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end end"] 
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);

  return (
    <section 
      ref={ref} 
      className="relative grid gap-10 lg:grid-cols-2 lg:gap-16 min-h-[160vh] lg:min-h-[200vh] px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-20"
    >
      {/* Painel fixo */}
      <div className="lg:sticky lg:top-24 self-start mb-8 lg:mb-0">
        <motion.div 
          style={{ rotate, scale }}
          className="rounded-3xl shadow-2xl p-5 sm:p-6 bg-forge-dark text-forge-cream overflow-hidden relative border border-forge-orange/20"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-forge-orange animate-pulse" />
              <span className="text-forge-orange font-medium text-sm">Live Code</span>
            </div>
            
            <pre className="text-xs sm:text-sm overflow-auto text-forge-cream/90 leading-relaxed">
              <code>{codeBlock}</code>
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Blocos que entram conforme o scroll */}
      <div className="space-y-20 sm:space-y-28 lg:space-y-32 py-16 sm:py-24">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-forge-dark mb-8">
            {title}
          </h2>
        </Reveal>
        
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="max-w-prose">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-forge-dark mb-4">
                {step.title}
                {step.highlight && (
                  <span className="text-forge-orange ml-2">{step.highlight}</span>
                )}
              </h3>
              <p className="text-base sm:text-lg text-forge-gray leading-relaxed">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
