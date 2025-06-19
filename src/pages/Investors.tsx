import { useState } from "react";
import {
  Flame,
  BookOpen,
  Blocks,
  Layers,
  TrendingUp,
  BarChart3,
  Coins,
} from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import FAQ from "../components/FAQ";
import ApplicationForm from "../components/ApplicationForm";
import HeroSection from "../components/ui/hero-section";
import Section from "../components/ui/section";
import ProcessSection from "../components/ui/process-section";
import StatsSection from "../components/ui/stats-section";
import { designTokens } from "../lib/design-system";

const Investors = () => {
  const [showForm, setShowForm] = useState(false);

  const features = [
    {
      icon: "📈",
      title: "Diversified RWA Exposure",
      description:
        "Invest in human capital through stablecoin-backed Income Share Agreements as a new asset class.",
    },
    {
      icon: "🎯",
      title: "Transparent Metrics",
      description:
        "Access real-time performance data, repayment rates, and ROI analytics through our investor dashboard.",
    },
    {
      icon: "💎",
      title: "Stable Returns",
      description:
        "Generate yield from high-demand Web3 talent with historical repayment rates exceeding traditional education loans.",
    },
    {
      icon: "🔄",
      title: "Liquidity Options",
      description:
        "Future secondary market capabilities for ISA trading and early liquidity events (roadmap feature).",
    },
  ];

  const performanceData = [
    {
      metric: "Target IRR",
      value: "8-12%",
      description: "Based on Web3 salary growth trends",
      color: "green" as const,
    },
    {
      metric: "Avg. Payback Period",
      value: "3-5 years",
      description: "Capped at 10% of income annually",
      color: "blue" as const,
    },
    {
      metric: "Job Placement Rate",
      value: "92%",
      description: "Within 6 months of graduation",
      color: "purple" as const,
    },
  ];

  const marketStats = [
    {
      value: "$1.2T",
      label: "Web3 Market Cap",
      description: "Total value locked across DeFi and Web3 protocols",
      color: "blue" as const,
    },
    {
      value: "3.7M",
      label: "Developer Shortage",
      description: "Unfilled Web3 developer positions globally",
      color: "purple" as const,
    },
    {
      value: "$140K",
      label: "Average Salary",
      description: "Starting salary for Web3 developers",
      color: "green" as const,
    },
  ];

  const investmentSteps = [
    {
      number: 1,
      title: "Due Diligence & Onboarding",
      description:
        "Complete investor verification and review investment documentation including risk factors and performance projections.",
      icon: <BookOpen size={20} />,
    },
    {
      number: 2,
      title: "Fund Your Investment",
      description:
        "Deploy USDC/USDT to fund student salaries while they complete the intensive 6-month Web3 development program.",
      icon: <Coins size={20} />,
    },
    {
      number: 3,
      title: "Generate Returns",
      description:
        "Receive quarterly distributions as graduates enter high-paying Web3 roles and begin income share payments.",
      icon: <TrendingUp size={20} />,
    },
  ];

  const roadmapSteps = [
    {
      quarter: "Q2",
      title: "Fund Launch",
      description: "Initial investor round and first cohort funding",
      color: "blue",
    },
    {
      quarter: "Q3",
      title: "Performance Data",
      description: "First graduation metrics and repayment initiation",
      color: "purple",
    },
    {
      quarter: "Q4",
      title: "Secondary Market",
      description: "ISA trading platform and liquidity options",
      color: "green",
    },
  ];

  const faqs = [
    {
      question: "How do stablecoin-backed ISAs work as an investment?",
      answer:
        "Investors fund student salaries during the program using USDC/USDT. Students repay a percentage of their future income over a fixed period. Returns are generated from the income share payments, creating a yield-generating asset backed by human capital.",
    },
    {
      question: "What are the expected returns and timeline?",
      answer:
        "Historical data shows 8-12% IRR with 3-5 year payback periods. Students typically secure jobs within 6 months of graduation, with starting salaries ranging from $80k-150k in Web3 roles.",
    },
    {
      question: "How is this different from traditional education funding?",
      answer:
        "Unlike fixed education loans, ISAs align investor and student incentives. Returns are tied to student success, making it a performance-based investment. The Web3 focus also targets a high-growth, high-salary market.",
    },
    {
      question: "What risk mitigation strategies are in place?",
      answer:
        "Portfolio diversification across cohorts, rigorous student selection, industry partnerships for job placement, and caps on repayment amounts. We also maintain reserves for operational continuity.",
    },
    {
      question: "When will secondary market liquidity be available?",
      answer:
        "We're developing secondary market infrastructure for Q4 2024, allowing investors to trade ISA positions and access earlier liquidity. This will include fractional ownership and automated market making.",
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
          text: "Invest with Excellence",
        }}
        title="Invest in Human Capital"
        subtitle="The next frontier of Real World Assets"
        description="Generate stable returns by investing in the future of Web3 talent through innovative stablecoin-backed Income Share Agreements."
        features={[
          {
            icon: <TrendingUp size={20} className="text-forge-orange" />,
            text: "8-12% Target IRR",
          },
          {
            icon: <BarChart3 size={20} className="text-forge-orange" />,
            text: "Real-time Analytics",
          },
          {
            icon: <Blocks size={20} className="text-forge-orange" />,
            text: "Web3 Focus",
          },
        ]}
        ctaText="Earn with the Next Cohort"
        onCtaClick={() => setShowForm(true)}
        image={{
          src: "https://cdn.builder.io/api/v1/assets/a59c9d8d677c4c99bcaffef64866607b/screenshot-2025-06-18-at-19.03.17-ae9e74?format=webp&width=800",
          alt: "Human Capital Network Investment Illustration",
        }}
        floatingBadge={{
          text: "Investment Analytics",
        }}
        floatingStatus={{
          text: "Live Returns",
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
            A New Asset Class is Born
          </h2>
          <p className="text-xl text-forge-gray max-w-3xl mx-auto">
            Web3 has created new opportunities for yield generation. Human
            capital represents the next evolution of Real World Assets.
          </p>
        </div>

        <div className={designTokens.patterns.layout.featureGrid}>
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

      <ProcessSection
        title="Investment Process"
        titleIcon={<TrendingUp size={32} className="text-forge-orange" />}
        steps={investmentSteps}
        calloutCard={{
          title: "Next Investment Round",
          highlight: "March 2025",
          subtitle: "Limited to qualified investors",
          description: "Minimum Investment",
          ctaText: "Join the Investment Round",
          onCtaClick: () => setShowForm(true),
          decorativeIcon: <Layers size={48} className="text-forge-orange" />,
        }}
      />

      {/* Investment Performance Section */}
      <Section variant="content">
        <div className={designTokens.patterns.layout.heroGrid}>
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6 tracking-tight">
              Investment Performance
            </h2>
            <div className="space-y-6">
              {performanceData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-forge-gray">{item.metric}</span>
                    <span
                      className={`text-2xl font-bold ${
                        item.color === "green"
                          ? "text-green-600"
                          : item.color === "blue"
                            ? "text-blue-600"
                            : "text-purple-600"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-forge-gray/80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-forge-cream relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-10">
              <BarChart3 size={48} className="text-forge-orange" />
            </div>

            <h3 className="text-3xl font-bold text-forge-dark mb-6 text-center relative z-10">
              Investment Structure
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="border-l-4 border-forge-orange pl-4">
                <h4 className="font-semibold text-forge-dark">
                  Minimum Investment
                </h4>
                <p className="text-forge-gray">$10,000 USDC/USDT</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-forge-dark">Fund Duration</h4>
                <p className="text-forge-gray">
                  7-year fund life with extension options
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-forge-dark">
                  Distribution Schedule
                </h4>
                <p className="text-forge-gray">
                  Quarterly distributions based on collections
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-forge-dark">
                  Management Fee
                </h4>
                <p className="text-forge-gray">
                  2% annually + 20% performance fee
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-forge-orange text-white py-3 rounded-2xl font-semibold hover:bg-forge-orange-light transition-all duration-200 mt-6 transform hover:scale-[1.02] shadow-lg hover:shadow-xl relative group overflow-hidden"
            >
              <span className="relative z-10">Join the Investment Round</span>
              <div className="absolute inset-0 bg-gradient-to-r from-forge-orange to-forge-orange-light opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </Section>

      <StatsSection
        title="Market Opportunity"
        subtitle="The Web3 talent shortage creates unprecedented opportunity for investors backing education innovation."
        stats={marketStats}
        variant="dark"
      />

      {/* Roadmap Section */}
      <Section
        variant="content"
        className="bg-gradient-to-r from-gray-50 to-purple-50"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-8 tracking-tight">
            Roadmap to Liquidity
          </h2>
          <div className={designTokens.patterns.layout.statsGrid}>
            {roadmapSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-sm border border-forge-cream hover:shadow-lg hover:border-forge-orange/20 transition-all duration-300"
              >
                <div
                  className={`bg-${step.color}-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}
                >
                  <span className={`text-${step.color}-600 font-bold`}>
                    {step.quarter}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-forge-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-forge-gray">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

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
