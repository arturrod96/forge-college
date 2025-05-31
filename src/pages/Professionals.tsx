
import { useState } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import FAQ from '../components/FAQ';
import ApplicationForm from '../components/ApplicationForm';

const Professionals = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: '💰',
      title: 'Get Paid to Learn',
      description: 'Receive salaries in USDC/USDT while you learn cutting-edge Web3 development skills.'
    },
    {
      icon: '🚀',
      title: 'Real-World Projects',
      description: 'Work on actual Web3 projects from leading companies, building your portfolio while learning.'
    },
    {
      icon: '🎯',
      title: 'No Upfront Cost',
      description: 'Income Share Agreement means you only pay after landing your dream Web3 job.'
    },
    {
      icon: '🌐',
      title: 'Hiring Network',
      description: 'Access our curated network of Web3 companies actively seeking talented developers.'
    }
  ];

  const faqs = [
    {
      question: 'How does the "get paid to learn" model work?',
      answer: 'Students receive monthly payments in USDC/USDT during the program to cover living expenses while focusing on intensive learning. This is funded through our Income Share Agreement model.'
    },
    {
      question: 'What is an Income Share Agreement (ISA)?',
      answer: 'An ISA means you pay nothing upfront. After completing the program and landing a job, you pay back a percentage of your income for a fixed period, only when you\'re earning above a minimum threshold.'
    },
    {
      question: 'What kind of projects will I work on?',
      answer: 'You\'ll work on real Web3 projects submitted by our partner companies, including DeFi protocols, NFT platforms, DAOs, and blockchain infrastructure projects.'
    },
    {
      question: 'How long is the program?',
      answer: 'The intensive program runs for 6 months, combining theoretical learning with hands-on project work and mentorship from industry experts.'
    },
    {
      question: 'What if I don\'t find a job after the program?',
      answer: 'If you don\'t secure a qualifying job within 12 months of graduation, you owe nothing under the ISA. We\'re invested in your success.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Get Paid to Learn Web3"
        subtitle="Master blockchain development while earning USDC/USDT"
        description="Join the only Web3 education program where you earn while you learn. Work on real projects, get mentored by industry experts, and access our exclusive hiring network."
        ctaText="Apply to Join the Next Cohort"
        onCtaClick={() => setShowForm(true)}
        gradient=""
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Why Choose Forge College?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've reimagined education for the Web3 era, where learning is an investment in your future, not a burden.
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

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                The Future of Education is Here
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="bg-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Apply & Get Accepted</h3>
                    <p className="text-gray-600 leading-relaxed">Submit your application and go through our selection process designed to identify high-potential candidates.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="bg-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn While Earning</h3>
                    <p className="text-gray-600 leading-relaxed">Start your 6-month journey, receiving monthly payments while mastering Web3 development on real projects.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="bg-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Land Your Dream Job</h3>
                    <p className="text-gray-600 leading-relaxed">Graduate with a strong portfolio and get connected to our network of hiring partners actively seeking talent.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Next Cohort Starts</h3>
                <p className="text-5xl font-bold text-orange-500 mb-3">March 2024</p>
                <p className="text-lg text-gray-600 mb-8">Limited to 30 students</p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Monthly Payment During Program</p>
                  <p className="text-4xl font-bold text-gray-900">$3,000 USDC</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Secure Your Spot
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} />

      <ApplicationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Apply to Join the Next Cohort"
        formType="professional"
      />
    </div>
  );
};

export default Professionals;
