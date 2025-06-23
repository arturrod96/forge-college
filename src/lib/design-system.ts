/**
 * Forge College Design System
 * Centralized design tokens and utility functions for consistent styling
 */

// Color tokens
export const designTokens = {
  colors: {
    forge: {
      orange: "#FF6B35",
      orangeLight: "#FF8C69",
      dark: "#1A1A1A",
      gray: "#6B7280",
      cream: "#FEF7ED",
      greyLayer: "#F3F4F6",
    },
  },
  typography: {
    sizes: {
      hero: "text-5xl lg:text-7xl",
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      body: "text-lg",
      small: "text-sm",
    },
    weights: {
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      normal: "font-normal",
    },
  },
  spacing: {
    container: "max-w-7xl mx-auto px-6 lg:px-8",
  },
  patterns: {
    layout: {
      heroGrid: "grid lg:grid-cols-2 gap-16 items-center",
      featureGrid: "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
      statsGrid: "grid md:grid-cols-3 gap-8",
    },
    heroImage: {
      outerContainer: "bg-forge-dark rounded-3xl p-8 relative overflow-hidden",
      gridPattern: "absolute inset-0 opacity-10",
      greyLayer: "relative z-10 rounded-2xl overflow-hidden",
      greyLayerPadding: "24px",
      imageSize: "w-full h-auto rounded-xl",
    },
  },
};

// Section utility function
export const getSectionClasses = (
  variant: "hero" | "content" | "alternate" | "dark",
) => {
  const baseClasses = "py-20 lg:py-32";

  switch (variant) {
    case "hero":
      return `${baseClasses} bg-gradient-to-br from-forge-cream to-forge-cream/50`;
    case "content":
      return `${baseClasses} bg-white`;
    case "alternate":
      return `${baseClasses} bg-forge-cream/30`;
    case "dark":
      return `${baseClasses} bg-forge-dark text-white`;
    default:
      return `${baseClasses} bg-white`;
  }
};

// Button utility function
export const getButtonClasses = (
  variant: "primary" | "secondary" | "outline" | "ghost",
  size: "sm" | "md" | "lg",
) => {
  const baseClasses =
    "relative group overflow-hidden rounded-2xl font-semibold transition-all duration-200 transform hover:scale-[1.02]";

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-forge-orange text-white hover:bg-forge-orange-light shadow-lg hover:shadow-xl",
    secondary:
      "bg-forge-dark text-white hover:bg-forge-dark/90 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-white",
    ghost: "text-forge-dark hover:bg-forge-cream/50",
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
};
