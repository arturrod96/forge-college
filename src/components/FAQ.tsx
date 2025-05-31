
import { useState } from 'react';
import { ChevronDown, ChevronUp, Flame } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ = ({ faqs }: FAQProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 bg-forge-cream/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-forge-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame size={28} className="text-forge-orange" />
            <h2 className="text-4xl lg:text-5xl font-bold text-forge-dark tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-forge-gray">
            Everything you need to know about Forge College
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-forge-cream/50 hover:shadow-md transition-all duration-200 relative overflow-hidden group"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-forge-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-forge-cream/10 transition-colors relative z-10"
              >
                <span className="font-semibold text-forge-dark text-lg pr-4">{faq.question}</span>
                <div className="flex items-center gap-2">
                  {openItems.includes(index) && (
                    <div className="w-2 h-2 bg-forge-orange rounded-full animate-pulse"></div>
                  )}
                  {openItems.includes(index) ? (
                    <ChevronUp className="text-forge-orange transition-colors" size={24} />
                  ) : (
                    <ChevronDown className="text-forge-gray group-hover:text-forge-orange transition-colors" size={24} />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-8 pb-6 relative z-10">
                  <div className="pt-4 border-t border-forge-cream/30">
                    <p className="text-forge-gray leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </div>
              )}
              
              {/* Corner accent for open items */}
              {openItems.includes(index) && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-forge-orange to-forge-orange-light"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
