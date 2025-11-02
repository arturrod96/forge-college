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
    // Font sizes
    sizes: {
      hero: "text-5xl lg:text-7xl",
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      h5: "text-lg lg:text-xl",
      body: "text-base",
      bodyLarge: "text-lg",
      bodySmall: "text-sm",
      caption: "text-xs",
      overline: "text-xs uppercase",
    },

    // Font weights
    weights: {
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      normal: "font-normal",
      light: "font-light",
    },

    // Line heights
    leading: {
      tight: "leading-tight",      // 1.25
      snug: "leading-snug",        // 1.375
      normal: "leading-normal",    // 1.5
      relaxed: "leading-relaxed",  // 1.625
      loose: "leading-loose",      // 2
    },

    // Letter spacing
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },

    // Complete text styles (combinations)
    styles: {
      // Headings
      displayLarge: "text-5xl lg:text-7xl font-bold leading-tight tracking-tight",
      displayMedium: "text-4xl lg:text-6xl font-bold leading-tight tracking-tight",
      displaySmall: "text-3xl lg:text-5xl font-bold leading-tight tracking-tight",
      h1: "text-4xl lg:text-5xl font-bold leading-tight tracking-tight",
      h2: "text-3xl lg:text-4xl font-semibold leading-tight tracking-tight",
      h3: "text-2xl lg:text-3xl font-semibold leading-snug tracking-tight",
      h4: "text-xl lg:text-2xl font-semibold leading-snug",
      h5: "text-lg lg:text-xl font-semibold leading-snug",
      h6: "text-base lg:text-lg font-semibold leading-snug",

      // Body text
      bodyLarge: "text-lg font-normal leading-relaxed",
      body: "text-base font-normal leading-normal",
      bodySmall: "text-sm font-normal leading-normal",

      // Labels & UI text
      label: "text-sm font-medium leading-none",
      labelLarge: "text-base font-medium leading-none",
      labelSmall: "text-xs font-medium leading-none",

      // Caption & helper text
      caption: "text-xs font-normal leading-normal text-muted-foreground",
      overline: "text-xs font-semibold uppercase tracking-wider",

      // Button text
      buttonLarge: "text-base font-semibold",
      button: "text-sm font-semibold",
      buttonSmall: "text-xs font-semibold",
    },
  },
  spacing: {
    // Container spacing
    container: "max-w-7xl mx-auto px-6 lg:px-8",
    containerNarrow: "max-w-5xl mx-auto px-6 lg:px-8",
    containerWide: "max-w-screen-2xl mx-auto px-6 lg:px-8",

    // Section spacing (vertical)
    section: {
      y: "py-section-y-sm lg:py-section-y",
      yTop: "pt-section-y-sm lg:pt-section-y",
      yBottom: "pb-section-y-sm lg:pb-section-y",
    },

    // Content block spacing
    content: {
      y: "space-y-content-y-sm lg:space-y-content-y",
      yLarge: "space-y-8 lg:space-y-12",
      ySmall: "space-y-4 lg:space-y-6",
    },

    // Element spacing
    element: {
      y: "space-y-element-y",
      yTight: "space-y-element-y-sm",
      x: "space-x-element-x",
      gap: "gap-element-y",
      gapTight: "gap-element-y-sm",
    },

    // Card spacing
    card: {
      padding: "p-card-padding",
      paddingLarge: "p-card-padding-lg",
      gap: "gap-card-gap",
    },
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
const getSectionClasses = (
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
    "relative group inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold transition-all duration-200 transform hover:scale-[1.02]";

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
