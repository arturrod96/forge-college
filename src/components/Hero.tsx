
interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  gradient: string;
}

const Hero = ({ title, subtitle, description, ctaText, onCtaClick }: HeroProps) => {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-forge-cream to-forge-cream/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-5xl lg:text-7xl font-bold text-forge-dark mb-8 leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="text-xl lg:text-2xl text-forge-gray mb-6 font-medium max-w-4xl mx-auto">
          {subtitle}
        </p>
        <p className="text-lg text-forge-gray/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <button
          onClick={onCtaClick}
          className="bg-forge-orange text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-forge-orange-light transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
