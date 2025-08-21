"use client";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "hero" | "subtle" | "dark";
  className?: string;
}

export const AnimatedBackground = ({ 
  variant = "hero", 
  className = "" 
}: AnimatedBackgroundProps) => {
  
  const backgrounds = {
    hero: (
      <>
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)]"
          animate={{ 
            background: [
              "radial-gradient(circle_at_20%_30%,rgba(232,122,71,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(45,58,46,0.1),transparent_50%),radial-gradient(circle_at_40%_70%,rgba(245,242,232,0.2),transparent_50%)",
              "radial-gradient(circle_at_40%_20%,rgba(232,122,71,0.2),transparent_50%),radial-gradient(circle_at_60%_40%,rgba(45,58,46,0.15),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(245,242,232,0.25),transparent_50%)",
              "radial-gradient(circle_at_60%_60%,rgba(232,122,71,0.18),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(45,58,46,0.12),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(245,242,232,0.22),transparent_50%)"
            ]
          }}
          transition={{ 
            duration: 8, 
            ease: "easeInOut", 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-forge-orange/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </>
    ),
    
    subtle: (
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-forge-cream/50 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    ),
    
    dark: (
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-forge-dark via-forge-dark to-forge-dark/90"
        animate={{ 
          background: [
            "linear-gradient(135deg, #2D3A2E 0%, #2D3A2E 50%, rgba(45,58,46,0.9) 100%)",
            "linear-gradient(135deg, rgba(45,58,46,0.95) 0%, #2D3A2E 50%, #2D3A2E 100%)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
    )
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {backgrounds[variant]}
    </div>
  );
};
