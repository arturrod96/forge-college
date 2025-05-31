
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
    <div className="min-h-screen">
      <Hero
        title="Build the Future Workforce"
        subtitle="Sponsor high-potential Web3 developers and shape their training"
        description="Partner with Forge College to create a direct pipeline of skilled Web3 developers trained on your projects and technologies."
        ctaText="Sponsor the Next Cohort"
        onCtaClick={() => setShowForm(true)}
        gradient="bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600"
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Partner with Forge College?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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

      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Partnership Tiers
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Partner</h3>
                  <p className="text-gray-600 mb-4">Submit projects for students to work on and get early access to hiring pipeline.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 2-3 project submissions per cohort</li>
                    <li>• Access to student portfolios</li>
                    <li>• Hiring pipeline access</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 border-2">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Curriculum Sponsor</h3>
                  <p className="text-gray-600 mb-4">Co-design curriculum modules and sponsor student salaries while they work on your projects.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Curriculum influence</li>
                    <li>• Sponsor 3-5 students</li>
                    <li>• Dedicated hiring events</li>
                    <li>• Brand partnership benefits</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ecosystem Partner</h3>
                  <p className="text-gray-600 mb-4">Comprehensive partnership including curriculum design, student sponsorship, and exclusive hiring rights.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full curriculum partnership</li>
                    <li>• Sponsor entire cohort track</li>
                    <li>• Exclusive hiring window</li>
                    <li>• Advisory board seat</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Partnership Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Direct access to top 5% Web3 talent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Real project outcomes and IP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Reduced recruitment costs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Brand exposure to Web3 community</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">Advisory role in program development</span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Trusted by Leading Web3 Companies
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Join innovative companies that are already building the future workforce through Forge College partnerships.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-white/10 rounded-lg p-6 h-20 flex items-center justify-center">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/10 rounded-lg p-6 h-20 flex items-center justify-center">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/10 rounded-lg p-6 h-20 flex items-center justify-center">
              <span className="text-lg font-semibold">Partner Logo</span>
            </div>
            <div className="bg-white/10 rounded-lg p-6 h-20 flex items-center justify-center">
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
