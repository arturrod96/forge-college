import { useState } from "react";
import { ArrowRight, Code, DollarSign, Flame, Users, Briefcase, Zap, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ApplicationForm from "../components/ApplicationForm";
import { Reveal } from "../components/animations/Reveal";
import { MagneticButton } from "../components/animations/MagneticButton";
import { Marquee } from "../components/animations/Marquee";
import { StickyStory } from "../components/animations/StickyStory";
import { AnimatedBackground } from "../components/animations/AnimatedBackground";

const Professionals = () => {
  const [showForm, setShowForm] = useState(false);

  const stats = [
    { value: "6", label: "Month Program", suffix: "", icon: <Target className="w-8 h-8" /> },
    { value: "$6K", label: "Monthly Salary", suffix: "/mo", icon: <DollarSign className="w-8 h-8" /> },
    { value: "95%", label: "Job Placement", suffix: "", icon: <TrendingUp className="w-8 h-8" /> },
  ];

  const features = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Get Paid to Learn",
      description: "Receive $6,000 USDC monthly while mastering Web3 development",
      highlight: "$36,000"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Real Projects",
      description: "Build actual DeFi protocols, NFT platforms, and blockchain infrastructure",
      highlight: "Live Code"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Guaranteed Placement",
      description: "Access our exclusive network of Web3 companies hiring developers",
      highlight: "95% Success"
    }
  ];

  const companies = [
    "Uniswap", "Chainlink", "Polygon", "Solana", "Ethereum Foundation", 
    "ConsenSys", "Compound", "Aave", "OpenSea", "Metamask"
  ];

  const testimonials = [
    { quote: "\"Changed my life completely. From zero to Web3 developer in 6 months.\"", author: "Sarah Chen" },
    { quote: "\"The ISA model meant I could focus 100% on learning.\"", author: "Marcus Rodriguez" },
    { quote: "\"Landed a $120k job right after graduation.\"", author: "Alex Thompson" }
  ];

  const codeBlock = `// Forge College Smart Contract
contract ForgeCollege {
  // Student program details
  struct Student {
    address wallet;
    uint256 stipendAmount;
    uint256 completedProjects;
    bool jobPlaced;
  }
  
  // Company sponsor mapping
  mapping(address => uint256) sponsors;
  
  // ISA terms and repayment logic
  function startLearning() public {
    // Begin 6-month program
    // Receive monthly stipend
    // Work on real projects
  }
  
  function completeProgram() public {
    // Portfolio validation
    // Job matching algorithm
    // ISA activation only on job placement
  }
}`;

  const storySteps = [
    {
      title: "Smart Contracts",
      description: "Learn to build and deploy smart contracts that power DeFi protocols, NFT marketplaces, and DAOs. Master Solidity, security best practices, and gas optimization.",
      highlight: "Real Impact"
    },
    {
      title: "DeFi Development",
      description: "Build actual trading protocols, yield farming platforms, and lending systems. Work with real liquidity and understand how billions flow through Web3.",
      highlight: "$2B+ TVL"
    },
    {
      title: "Job Guarantee",
      description: "Our ISA model means we only succeed when you do. Get placed in top Web3 companies or pay nothing. It's that simple.",
      highlight: "Zero Risk"
    }
  ];

  return (
    <div className="min-h-screen bg-forge-cream overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10 px-6">
        <AnimatedBackground variant="hero" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-forge-gray text-lg font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-forge-orange/20">
              <Flame className="w-5 h-5 text-forge-orange" />
              Forge Your Future
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight"
          >
            Get Paid
            <br />
            <span className="inline-flex items-center">
              to Learn.
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" />
              </motion.div>
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Master Web3 development, earn $6,000 USDC monthly for 6 months, 
            <br className="hidden md:block" />
            and only pay us when we land you a job.
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
              Apply to Next Cohort
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Company Marquee */}
      <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-forge-orange/10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <p className="text-center text-forge-gray font-medium mb-8">
              Learn the skills to work at companies like:
            </p>
          </Reveal>
          <Marquee className="text-2xl font-bold text-forge-dark/60">
            {companies.map((company, i) => (
              <span key={i} className="mx-8 hover:text-forge-orange transition-colors">
                {company}
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
              Program by the Numbers
            </h2>
            <p className="text-xl text-forge-gray">
              Real outcomes, real careers, real impact
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

      {/* Sticky Story Section */}
      <StickyStory
        title="Learn by Building Real Web3 Products"
        codeBlock={codeBlock}
        steps={storySteps}
      />

      {/* Features Grid */}
      <section className="py-20 px-6 bg-forge-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Why Forge College?
            </h2>
            <p className="text-xl text-forge-gray">
              The only Web3 education program where you earn while you learn
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

      {/* Testimonials Marquee */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h3 className="text-2xl font-bold text-forge-dark">
              What Our Students Say
            </h3>
          </Reveal>
          <Marquee speed={30} className="text-lg">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="mx-8 max-w-md">
                <p className="text-forge-gray italic mb-2">{testimonial.quote}</p>
                <p className="text-forge-dark font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Next Cohort CTA */}
      <section className="py-32 px-6 bg-forge-cream relative overflow-hidden">
        <AnimatedBackground variant="subtle" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight">
              No upfront cost.
              <br />
              Pay only when you land a job.
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed">
              Our Income Share Agreement means you focus on learning, not debt. 
              We only succeed when you do.
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
                  <Zap className="w-6 h-6" />
                  <span className="font-medium">Next Cohort Starting Soon</span>
                </motion.div>
                
                <h3 className="text-4xl font-bold mb-6 text-forge-cream">April 2026</h3>
                <p className="text-xl text-forge-cream/80 mb-8">
                  Limited to 10 students
                </p>
                
                <MagneticButton
                  onClick={() => setShowForm(true)}
                  className="bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
                >
                  Secure Your Spot
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
              Ready to forge
              <br />
              your future?
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-cream/80 mb-12 leading-relaxed">
              Join the next generation of Web3 developers. 
              <br />
              Apply now for the April 2026 cohort.
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <MagneticButton
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
            >
              Apply Now
              <ArrowRight className="w-6 h-6" />
            </MagneticButton>
          </Reveal>
          
          <Reveal delay={0.6}>
            <div className="mt-8 text-sm text-forge-cream/60">
              No upfront cost • Pay only when you get hired
            </div>
          </Reveal>
        </div>
      </section>

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
