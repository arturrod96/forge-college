import { useState } from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import FAQ from '../components/FAQ';
import ApplicationForm from '../components/ApplicationForm';
import { Flame } from 'lucide-react';

const Investors = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: '📈',
      title: 'Diversified RWA Exposure',
      description: 'Invest in human capital through stablecoin-backed Income Share Agreements as a new asset class.'
    },
    {
      icon: '🎯',
      title: 'Transparent Metrics',
      description: 'Access real-time performance data, repayment rates, and ROI analytics through our investor dashboard.'
    },
    {
      icon: '💎',
      title: 'Stable Returns',
      description: 'Generate yield from high-demand Web3 talent with historical repayment rates exceeding traditional education loans.'
    },
    {
      icon: '🔄',
      title: 'Liquidity Options',
      description: 'Future secondary market capabilities for ISA trading and early liquidity events (roadmap feature).'
    }
  ];

  const faqs = [
    {
      question: 'How do stablecoin-backed ISAs work as an investment?',
      answer: 'Investors fund student salaries during the program using USDC/USDT. Students repay a percentage of their future income over a fixed period. Returns are generated from the income share payments, creating a yield-generating asset backed by human capital.'
    },
    {
      question: 'What are the expected returns and timeline?',
      answer: 'Historical data shows 8-12% IRR with 3-5 year payback periods. Students typically secure jobs within 6 months of graduation, with starting salaries ranging from $80k-150k in Web3 roles.'
    },
    {
      question: 'How is this different from traditional education funding?',
      answer: 'Unlike fixed education loans, ISAs align investor and student incentives. Returns are tied to student success, making it a performance-based investment. The Web3 focus also targets a high-growth, high-salary market.'
    },
    {
      question: 'What risk mitigation strategies are in place?',
      answer: 'Portfolio diversification across cohorts, rigorous student selection, industry partnerships for job placement, and caps on repayment amounts. We also maintain reserves for operational continuity.'
    },
    {
      question: 'When will secondary market liquidity be available?',
      answer: 'We\'re developing secondary market infrastructure for Q4 2024, allowing investors to trade ISA positions and access earlier liquidity. This will include fractional ownership and automated market making.'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-forge-cream to-forge-cream/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <h1 className="text-5xl lg:text-7xl font-bold text-forge-dark mb-8 leading-[1.1] tracking-tight">
                Invest in Human Capital
              </h1>
              <p className="text-xl lg:text-2xl text-forge-gray mb-6 font-medium">
                The next frontier of Real World Assets
              </p>
              <p className="text-lg text-forge-gray/80 mb-12 leading-relaxed">
                Generate stable returns by investing in the future of Web3 talent through innovative stablecoin-backed Income Share Agreements.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-forge-orange text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-forge-orange-light transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Earn with the Next Cohort
              </button>
            </div>
            <div className="relative">
              <div className="bg-forge-dark rounded-3xl p-8 shadow-2xl border-2 border-forge-orange/20 relative overflow-hidden">
                <img 
                  src="/lovable-uploads/3ef539ce-b669-48a6-84f5-7ec5234c4830.png" 
                  alt="Investment Dashboard" 
                  className="w-full h-auto rounded-2xl relative z-10"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-forge-orange text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2">
                <Flame size={16} />
                Investment Analytics
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-forge-cream">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-forge-dark">Live Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-forge-dark mb-4">
              A New Asset Class is Born
            </h2>
            <p className="text-lg text-forge-gray max-w-3xl mx-auto">
              Web3 has created new opportunities for yield generation. Human capital represents the next evolution of Real World Assets.
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

      <section className="py-16 bg-forge-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-forge-dark mb-6">
                Investment Performance
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-forge-gray">Target IRR</span>
                    <span className="text-2xl font-bold text-green-600">8-12%</span>
                  </div>
                  <p className="text-sm text-forge-gray/80">Based on Web3 salary growth trends</p>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-forge-gray">Avg. Payback Period</span>
                    <span className="text-2xl font-bold text-blue-600">3-5 years</span>
                  </div>
                  <p className="text-sm text-forge-gray/80">Capped at 10% of income annually</p>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-forge-gray">Job Placement Rate</span>
                    <span className="text-2xl font-bold text-purple-600">92%</span>
                  </div>
                  <p className="text-sm text-forge-gray/80">Within 6 months of graduation</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-forge-cream">
              <h3 className="text-2xl font-bold text-forge-dark mb-6 text-center">Investment Structure</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-forge-orange pl-4">
                  <h4 className="font-semibold text-forge-dark">Minimum Investment</h4>
                  <p className="text-forge-gray">$10,000 USDC/USDT</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-forge-dark">Fund Duration</h4>
                  <p className="text-forge-gray">7-year fund life with extension options</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-forge-dark">Distribution Schedule</h4>
                  <p className="text-forge-gray">Quarterly distributions based on collections</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-forge-dark">Management Fee</h4>
                  <p className="text-forge-gray">2% annually + 20% performance fee</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-forge-orange text-white py-3 rounded-2xl font-semibold hover:bg-forge-orange-light transition-all duration-200 mt-6 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Join the Investment Round
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Market Opportunity
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The Web3 talent shortage creates unprecedented opportunity for investors backing education innovation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">$1.2T</div>
              <div className="text-lg font-semibold text-forge-dark mb-2">Web3 Market Cap</div>
              <p className="text-forge-gray">Total value locked across DeFi and Web3 protocols</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">3.7M</div>
              <div className="text-lg font-semibold text-forge-dark mb-2">Developer Shortage</div>
              <p className="text-forge-gray">Unfilled Web3 developer positions globally</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">$140K</div>
              <div className="text-lg font-semibold text-forge-dark mb-2">Average Salary</div>
              <p className="text-forge-gray">Starting salary for Web3 developers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Roadmap to Liquidity
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">Q2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fund Launch</h3>
              <p className="text-gray-600">Initial investor round and first cohort funding</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">Q3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Data</h3>
              <p className="text-gray-600">First graduation metrics and repayment initiation</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">Q4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secondary Market</h3>
              <p className="text-gray-600">ISA trading platform and liquidity options</p>
            </div>
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} />

      <ApplicationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Join the Investment Round"
        formType="investor"
      />
    </div>
  );
};

export default Investors;
