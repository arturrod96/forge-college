
import { useState } from 'react';
import { X } from 'lucide-react';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formType: 'professional' | 'company' | 'investor';
}

const ApplicationForm = ({ isOpen, onClose, title, formType }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    experience: '',
    portfolio: '',
    investmentAmount: '',
    timeline: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your application! We\'ll be in touch soon.');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formType !== 'professional' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {formType === 'professional' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio/LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {formType === 'investor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount Range
                  </label>
                  <select
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select range</option>
                    <option value="10k-50k">$10k - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-500k">$100k - $500k</option>
                    <option value="500k+">$500k+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (next 30 days)</option>
                    <option value="quarter">This quarter</option>
                    <option value="year">This year</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us more about your interest..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
