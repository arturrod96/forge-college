
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300 group">
      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold text-forge-dark mb-4">{title}</h3>
      <p className="text-forge-gray leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
