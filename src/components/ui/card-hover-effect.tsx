import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverEffectGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Efeito de hover: um retângulo/glow ao redor do card que desliza
 * suavemente entre cards. O efeito fica atrás do card, como um contorno.
 * Cor: laranja Forge (#fb923c / forge-orange-400).
 */
export function HoverEffectGrid({ children, className }: HoverEffectGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [spotlightRect, setSpotlightRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const measure = useCallback(
    (index: number) => {
      const wrapper = wrapperRefs.current.get(index) ?? null;
      const container = containerRef.current;
      if (!wrapper || !container) return;
      const cr = container.getBoundingClientRect();
      const wr = wrapper.getBoundingClientRect();
      setSpotlightRect({
        left: wr.left - cr.left,
        top: wr.top - cr.top,
        width: wr.width,
        height: wr.height,
      });
    },
    []
  );

  const handleEnter = useCallback(
    (index: number) => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      measure(index);
      setHoveredIndex(index);
    },
    [measure]
  );

  const handleLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setSpotlightRect(null);
    }, 50);
  }, []);

  const childArray = React.Children.toArray(children);

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {hoveredIndex !== null && spotlightRect && (
          <motion.div
            key="spotlight"
            className="pointer-events-none absolute rounded-xl z-0"
            initial={false}
            animate={{
              left: spotlightRect.left - 12,
              top: spotlightRect.top - 12,
              width: spotlightRect.width + 24,
              height: spotlightRect.height + 24,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: "rgba(251, 146, 60, 0.4)",
              border: "none",
              boxShadow: "0 0 20px rgba(251, 146, 60, 0.25)",
            }}
          />
        )}
      </AnimatePresence>
      <div className={cn("relative z-10", className)}>
        {childArray.map((child, i) => (
          <div
            key={React.isValidElement(child) && child.key != null ? child.key : i}
            ref={(el) => wrapperRefs.current.set(i, el)}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            className="h-full"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
