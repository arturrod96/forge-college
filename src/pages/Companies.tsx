
import { useState } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import FAQ from '../components/FAQ';
import ApplicationForm from '../components/ApplicationForm';

const Companies = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: '🎯',
      title: 'Shape the Curriculum',
      description: 'Submit real projects and influence what students learn to match your exact hiring needs.'
    },
    {
      icon: '🔍',
      title: 'Pre-Vetted Talent',
      description: 'Access a pipeline of rigorously selected and trained Web3 developers ready to contribute from day one.'
    },
    {
      icon: '⚡',
      title: 'Reduced Hiring Risk',
      description: 'Evaluate candidates through their work on your actual projects before making hiring decisions.'
    },
    {
      icon: '⏰',
      title: 'Faster Onboarding',
      description: 'Hire developers who already understand your tech stack and have worked on similar projects.'
    }
  ];

  const faqs = [
    {
      question: 'How does project submission work?',
      answer: 'Companies submit real-world projects that align with their tech stack and business needs. Our curriculum team works with you to structure these into effective learning experiences while ensuring students deliver real value.'
    },
    {
      question: 'What level of involvement is required from our team?',
      answer: 'Minimal but impactful. You\'ll provide initial project briefings, periodic check-ins, and final reviews. Most communication happens through our platform with dedicated support from our team.'
    },
    {
      question: 'How do we evaluate students for potential hiring?',
      answer: 'You\'ll have access to student portfolios, project work, peer reviews, and can participate in final presentations. We also facilitate technical interviews and trial periods.'
    },
    {
      question: 'What are the sponsorship costs and benefits?',
      answer: 'Sponsorship costs vary based on involvement level and number of students sponsored. Benefits include hiring pipeline access, project outcomes, brand exposure to Web3 talent, and potential tax advantages.'
    },
    {
      question: 'Can we hire students before they graduate?',
      answer: 'Yes! We encourage early hiring. Students can transition to part-time roles or internships during the program, with full-time positions starting upon graduation.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Build the Future Workforce"
        subtitle="Sponsor high-potential Web3 developers and shape their training"
        description="Partner with Forge College to create a direct pipeline of skilled Web3 developers trained on your projects and technologies."
        ctaText="Sponsor the Next Cohort"
        onCtaClick={() => setShowForm(true)}
        gradient=""
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6 tracking-tight">
              Why Partner with Forge College?
            </h2>
            <p className="text-xl text-forge-gray max-w-3xl mx-auto">
              Transform your hiring strategy by investing in talent development while solving real business challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-forge-cream/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-8 tracking-tight">
                Partnership Tiers
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream">
                  <h3 className="text-xl font-semibold text-forge-dark mb-3">Project Partner</h3>
                  <p className="text-forge-gray mb-6 leading-relaxed">Submit projects for students to work on and get early access to hiring pipeline.</p>
                  <ul className="text-forge-gray space-y-2">
                    <li>• 2-3 project submissions per cohort</li>
                    <li>• Access to student portfolios</li>
                    <li>• Hiring pipeline access</li>
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-forge-orange/30">
                  <h3 className="text-xl font-semibold text-forge-orange mb-3">Curriculum Sponsor</h3>
                  <p className="text-forge-gray mb-6 leading-relaxed">Co-design curriculum modules and sponsor student salaries while they work on your projects.</p>
                  <ul className="text-forge-gray space-y-2">
                    <li>• Curriculum influence</li>
                    <li>• Sponsor 3-5 students</li>
                    <li>• Dedicated hiring events</li>
                    <li>• Brand partnership benefits</li>
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream">
                  <h3 className="text-xl font-semibold text-forge-dark mb-3">Ecosystem Partner</h3>
                  <p className="text-forge-gray mb-6 leading-relaxed">Comprehensive partnership including curriculum design, student sponsorship, and exclusive hiring rights.</p>
                  <ul className="text-forge-gray space-y-2">
                    <li>• Full curriculum partnership</li>
                    <li>• Sponsor entire cohort track</li>
                    <li>• Exclusive hiring window</li>
                    <li>• Advisory board seat</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-forge-cream">
              <h3 className="text-3xl font-bold text-forge-dark mb-8 text-center">Partnership Benefits</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center">
                    <span className="text-forge-orange font-bold text-lg">✓</span>
                  </div>
                  <span className="text-forge-gray">Direct access to top 5% Web3 talent</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center">
                    <span className="text-forge-orange font-bold text-lg">✓</span>
                  </div>
                  <span className="text-forge-gray">Real project outcomes and IP</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center">
                    <span className="text-forge-orange font-bold text-lg">✓</span>
                  </div>
                  <span className="text-forge-gray">Reduced recruitment costs</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center">
                    <span className="text-forge-orange font-bold text-lg">✓</span>
                  </div>
                  <span className="text-forge-gray">Brand exposure to Web3 community</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center">
                    <span className="text-forge-orange font-bold text-lg">✓</span>
                  </div>
                  <span className="text-forge-gray">Advisory role in program development</span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-forge-dark text-white py-4 rounded-2xl font-semibold hover:bg-forge-dark/90 transition-all duration-200 transform hover:scale-[1.02] mt-8"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-forge-dark text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">
            Trusted by Leading Web3 Companies
          </h2>
          <p className="text-xl text-forge-cream/80 mb-16 max-w-3xl mx-auto">
            Join innovative companies that are already building the future workforce through Forge College partnerships.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-white/5 rounded-3xl p-8 h-24 flex items-center justify-center border border-white/10">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 h-24 flex items-center justify-center border border-white/10">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 h-24 flex items-center justify-center border border-white/10">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 h-24 flex items-center justify-center border border-white/10">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} />

      <ApplicationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Partner with Forge College"
        formType="company"
      />
    </div>
  );
};

export default Companies;
