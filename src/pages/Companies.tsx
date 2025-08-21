import { useState } from "react";
import { ArrowRight, Users, Zap, Target, Briefcase, CheckCircle, Building, Code, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import ApplicationForm from "../components/ApplicationForm";
import { Reveal } from "../components/animations/Reveal";
import { MagneticButton } from "../components/animations/MagneticButton";
import { Marquee } from "../components/animations/Marquee";
import { StickyStory } from "../components/animations/StickyStory";
import { AnimatedBackground } from "../components/animations/AnimatedBackground";

const Companies = () => {
  const [showForm, setShowForm] = useState(false);

  const stats = [
    { value: "95%", label: "Job Placement Rate", suffix: "", icon: <Target className="w-8 h-8" /> },
    { value: "6", label: "Month Training", suffix: "mo", icon: <Briefcase className="w-8 h-8" /> },
    { value: "Real", label: "Project Experience", suffix: "", icon: <Code className="w-8 h-8" /> },
  ];

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Qualified Talent Pool",
      description: "Access developers who have completed real Web3 projects and proven their skills through hands-on experience",
      highlight: "Pre-vetted"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Hiring Process",
      description: "Streamlined recruitment with candidates who are ready to contribute from day one",
      highlight: "Day 1 Ready"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Project-Based Vetting",
      description: "Our graduates have worked on actual Web3 projects, giving you confidence in their practical abilities",
      highlight: "Proven Skills"
    }
  ];

  const partnershipTiers = [
    {
      tier: "Project Partner",
      highlight: "Start Here",
      features: ["2-3 project submissions per cohort", "Access to student portfolios", "Hiring pipeline access"],
      cta: "Join as Partner"
    },
    {
      tier: "Curriculum Sponsor",
      highlight: "Most Popular",
      features: ["Curriculum influence", "Sponsor 3-5 students", "Dedicated hiring events", "Brand partnership benefits"],
      cta: "Become Sponsor",
      featured: true
    },
    {
      tier: "Ecosystem Partner",
      highlight: "Full Access",
      features: ["Full curriculum partnership", "Sponsor entire cohort track", "Exclusive hiring window", "Advisory board seat"],
      cta: "Join Ecosystem"
    }
  ];

  const companies = [
    "Uniswap", "Chainlink", "Polygon", "Solana", "Ethereum Foundation", 
    "ConsenSys", "Compound", "Aave", "OpenSea", "Metamask"
  ];

  const testimonials = [
    { quote: "\"Hired 3 developers from Forge College. Best hiring decision we made this year.\"", author: "Sarah Kim, CTO at DeFi Protocol" },
    { quote: "\"The candidates came with real project experience. No training period needed.\"", author: "Marcus Chen, Engineering Lead at Web3 Startup" },
    { quote: "\"Forge College graduates understand the Web3 ecosystem better than traditional bootcamp grads.\"", author: "Elena Rodriguez, VP Engineering at NFT Platform" }
  ];

  const codeBlock = `// Partnership Integration Example
contract ForgePartnership {
  // Company partnership details
  struct Partner {
    address company;
    uint256 sponsoredStudents;
    bytes32[] projectIds;
    bool exclusiveHiring;
  }
  
  // Student project assignments
  mapping(address => bytes32[]) studentProjects;
  
  // Partnership benefits and ROI
  function sponsorStudent(address student) public {
    // Fund student salary during learning
    // Assign real company projects
    // Track performance metrics
  }
  
  function hireGraduate(address student) public {
    // Validate project completion
    // Execute hiring agreement
    // Activate partnership benefits
  }
  
  // Partnership ROI calculation
  function calculateROI() public view returns (uint256) {
    // Hiring success rate
    // Time to productivity
    // Cost savings vs traditional recruiting
  }
}`;

  const storySteps = [
    {
      title: "Real Project Experience",
      description: "Our students work on actual company projects during their 6-month program. This means they understand your business challenges and have proven their ability to deliver.",
      highlight: "Business Ready"
    },
    {
      title: "Reduced Hiring Risk",
      description: "Skip the uncertainty of traditional hiring. Our graduates have portfolios of completed projects and verified skills from working with real companies.",
      highlight: "Zero Risk"
    },
    {
      title: "Faster Time to Value",
      description: "Candidates hit the ground running from day one. No lengthy onboarding or training periods. They understand Web3 development and your business needs.",
      highlight: "Immediate Impact"
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
              <Building className="w-5 h-5 text-forge-orange" />
              Partner with Excellence
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-8 leading-[0.9] tracking-tight"
          >
            Hire Web3 Talent
            <br />
            <span className="inline-flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" />
              </motion.div>
              That's Ready.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl lg:text-2xl text-forge-gray max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Access skilled developers from our intensive 6-month program.
            <br className="hidden md:block" />
            Pre-vetted, project-tested, and ready to build from day one.
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
              Partner With Us
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
              Join companies already building the future workforce
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
              Hiring Success Metrics
            </h2>
            <p className="text-xl text-forge-gray">
              Real results from companies who partner with us
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
        title="Why Companies Choose Forge College"
        codeBlock={codeBlock}
        steps={storySteps}
      />

      {/* Features Grid */}
      <section className="py-20 px-6 bg-forge-cream">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Partnership Benefits
            </h2>
            <p className="text-xl text-forge-gray">
              Transform your hiring strategy by investing in talent development
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

      {/* Partnership Tiers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark mb-6">
              Partnership Tiers
            </h2>
            <p className="text-xl text-forge-gray">
              Choose the partnership level that fits your hiring needs
            </p>
          </Reveal>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTiers.map((tier, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div 
                  className={`p-8 rounded-3xl transition-all duration-300 group relative overflow-hidden ${
                    tier.featured 
                      ? "bg-forge-dark text-white border-4 border-forge-orange shadow-xl" 
                      : "bg-forge-cream border border-forge-orange/20 hover:border-forge-orange/40"
                  }`}
                  whileHover={{ y: -8, scale: tier.featured ? 1.02 : 1 }}
                >
                  {tier.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-forge-orange text-white px-3 py-1 rounded-full text-sm font-bold">
                        {tier.highlight}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${tier.featured ? "text-forge-cream" : "text-forge-dark"}`}>
                    {tier.tier}
                  </h3>
                  
                  <div className="mb-6">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      tier.featured 
                        ? "bg-forge-orange/20 text-forge-orange" 
                        : "bg-forge-orange/10 text-forge-orange"
                    }`}>
                      {tier.highlight}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className={`flex items-start gap-3 ${tier.featured ? "text-forge-cream/90" : "text-forge-gray"}`}>
                        <CheckCircle className="w-5 h-5 text-forge-orange flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <MagneticButton
                    onClick={() => setShowForm(true)}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                      tier.featured 
                        ? "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light" 
                        : "bg-forge-orange text-white border-2 border-forge-orange hover:border-forge-orange-light"
                    }`}
                  >
                    {tier.cta}
                  </MagneticButton>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-16 bg-forge-cream">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h3 className="text-2xl font-bold text-forge-dark">
              What Partner Companies Say
            </h3>
          </Reveal>
          <Marquee speed={35} className="text-lg">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="mx-8 max-w-lg">
                <p className="text-forge-gray italic mb-2">{testimonial.quote}</p>
                <p className="text-forge-dark font-semibold">— {testimonial.author}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="py-32 px-6 bg-forge-cream relative overflow-hidden">
        <AnimatedBackground variant="subtle" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight">
              Ready to hire 
              <br />
              the best Web3 talent?
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed">
              Join leading Web3 companies who are building their teams 
              through Forge College partnerships.
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
                  <Users className="w-6 h-6" />
                  <span className="font-medium">Next Hiring Cycle</span>
                </motion.div>
                
                <h3 className="text-4xl font-bold mb-6 text-forge-cream">April 2026</h3>
                <p className="text-xl text-forge-cream/80 mb-8">
                  10 graduating developers ready for placement
                </p>
                
                <MagneticButton
                  onClick={() => setShowForm(true)}
                  className="bg-forge-orange text-white px-12 py-4 rounded-full font-semibold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
                >
                  Become a Partner
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
              Let's build the future
              <br />
              of Web3 together.
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xl text-forge-cream/80 mb-12 leading-relaxed">
              Partner with Forge College and get first access 
              <br />
              to the most skilled Web3 developers.
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <MagneticButton
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold shadow-xl border-2 border-forge-orange hover:border-forge-orange-light transition-all duration-200"
            >
              Start Partnership
              <ArrowRight className="w-6 h-6" />
            </MagneticButton>
          </Reveal>
          
          <Reveal delay={0.6}>
            <div className="mt-8 text-sm text-forge-cream/60">
              Pre-vetted talent • Real project experience • Immediate impact
            </div>
          </Reveal>
        </div>
      </section>

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
