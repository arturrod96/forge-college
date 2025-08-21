import { useState } from "react";
import { ArrowRight, Code, DollarSign, Flame, Users, Briefcase } from "lucide-react";
import ApplicationForm from "../components/ApplicationForm";

const Professionals = () => {
  const [showForm, setShowForm] = useState(false);

  const stats = [
    { value: "6", label: "Month Program", suffix: "" },
    { value: "$6K", label: "Monthly Salary", suffix: "/mo" },
    { value: "95%", label: "Job Placement", suffix: "" },
  ];

  const features = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Get Paid to Learn",
      description: "Receive $6,000 USDC monthly while mastering Web3 development"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Real Projects",
      description: "Build actual DeFi protocols, NFT platforms, and blockchain infrastructure"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Guaranteed Placement",
      description: "Access our exclusive network of Web3 companies hiring developers"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-forge-gray text-lg font-medium">
              The future of education
            </span>
          </div>
          
          <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-forge-dark mb-12 leading-[0.9] tracking-tight">
            Get Paid
            <br />
            <span className="inline-flex items-center">
              <Flame className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 text-forge-orange mx-4" />
              to Learn.
            </span>
          </h1>
          
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-3 bg-forge-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-forge-orange/90 transition-all duration-200 group"
          >
            Apply to Next Cohort
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-forge-cream/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="text-5xl lg:text-6xl font-bold text-forge-dark">
                  {stat.value}
                  <span className="text-forge-orange text-2xl lg:text-3xl">
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-lg text-forge-gray font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-forge-dark mb-6 leading-tight">
            No upfront cost.
            <br />
            Pay only when you land a job.
          </h2>
          <p className="text-xl text-forge-gray max-w-3xl mx-auto mb-16 leading-relaxed">
            Our Income Share Agreement means you focus on learning, not debt. 
            We only succeed when you do.
          </p>
          
          <div className="bg-forge-dark rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-forge-orange/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">Next Cohort Starts</h3>
              <div className="text-6xl font-bold text-forge-orange mb-4">
                April 2026
              </div>
              <p className="text-xl opacity-80 mb-8">
                Limited to 10 students
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-forge-dark px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Secure Your Spot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-forge-cream/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark text-center mb-16">
            Why Forge College?
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-forge-orange rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-forge-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-forge-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl lg:text-6xl font-bold text-forge-dark text-center mb-20">
            Your Path to Web3
          </h2>
          
          <div className="space-y-16">
            <div className="flex items-start gap-8 group">
              <div className="w-12 h-12 bg-forge-orange rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-forge-dark mb-3">
                  Apply & Get Accepted
                </h3>
                <p className="text-lg text-forge-gray leading-relaxed">
                  Submit your application and complete our selection process. We look for motivation and potential, not just experience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-8 group">
              <div className="w-12 h-12 bg-forge-orange rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-forge-dark mb-3">
                  Learn & Earn
                </h3>
                <p className="text-lg text-forge-gray leading-relaxed">
                  Spend 6 months learning Web3 development while receiving $6,000 USDC monthly. Work on real projects from day one.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-8 group">
              <div className="w-12 h-12 bg-forge-orange rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-forge-dark mb-3">
                  Land Your Dream Job
                </h3>
                <p className="text-lg text-forge-gray leading-relaxed">
                  Graduate with a portfolio of real projects and get connected to our network of Web3 companies actively hiring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-forge-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to forge
            <br />
            your future?
          </h2>
          <p className="text-xl opacity-80 mb-12 leading-relaxed">
            Join the next generation of Web3 developers. 
            <br />
            Apply now for the April 2026 cohort.
          </p>
          
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-3 bg-forge-orange text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-forge-orange/90 transition-all duration-200 group"
          >
            Apply Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-8 text-sm opacity-60">
            No upfront cost • Pay only when you get hired
          </div>
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
