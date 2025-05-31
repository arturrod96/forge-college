
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
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="text-xl lg:text-2xl text-gray-600 mb-6 font-medium max-w-4xl mx-auto">
          {subtitle}
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <button
          onClick={onCtaClick}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
