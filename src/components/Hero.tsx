
interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  gradient: string;
}

const Hero = ({ title, subtitle, description, ctaText, onCtaClick, gradient }: HeroProps) => {
  return (
    <section className={`relative py-20 lg:py-32 ${gradient}`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl lg:text-2xl text-white/90 mb-4 font-medium">
          {subtitle}
        </p>
        <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <button
          onClick={onCtaClick}
          className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
