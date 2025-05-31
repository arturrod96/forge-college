
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300 group relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
        <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-forge-orange/20"></div>
          ))}
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-forge-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 relative">
          {icon}
          {/* Small decorative dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-forge-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        </div>
        <h3 className="text-xl font-semibold text-forge-dark mb-4 group-hover:text-forge-orange transition-colors duration-200">
          {title}
        </h3>
        <p className="text-forge-gray leading-relaxed">{description}</p>
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-forge-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
    </div>
  );
};

export default FeatureCard;
