import {
  EnhancedCard,
  EnhancedCardContent,
} from '@/components/ui/enhanced-card';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <EnhancedCard
      variant="elevated"
      size="lg"
      hover={true}
      interactive={true}
      className={`group relative overflow-hidden border-forge-cream hover:border-forge-orange/20 ${className || ''}`}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        aria-hidden="true"
      >
        <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-forge-orange/20"></div>
          ))}
        </div>
      </div>

      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        aria-hidden="true"
      ></div>

      <EnhancedCardContent spacing="none" className="relative z-10">
        {/* Icon */}
        <div
          className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300"
          role="img"
          aria-label={title}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-forge-dark mb-4 group-hover:text-forge-orange transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-forge-gray leading-relaxed">
          {description}
        </p>
      </EnhancedCardContent>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-forge-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        aria-hidden="true"
      ></div>
    </EnhancedCard>
  );
};

export default FeatureCard;
