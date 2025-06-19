import { useState } from "react";
import { Flame, BookOpen, Blocks, Layers } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import FAQ from "../components/FAQ";
import ApplicationForm from "../components/ApplicationForm";
import HeroSection from "../components/ui/hero-section";
import Section from "../components/ui/section";
import ProcessSection from "../components/ui/process-section";

const Professionals = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: "💰",
      title: "Get Paid to Learn",
      description:
        "Receive salaries in USDC/USDT while you learn cutting-edge Web3 development skills.",
    },
    {
      icon: "🚀",
      title: "Real-World Projects",
      description:
        "Work on actual Web3 projects from leading companies, building your portfolio while learning.",
    },
    {
      icon: "🎯",
      title: "No Upfront Cost",
      description:
        "Income Share Agreement means you only pay after landing your dream Web3 job.",
    },
    {
      icon: "🌐",
      title: "Hiring Network",
      description:
        "Access our curated network of Web3 companies actively seeking talented developers.",
    },
  ];

  const faqs = [
    {
      question: 'How does the "get paid to learn" model work?',
      answer:
        "Students receive monthly payments in USDC/USDT during the program to cover living expenses while focusing on intensive learning. This is funded through our Income Share Agreement model.",
    },
    {
      question: "What is an Income Share Agreement (ISA)?",
      answer:
        "An ISA means you pay nothing upfront. After completing the program and landing a job, you pay back a percentage of your income for a fixed period, only when you're earning above a minimum threshold.",
    },
    {
      question: "What kind of projects will I work on?",
      answer:
        "You'll work on real Web3 projects submitted by our partner companies, including DeFi protocols, NFT platforms, DAOs, and blockchain infrastructure projects.",
    },
    {
      question: "How long is the program?",
      answer:
        "The intensive program runs for 6 months, combining theoretical learning with hands-on project work and mentorship from industry experts.",
    },
    {
      question: "What if I don't find a job after the program?",
      answer:
        "If you don't secure a qualifying job within 12 months of graduation, you owe nothing under the ISA. We're invested in your success.",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-forge-cream/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>

      <HeroSection
        badge={{
          text: "Forge Your Future",
        }}
        title="Get Paid to Learn Web3"
        subtitle="Master blockchain development while earning USDC/USDT"
        description="Join the only Web3 education program where you earn while you learn. Work on real projects, get mentored by industry experts, and access our exclusive hiring network."
        features={[
          {
            icon: <BookOpen size={20} className="text-forge-orange" />,
            text: "6-Month Program",
          },
          {
            icon: <Blocks size={20} className="text-forge-orange" />,
            text: "Real Projects",
          },
          {
            icon: <Layers size={20} className="text-forge-orange" />,
            text: "Web3 Focus",
          },
        ]}
        ctaText="Apply to Join the Next Cohort"
        onCtaClick={() => setShowForm(true)}
        image={{
          src: "/lovable-uploads/fbcd41bd-99fb-4e15-9ea4-37fb6139005e.png",
          alt: "Forge College Smart Contract Code",
        }}
        floatingBadge={{
          text: "Learn by Building",
        }}
        floatingStatus={{
          text: "Live Coding",
          isActive: true,
        }}
      />

      {/* Enhanced features section with decorative elements */}
      <Section variant="content">
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="flex items-center gap-2 opacity-20"></div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6 tracking-tight">
            Why Choose Forge College?
          </h2>
          <p className="text-xl text-forge-gray max-w-3xl mx-auto">
            We've reimagined education for the Web3 era, where learning is an
            investment in your future, not a burden.
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
      </Section>

      {/* Enhanced process section */}
      <section className="py-20 bg-forge-cream/30 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-forge-orange/10"></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Flame size={32} className="text-forge-orange" />
                <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark tracking-tight">
                  The Future of Education is Here
                </h2>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="bg-forge-orange rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-forge-dark mb-3 flex items-center gap-2">
                      Apply & Get Accepted
                      <BookOpen
                        size={20}
                        className="text-forge-orange opacity-60"
                      />
                    </h3>
                    <p className="text-forge-gray leading-relaxed">
                      Submit your application and go through our selection
                      process designed to identify high-potential candidates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 group">
                  <div className="bg-forge-orange rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-forge-dark mb-3 flex items-center gap-2">
                      Learn While Earning
                      <Flame
                        size={20}
                        className="text-forge-orange opacity-60"
                      />
                    </h3>
                    <p className="text-forge-gray leading-relaxed">
                      Start your 6-month journey, receiving monthly payments
                      while mastering Web3 development on real projects.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 group">
                  <div className="bg-forge-orange rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-forge-dark mb-3 flex items-center gap-2">
                      Land Your Dream Job
                      <Blocks
                        size={20}
                        className="text-forge-orange opacity-60"
                      />
                    </h3>
                    <p className="text-forge-gray leading-relaxed">
                      Graduate with a strong portfolio and get connected to our
                      network of hiring partners actively seeking talent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-forge-cream relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10"></div>

              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Flame size={24} className="text-forge-orange" />
                  <h3 className="text-3xl font-bold text-forge-dark">
                    Next Cohort Starts
                  </h3>
                </div>
                <p className="text-5xl font-bold text-forge-orange mb-3">
                  March 2025
                </p>
                <p className="text-lg text-forge-gray mb-8">
                  Limited to 10 students
                </p>
                <div className="bg-forge-cream/50 rounded-2xl p-6 mb-8 relative">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Blocks size={20} className="text-forge-orange" />
                  </div>
                  <p className="text-sm font-medium text-forge-gray uppercase tracking-wide mb-2">
                    Monthly Payment During Program
                  </p>
                  <p className="text-4xl font-bold text-forge-dark">
                    $3,000 USDC
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-forge-dark text-white px-8 py-4 rounded-2xl font-semibold hover:bg-forge-dark/90 transition-all duration-200 transform hover:scale-[1.02] relative group overflow-hidden"
                >
                  <span className="relative z-10">Secure Your Spot</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-forge-dark to-forge-orange opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
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
