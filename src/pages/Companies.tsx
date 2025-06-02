import { useState } from 'react';
import { Flame, BookOpen, Blocks, Layers } from 'lucide-react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import FAQ from '../components/FAQ';
import ApplicationForm from '../components/ApplicationForm';

const Companies = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: '🎯',
      title: 'Qualified Talent Pool',
      description: 'Access developers who have completed real Web3 projects and proven their skills through hands-on experience.'
    },
    {
      icon: '⚡',
      title: 'Fast Hiring Process',
      description: 'Streamlined recruitment with pre-vetted candidates who are ready to contribute from day one.'
    },
    {
      icon: '💼',
      title: 'Project-Based Vetting',
      description: 'Our graduates have worked on actual Web3 projects, giving you confidence in their practical abilities.'
    },
    {
      icon: '🤝',
      title: 'Ongoing Partnership',
      description: 'Build long-term relationships with our institution and get priority access to top graduates.'
    }
  ];

  const faqs = [
    {
      question: 'How are students vetted before joining the program?',
      answer: 'We have a rigorous selection process including technical assessments, portfolio reviews, and interviews to ensure only committed, high-potential candidates enter our program.'
    },
    {
      question: 'What skill level can we expect from graduates?',
      answer: 'Our graduates complete 6 months of intensive training with real Web3 projects, equivalent to 1-2 years of practical experience in blockchain development.'
    },
    {
      question: 'How does the hiring process work?',
      answer: 'We provide you with profiles of graduating students, facilitate interviews, and support the hiring process. You get first access to top performers.'
    },
    {
      question: 'Can we sponsor specific students during the program?',
      answer: 'Yes, we offer sponsorship opportunities where companies can support students during their learning journey and get priority hiring rights.'
    },
    {
      question: 'What technologies do graduates specialize in?',
      answer: 'Our curriculum covers Solidity, Web3.js, React, DeFi protocols, NFTs, DAOs, and popular blockchain frameworks used in modern Web3 development.'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-forge-cream/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>

      {/* Custom hero section for companies */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-forge-cream to-forge-cream/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="text-left relative">
              {/* Decorative flame icon */}
              <div className="absolute -top-8 -left-4 opacity-10">
                <Flame size={80} className="text-forge-orange" />
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-forge-orange/10 px-4 py-2 rounded-full">
                  <Flame size={20} className="text-forge-orange" />
                  <span className="text-sm font-semibold text-forge-orange">Partner with Excellence</span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-forge-dark mb-8 leading-[1.1] tracking-tight">
                Hire Web3 Talent That's Ready to Build
              </h1>
              <p className="text-xl lg:text-2xl text-forge-gray mb-6 font-medium">
                Access skilled developers from our intensive 6-month program
              </p>
              <p className="text-lg text-forge-gray/80 mb-12 leading-relaxed">
                Partner with Forge College to hire developers who have proven their skills on real Web3 projects. Our graduates are job-ready from day one.
              </p>
              
              {/* Feature highlights */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-forge-orange" />
                  <span className="text-sm text-forge-gray">Pre-vetted Talent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Blocks size={20} className="text-forge-orange" />
                  <span className="text-sm text-forge-gray">Project Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={20} className="text-forge-orange" />
                  <span className="text-sm text-forge-gray">Web3 Specialists</span>
                </div>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="bg-forge-orange text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-forge-orange-light transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl relative group overflow-hidden"
              >
                <span className="relative z-10">Partner With Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>

            {/* Right side - Image with updated styling similar to the reference */}
            <div className="relative">
              <div className="relative">
                {/* Outer dark green container with pattern */}
                <div className="bg-forge-dark rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  {/* Grid pattern background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="border border-forge-cream/20"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Cream/beige inner container */}
                  <div className="bg-forge-cream rounded-2xl p-6 relative overflow-hidden">
                    {/* Inner white frame */}
                    <div className="bg-white rounded-xl p-4 shadow-inner relative">
                      <img 
                        src="/lovable-uploads/176191fb-e3a7-447a-b0ce-90fe372c60d1.png" 
                        alt="Partnership illustration" 
                        className="w-full h-auto rounded-lg relative z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-forge-orange text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2">
                <Flame size={16} />
                Ready to Deploy
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-forge-cream">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-forge-dark">Job Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
              <div className="flex items-center gap-2 opacity-20">
                <Flame size={24} className="text-forge-orange" />
                <Flame size={32} className="text-forge-orange" />
                <Flame size={24} className="text-forge-orange" />
              </div>
            </div>
            
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

      {/* Process section */}
      <section className="py-20 bg-forge-cream/30 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-16 grid-rows-16 h-full w-full">
            {Array.from({ length: 256 }).map((_, i) => (
              <div key={i} className="border border-forge-orange/10"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Blocks size={32} className="text-forge-orange" />
                <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark tracking-tight">
                  Partnership Tiers
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream relative overflow-hidden group hover:shadow-lg transition-all duration-200">
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen size={32} className="text-forge-orange" />
                  </div>
                  <h3 className="text-xl font-semibold text-forge-dark mb-3">Project Partner</h3>
                  <p className="text-forge-gray mb-6 leading-relaxed">Submit projects for students to work on and get early access to hiring pipeline.</p>
                  <ul className="text-forge-gray space-y-2">
                    <li>• 2-3 project submissions per cohort</li>
                    <li>• Access to student portfolios</li>
                    <li>• Hiring pipeline access</li>
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-forge-orange/30 relative overflow-hidden group hover:shadow-lg transition-all duration-200">
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Flame size={32} className="text-forge-orange" />
                  </div>
                  <h3 className="text-xl font-semibold text-forge-orange mb-3">Curriculum Sponsor</h3>
                  <p className="text-forge-gray mb-6 leading-relaxed">Co-design curriculum modules and sponsor student salaries while they work on your projects.</p>
                  <ul className="text-forge-gray space-y-2">
                    <li>• Curriculum influence</li>
                    <li>• Sponsor 3-5 students</li>
                    <li>• Dedicated hiring events</li>
                    <li>• Brand partnership benefits</li>
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-forge-cream relative overflow-hidden group hover:shadow-lg transition-all duration-200">
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={32} className="text-forge-orange" />
                  </div>
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
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-forge-cream relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-5">
                <div className="grid grid-cols-4 grid-rows-4 gap-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-forge-orange rounded-full"></div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Flame size={28} className="text-forge-orange" />
                  <h3 className="text-3xl font-bold text-forge-dark">Partnership Benefits</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-forge-orange/20 transition-colors">
                      <span className="text-forge-orange font-bold text-lg">✓</span>
                    </div>
                    <span className="text-forge-gray">Direct access to top 5% Web3 talent</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-forge-orange/20 transition-colors">
                      <span className="text-forge-orange font-bold text-lg">✓</span>
                    </div>
                    <span className="text-forge-gray">Real project outcomes and IP</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-forge-orange/20 transition-colors">
                      <span className="text-forge-orange font-bold text-lg">✓</span>
                    </div>
                    <span className="text-forge-gray">Reduced recruitment costs</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-forge-orange/20 transition-colors">
                      <span className="text-forge-orange font-bold text-lg">✓</span>
                    </div>
                    <span className="text-forge-gray">Brand exposure to Web3 community</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="bg-forge-orange/10 rounded-2xl w-10 h-10 flex items-center justify-center group-hover:bg-forge-orange/20 transition-colors">
                      <span className="text-forge-orange font-bold text-lg">✓</span>
                    </div>
                    <span className="text-forge-gray">Advisory role in program development</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-forge-dark text-white py-4 rounded-2xl font-semibold hover:bg-forge-dark/90 transition-all duration-200 transform hover:scale-[1.02] mt-8 relative group overflow-hidden"
                >
                  <span className="relative z-10">Become a Partner</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-forge-dark to-forge-orange opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced trusted companies section */}
      <section className="py-20 bg-forge-dark text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 opacity-5">
            <Blocks size={120} className="text-white" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-5">
            <Layers size={100} className="text-white" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-3">
            <Flame size={200} className="text-white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Flame size={32} className="text-forge-orange" />
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Trusted by Leading Web3 Companies
            </h2>
          </div>
          <p className="text-xl text-forge-cream/80 mb-16 max-w-3xl mx-auto">
            Join innovative companies that are already building the future workforce through Forge College partnerships.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-8 h-24 flex items-center justify-center border border-white/10 hover:border-forge-orange/30 transition-colors group">
                <div className="flex items-center gap-2">
                  <Blocks size={20} className="text-forge-orange opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-semibold">Partner Logo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} />

      <ApplicationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Partner With Forge College"
        formType="company"
      />
    </div>
  );
};

export default Companies;
