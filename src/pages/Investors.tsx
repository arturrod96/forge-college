import { useState } from "react";
import { ArrowRight, TrendingUp, BarChart3, DollarSign, Shield, Coins, PieChart, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import ApplicationForm from "../components/ApplicationForm";
import { Reveal } from "../components/animations/Reveal";
import { MagneticButton } from "../components/animations/MagneticButton";
import { Marquee } from "../components/animations/Marquee";
import { StickyStory } from "../components/animations/StickyStory";
import { AnimatedBackground } from "../components/animations/AnimatedBackground";

const Investors = () => {
  const [showForm, setShowForm] = useState(false);

  const stats = [
    { value: "8-12%", label: "Target IRR", suffix: "", icon: <TrendingUp className="w-8 h-8" /> },
    { value: "3-5", label: "Year Payback", suffix: "yr", icon: <BarChart3 className="w-8 h-8" /> },
    { value: "92%", label: "Job Placement", suffix: "", icon: <Target className="w-8 h-8" /> },
  ];

  const features = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Diversified RWA Exposure",
      description: "Invest in human capital through stablecoin-backed Income Share Agreements as a new asset class",
      highlight: "New Asset Class"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Transparent Metrics",
      description: "Access real-time performance data, repayment rates, and ROI analytics through our investor dashboard",
      highlight: "Live Analytics"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Stable Returns",
      description: "Generate yield from high-demand Web3 talent with historical repayment rates exceeding traditional education loans",
      highlight: "Proven Model"
    }
  ];

  const marketData = [
    { metric: "$1.2T", label: "Web3 Market Cap", description: "Total value locked across DeFi and Web3 protocols" },
    { metric: "3.7M", label: "Developer Shortage", description: "Unfilled Web3 developer positions globally" },
    { metric: "$140K", label: "Average Salary", description: "Starting salary for Web3 developers" }
  ];

  const performanceData = [
    { metric: "Target IRR", value: "8-12%", description: "Based on Web3 salary growth trends", trend: "up" },
    { metric: "Avg. Payback Period", value: "3-5 years", description: "Capped at 10% of income annually", trend: "neutral" },
    { metric: "Job Placement Rate", value: "92%", description: "Within 6 months of graduation", trend: "up" }
  ];

  const roadmapSteps = [
    { quarter: "Q2", title: "Fund Launch", description: "Initial investor round and first cohort funding" },
    { quarter: "Q3", title: "Performance Data", description: "First graduation metrics and repayment initiation" },
    { quarter: "Q4", title: "Secondary Market", description: "ISA trading platform and liquidity options" }
  ];

  const funds = [
    "Andreessen Horowitz", "Coinbase Ventures", "Paradigm", "Sequoia", "Tiger Global", 
    "Pantera Capital", "Union Square Ventures", "Binance Labs"
  ];

  const testimonials = [
    { quote: "\"Human capital ISAs represent the next evolution of RWA investments.\"", author: "Sarah Johnson, Partner at Web3 Fund" },
    { quote: "\"The alignment of incentives in this model creates sustainable returns.\"", author: "Michael Chen, LP at DeFi Capital" },
    { quote: "\"Finally, an investment that generates returns while solving real problems.\"", author: "Elena Rodriguez, Managing Director" }
  ];

  const codeBlock = `// ISA Investment Smart Contract
contract ForgeISAFund {
  // Investment and return structures
  struct Investment {
    address investor;
    uint256 amountUSDC;
    uint256 expectedReturn;
    uint256 timeframe;
    bool isActive;
  }
  
  // Student income share agreements
  mapping(address => ISATerms) studentISAs;
  
  // Performance tracking
  struct PerformanceMetrics {
    uint256 totalDeployed;
    uint256 totalReturned;
    uint256 currentIRR;
    uint256 activeISAs;
  }
  
  // Investment deployment
  function deployCapital(uint256 amount) public {
    // Fund student salaries (6 months)
    // Track investment allocation
    // Begin performance monitoring
  }
  
  // Return distribution
  function distributeReturns() public {
    // Calculate quarterly distributions
    // Process ISA collections
    // Pay investors based on stake
  }
  
  // Real-time analytics
  function getPortfolioMetrics() public view returns (PerformanceMetrics) {
    // Live IRR calculation
    // Risk-adjusted returns
    // Liquidity positions
  }
}`;

  const storySteps = [
    {
      title: "Human Capital as RWA",
      description: "Web3 has created a new asset class: human capital. Our ISA model tokenizes education investment, creating yield-generating assets backed by high-earning Web3 careers.",
      highlight: "Next-Gen RWA"
    },
    {
      title: "Aligned Incentives",
      description: "Unlike traditional education loans, ISAs align investor and student success. Returns are tied to job placement and salary growth, creating sustainable economics for all parties.",
      highlight: "Win-Win Model"
    },
    {
      title: "Liquidity & Scale",
      description: "Our roadmap includes secondary market infrastructure for ISA trading, fractional ownership, and automated portfolio management. Scale meets liquidity.",
      highlight: "DeFi Integration"
    }
  ];

  return (
    <div className="min-h-screen bg-forge-cream overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-10 px-6">
        <AnimatedBackground variant="hero" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight"
          >
            Invest in
            <br />
            <span className="inline-flex items-center">
              People's Future.
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <TrendingUp className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" />
              </motion.div>
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Generate stable returns by investing in Web3 talent
            <br className="hidden md:block" />
            through innovative stablecoin-backed Income Share Agreements.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <MagneticButton
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
            >
              Join Investment Round
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Fund Marquee */}
      <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p className="text-center text-forge-gray font-medium mb-8">
              Join institutional investors backing the future of work
            </p>
          </Reveal>
          <Marquee className="text-2xl font-bold text-forge-dark/60">
            {funds.map((fund, i) => (
              <span key={i} className="mx-8 hover:text-forge-orange transition-colors">
                {fund}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Investment Performance
            </h2>
            <p className="text-xl text-forge-gray">
              Stable returns from a growing market
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center bg-forge-cream p-8 rounded-3xl border border-forge-orange/20 group hover:border-forge-orange/40 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-forge-orange mb-4 flex justify-center group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-5xl lg:text-6xl font-bold text-forge-dark mb-2">
                    {stat.value}
                    <span className="text-forge-orange text-2xl lg:text-3xl">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-lg text-forge-gray font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-6 bg-forge-dark text-white relative overflow-hidden">
        <AnimatedBackground variant="dark" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-cream mb-6">
              Market Opportunity
            </h2>
            <p className="text-xl text-forge-cream/80">
              The Web3 talent shortage creates unprecedented opportunity
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {marketData.map((item, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center p-8 rounded-3xl border border-forge-orange/20 bg-white/5 backdrop-blur-sm hover:border-forge-orange/40 transition-all duration-300 group"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="text-4xl lg:text-5xl font-bold text-forge-orange mb-3 group-hover:scale-110 transition-transform">
                    {item.metric}
                  </div>
                  <h3 className="text-xl font-bold text-forge-cream mb-2">
                    {item.label}
                  </h3>
                  <p className="text-forge-cream/70">
                    {item.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Story Section */}
      <StickyStory
        title="A New Asset Class is Born"
        codeBlock={codeBlock}
        steps={storySteps}
      />

      {/* Features Grid */}
      <section className="py-20 px-6 bg-forge-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Why Invest in Human Capital?
            </h2>
            <p className="text-xl text-forge-gray">
              Web3 has created new opportunities for yield generation
            </p>
          </Reveal>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div 
                  className="bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group"
                  whileHover={{ y: -8 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-forge-orange-light transition-all duration-200 shadow-lg">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-bold text-forge-orange bg-forge-orange/10 px-3 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-forge-dark mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-forge-gray leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Investment Metrics
            </h2>
            <p className="text-xl text-forge-gray">
              Transparent performance data you can trust
            </p>
          </Reveal>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              {performanceData.map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <motion.div 
                    className="bg-forge-cream p-6 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-forge-gray font-medium">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-forge-dark">{item.value}</span>
                        {item.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-forge-gray/80">{item.description}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
            
            <Reveal delay={0.4}>
              <motion.div 
                className="bg-forge-dark text-white p-8 rounded-3xl border-4 border-forge-orange relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AnimatedBackground variant="dark" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 text-forge-cream">Investment Structure</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-forge-orange pl-4">
                      <h4 className="font-semibold text-forge-cream">Minimum Investment</h4>
                      <p className="text-forge-cream/80">$10,000 USDC/USDT</p>
                    </div>
                    
                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-semibold text-forge-cream">Fund Duration</h4>
                      <p className="text-forge-cream/80">7-year fund life with extension options</p>
                    </div>
                    
                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-semibold text-forge-cream">Distribution Schedule</h4>
                      <p className="text-forge-cream/80">Quarterly distributions based on collections</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-forge-cream">Management Fee</h4>
                      <p className="text-forge-cream/80">2% annually + 20% performance fee</p>
                    </div>
                  </div>
                  
                  <MagneticButton
                    onClick={() => setShowForm(true)}
                    className="w-full bg-forge-orange text-white py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200 mt-8"
                  >
                    Join Investment Round
                  </MagneticButton>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 px-6 bg-forge-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Roadmap to Liquidity
            </h2>
            <p className="text-xl text-forge-gray">
              Clear path to returns and secondary market access
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roadmapSteps.map((step, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div 
                  className="bg-white p-8 rounded-3xl border border-forge-orange/20 hover:border-forge-orange/40 transition-all duration-300 group text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-forge-orange rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">{step.quarter}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-forge-dark mb-4">{step.title}</h3>
                  <p className="text-forge-gray">{step.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h3 className="text-2xl font-bold text-forge-dark">
              What Investors Say
            </h3>
          </Reveal>
          <Marquee speed={40} className="text-lg">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="mx-8 max-w-lg">
                <p className="text-forge-gray italic mb-2">{testimonial.quote}</p>
                <p className="text-forge-dark font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Investment CTA */}
      <section className="py-32 px-6 bg-forge-cream relative overflow-hidden">
        <AnimatedBackground variant="subtle" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight">
              Ready to generate
              <br />
              stable returns?
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed">
              Join institutional investors backing the next generation 
              of Web3 builders through innovative ISA investments.
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <motion.div 
              className="bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden border-4 border-forge-orange"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatedBackground variant="dark" />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 text-forge-orange mb-6"
                >
                  <Coins className="w-6 h-6" />
                  <span className="font-medium">Next Investment Round</span>
                </motion.div>
                
                <h3 className="text-4xl font-bold mb-6 text-forge-cream">$2M Target</h3>
                <p className="text-xl text-forge-cream/80 mb-8">
                  Funding the April 2026 cohort
                </p>
                
                <MagneticButton
                  onClick={() => setShowForm(true)}
                  className="bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
                >
                  Invest Now
                </MagneticButton>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-forge-dark text-white relative overflow-hidden">
        <AnimatedBackground variant="dark" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight text-forge-cream">
              Invest in impact.
              <br />
              Generate returns.
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-cream/80 mb-12 leading-relaxed">
              Join the future of education funding through 
              <br />
              innovative stablecoin-backed ISA investments.
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <MagneticButton
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
            >
              Join Investment Round
              <ArrowRight className="w-6 h-6" />
            </MagneticButton>
          </Reveal>
          
          <Reveal delay={0.6}>
            <div className="mt-8 text-sm text-forge-cream/60">
              Minimum $10K USDC • Quarterly distributions • Secondary market access
            </div>
          </Reveal>
        </div>
      </section>

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
