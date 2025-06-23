# Forge College Design System

This design system provides a consistent foundation for building UI components across the Forge College application. It's built around the existing patterns found in the Professionals page and extends them to be reusable across all pages.

## Core Design Tokens

### Colors

- **forge-dark**: `#2D3A2E` - Primary dark green for text and dark backgrounds
- **forge-cream**: `#F5F2E8` - Light cream/beige for backgrounds and cards
- **forge-orange**: `#E87A47` - Primary orange for CTAs and accents
- **forge-orange-light**: `#F4A261` - Light orange for hover states
- **forge-gray**: `#8E8E8E` - Secondary text color

### Typography Scale

- **Hero**: `text-5xl lg:text-7xl` - For main page titles
- **H1**: `text-4xl lg:text-5xl` - For section titles
- **H2**: `text-3xl lg:text-4xl` - For subsection titles
- **Body**: `text-base lg:text-lg` - For content text

## Components

### Section

A flexible container component for consistent page layouts.

```tsx
import Section from "@/components/ui/section";

<Section variant="hero" withDecorations decorationType="blur">
  {/* content */}
</Section>;
```

**Variants:**

- `hero` - Hero section with gradient background
- `content` - Standard content section with white background
- `alternate` - Alternate section with cream background
- `dark` - Dark section with forge-dark background

**Decorations:**

- `blur` - Floating blur elements
- `grid` - Grid pattern overlay
- `gradient` - Gradient overlay

### HeroSection

A complete hero section with standardized layout and features.

```tsx
import HeroSection from "@/components/ui/hero-section";

<HeroSection
  badge={{ text: "Forge Your Future" }}
  title="Get Paid to Learn Web3"
  subtitle="Master blockchain development while earning USDC/USDT"
  description="Join the only Web3 education program..."
  features={[{ icon: <BookOpen size={20} />, text: "6-Month Program" }]}
  ctaText="Apply to Join"
  onCtaClick={() => setShowForm(true)}
  image={{ src: "/path/to/image.png", alt: "Description" }}
  floatingBadge={{ text: "Learn by Building" }}
  floatingStatus={{ text: "Live Coding", isActive: true }}
/>;
```

### EnhancedButton

An enhanced button component with consistent styling and hover effects.

```tsx
import EnhancedButton from "@/components/ui/enhanced-button";

<EnhancedButton
  variant="primary"
  size="lg"
  withGradient
  withIcon
  onClick={handleClick}
>
  Apply Now
</EnhancedButton>;
```

**Variants:**

- `primary` - Orange background (default)
- `secondary` - Dark background
- `outline` - Orange border with transparent background
- `ghost` - Transparent with hover effects

**Sizes:**

- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

### DesignBadge

A badge component for highlighting features or status.

```tsx
import DesignBadge from "@/components/ui/design-badge";

<DesignBadge variant="primary" icon={<Flame size={20} />}>
  Forge Your Future
</DesignBadge>;
```

### ProcessSection

A section for displaying step-by-step processes with an optional callout card.

```tsx
import ProcessSection from "@/components/ui/process-section";

<ProcessSection
  title="The Future of Education is Here"
  titleIcon={<Flame size={32} />}
  steps={[
    {
      number: 1,
      title: "Apply & Get Accepted",
      description: "Submit your application...",
      icon: <BookOpen size={20} />,
    },
  ]}
  calloutCard={{
    title: "Next Cohort Starts",
    highlight: "March 2024",
    subtitle: "Limited to 30 students",
    description: "Monthly Payment During Program",
    ctaText: "Secure Your Spot",
    onCtaClick: () => setShowForm(true),
  }}
/>;
```

### StatsSection

A section for displaying statistics or metrics.

```tsx
import StatsSection from "@/components/ui/stats-section";

<StatsSection
  title="Market Opportunity"
  subtitle="The Web3 talent shortage creates unprecedented opportunity..."
  stats={[
    {
      value: "$1.2T",
      label: "Web3 Market Cap",
      description: "Total value locked across DeFi...",
      color: "blue",
    },
  ]}
  variant="dark"
/>;
```

## Usage Guidelines

### Consistent Patterns

1. **Always use the Section component** for page layout consistency
2. **Use HeroSection for page headers** instead of custom hero layouts
3. **Apply decorative elements consistently** using the withDecorations prop
4. **Use EnhancedButton for all CTAs** to maintain visual consistency

### Color Usage

- **Orange**: Primary CTAs, accents, and highlights
- **Dark Green**: Text, secondary buttons, and professional elements
- **Cream**: Backgrounds, cards, and neutral elements
- **Gray**: Secondary text and subtle elements

### Typography

- Use the typography scale from `designTokens` for consistent sizing
- Always pair font sizes with appropriate weights
- Maintain proper hierarchy with heading levels

### Spacing

- Use the spacing scale from `designTokens` for consistent gaps
- Apply container classes for consistent margins
- Use the layout patterns for grid arrangements

### Hover Effects

- All interactive elements should have smooth transitions
- Use the `transform hover:scale-[1.02]` pattern for buttons
- Apply shadow changes on hover for depth

## Extending the Design System

When creating new components:

1. **Follow existing patterns** - Look at current components for inspiration
2. **Use design tokens** - Import and use values from `design-system.ts`
3. **Include hover states** - All interactive elements need hover feedback
4. **Support variants** - Create flexible components with multiple use cases
5. **Document usage** - Add examples and guidelines for new components

## File Structure

```
src/
├── lib/
│   └── design-system.ts      # Core design tokens and utilities
├── components/
│   └── ui/
│       ├── section.tsx       # Base section component
│       ├── hero-section.tsx  # Complete hero section
│       ├── enhanced-button.tsx # Enhanced button component
│       ├── design-badge.tsx  # Badge component
│       ├── process-section.tsx # Process/steps section
│       ├── stats-section.tsx # Statistics section
│       └── README.md         # This documentation
```

This design system ensures visual consistency across all pages while providing the flexibility needed for different content types and layouts.
