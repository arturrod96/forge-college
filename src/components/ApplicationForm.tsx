import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formType: 'professional' | 'company' | 'investor';
}

const ApplicationForm = ({ isOpen, onClose, title, formType }: ApplicationFormProps) => {
  const { t } = useTranslation();
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('applicationForm.messages.success'));
    onClose();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const requiredMarker = <span className="text-red-500"> *</span>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <X size={24} aria-hidden />
              <span className="sr-only">{t('applicationForm.accessibility.close')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('applicationForm.fields.name')}
                {requiredMarker}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('applicationForm.fields.email')}
                {requiredMarker}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formType !== 'professional' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t('applicationForm.fields.company')}
                  {requiredMarker}
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {formType === 'professional' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('applicationForm.fields.experienceLabel')}
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('applicationForm.fields.experiencePlaceholder')}</option>
                    <option value="beginner">{t('applicationForm.fields.experienceOptions.beginner')}</option>
                    <option value="intermediate">{t('applicationForm.fields.experienceOptions.intermediate')}</option>
                    <option value="advanced">{t('applicationForm.fields.experienceOptions.advanced')}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('applicationForm.fields.portfolio')}
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {formType === 'investor' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('applicationForm.fields.investmentAmountLabel')}
                  </label>
                  <select
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('applicationForm.fields.investmentAmountPlaceholder')}</option>
                    <option value="10k-50k">{t('applicationForm.fields.investmentAmountOptions.10k_50k')}</option>
                    <option value="50k-100k">{t('applicationForm.fields.investmentAmountOptions.50k_100k')}</option>
                    <option value="100k-500k">{t('applicationForm.fields.investmentAmountOptions.100k_500k')}</option>
                    <option value="500k+">{t('applicationForm.fields.investmentAmountOptions.500k_plus')}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t('applicationForm.fields.timelineLabel')}
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('application.selectTimeline')}</option>
                    <option value="immediate">{t('application.timelineImmediate')}</option>
                    <option value="quarter">{t('application.timelineQuarter')}</option>
                    <option value="year">{t('applicationForm.fields.timelineOptions.year')}</option>
                    <option value="exploring">{t('applicationForm.fields.timelineOptions.exploring')}</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('applicationForm.fields.message')}
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t('applicationForm.fields.messagePlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t('application.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
