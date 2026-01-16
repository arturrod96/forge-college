import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useOAuth';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile } from '@/types/profile';
import { getProfile, updateProfile } from '@/lib/profile.service';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { SectionCard } from '@/components/profile/SectionCard';
import { FormField } from '@/components/form/FormField';
import { TagInput } from '@/components/profile/TagInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, User, Mail, MapPin, Globe, Briefcase, Target, Building, Linkedin, Github, BookOpen, Languages } from 'lucide-react';

const COUNTRY_LIST = [
  { value: 'Brazil', key: 'brazil' },
  { value: 'United States', key: 'unitedStates' },
  { value: 'Canada', key: 'canada' },
  { value: 'United Kingdom', key: 'unitedKingdom' },
  { value: 'Germany', key: 'germany' },
  { value: 'France', key: 'france' },
  { value: 'Spain', key: 'spain' },
  { value: 'Italy', key: 'italy' },
  { value: 'Netherlands', key: 'netherlands' },
  { value: 'Sweden', key: 'sweden' },
  { value: 'Norway', key: 'norway' },
  { value: 'Denmark', key: 'denmark' },
  { value: 'Finland', key: 'finland' },
  { value: 'Switzerland', key: 'switzerland' },
  { value: 'Austria', key: 'austria' },
  { value: 'Belgium', key: 'belgium' },
  { value: 'Portugal', key: 'portugal' },
  { value: 'Ireland', key: 'ireland' },
  { value: 'Australia', key: 'australia' },
  { value: 'New Zealand', key: 'newZealand' },
  { value: 'Japan', key: 'japan' },
  { value: 'South Korea', key: 'southKorea' },
  { value: 'Singapore', key: 'singapore' },
  { value: 'India', key: 'india' },
  { value: 'China', key: 'china' },
  { value: 'Mexico', key: 'mexico' },
  { value: 'Argentina', key: 'argentina' },
  { value: 'Chile', key: 'chile' },
  { value: 'Colombia', key: 'colombia' },
  { value: 'Peru', key: 'peru' },
  { value: 'Uruguay', key: 'uruguay' },
  { value: 'Paraguay', key: 'paraguay' },
  { value: 'Venezuela', key: 'venezuela' },
  { value: 'Ecuador', key: 'ecuador' },
  { value: 'Bolivia', key: 'bolivia' },
  { value: 'Guyana', key: 'guyana' },
  { value: 'Suriname', key: 'suriname' },
  { value: 'French Guiana', key: 'frenchGuiana' }
];

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Partial<StudentProfile>>({});

  const countryOptions = useMemo(
    () =>
      COUNTRY_LIST.map(({ value, key }) => ({
        value,
        label: t(`common.countries.${key}`)
      })),
    [t]
  );

  const languageOptions = useMemo(
    () => [
      { value: 'en-US', label: t('profile.languageOptions.enUS') },
      { value: 'pt-BR', label: t('profile.languageOptions.ptBR') }
    ],
    [t]
  );

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      
      // Prefill email from auth context
      if (user?.email) {
        data.email = user.email;
      }

      const preferredLanguage = (
        data.communicationLanguage ||
        (i18n.language as StudentProfile['communicationLanguage']) ||
        'pt-BR'
      ) as StudentProfile['communicationLanguage'];

      data.communicationLanguage = preferredLanguage;

      if (preferredLanguage !== i18n.language) {
        i18n.changeLanguage(preferredLanguage);
      }

      setProfile(data);
      setHasChanges(false);
    } catch (error) {
      toast({
        title: t('common.errors.unexpectedError'),
        description: t('profile.messages.updateError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    // Basic validation
    const newErrors: Partial<StudentProfile> = {};
    
    if (!profile.fullName.trim()) {
      newErrors.fullName = t('profile.errors.fullNameRequired');
    }

    if (!profile.country.trim()) {
      newErrors.country = t('profile.errors.countryRequired');
    }

    if (profile.linkedinUrl && !isValidUrl(profile.linkedinUrl)) {
      newErrors.linkedinUrl = t('profile.errors.invalidLinkedin');
    }

    if (profile.githubUrl && !isValidUrl(profile.githubUrl)) {
      newErrors.githubUrl = t('profile.errors.invalidGithub');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: t('common.errors.unexpectedError'),
        description: t('profile.messages.validationError'),
      });
      return;
    }

    try {
      setSaving(true);
      await updateProfile(profile);
      setErrors({});
      setHasChanges(false);
      toast({
        title: t('common.buttons.save'),
        description: t('profile.messages.updateSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.errors.unexpectedError'),
        description: t('profile.messages.updateError'),
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof StudentProfile, value: any) => {
    if (!profile) return;
    
    setProfile(prev => prev ? { ...prev, [field]: value } : prev);
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  const handleCommunicationLanguageChange = (locale: StudentProfile['communicationLanguage']) => {
    updateField('communicationLanguage', locale);
    i18n.changeLanguage(locale);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-gray-600">{t('profile.loadingProfile')}</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('profile.failedToLoad')}</p>
        <Button onClick={loadProfile} className="mt-4">{t('common.buttons.tryAgain')}</Button>
      </div>
    );
  }

  const sidebarDisplayName =
    (profile.fullName && profile.fullName.trim().length > 0 ? profile.fullName : user?.user_metadata?.full_name) ??
    t('profile.sidebar.anonymousUser');
  const sidebarLocale = profile.communicationLanguage;
  const sidebarAvatar = (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-600 mt-2">{t('profile.subtitle')}</p>
      </div>

      {/* Unsaved Changes Hint */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">{t('profile.unsavedChanges')}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedLocale={sidebarLocale}
            onLocaleChange={(locale) =>
              handleCommunicationLanguageChange(locale as StudentProfile['communicationLanguage'])
            }
            fullName={sidebarDisplayName}
            email={profile.email}
            avatarUrl={sidebarAvatar}
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {activeTab === 'personal' && (
            <SectionCard
              title={t('profile.sections.personal')}
              description={t('profile.sections.personalDesc')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={t('common.labels.fullName')} required error={errors.fullName}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder={t('common.placeholders.enterFullName')}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label={t('common.labels.email')} required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('profile.messages.emailNote')}</p>
                </FormField>

                <FormField label={t('common.labels.country')} required error={errors.country}>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Select value={profile.country} onValueChange={(value) => updateField('country', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={t('common.placeholders.selectCountry')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormField>

                <FormField label={t('common.labels.city')}>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder={t('common.placeholders.enterCity')}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label={t('common.labels.languages')} description={t('profile.sections.personalDesc')}>
                    <TagInput
                      value={profile.languages}
                      onChange={(value) => updateField('languages', value)}
                      placeholder={t('common.placeholders.typeLanguage')}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label={t('profile.fields.languagePreference')} description={t('profile.fields.selectLanguage')}>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Select
                        value={profile.communicationLanguage}
                        onValueChange={(value) =>
                          handleCommunicationLanguageChange(value as StudentProfile['communicationLanguage'])
                        }
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder={t('profile.fields.selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormField>
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === 'professional' && (
            <SectionCard
              title={t('profile.sections.professional')}
              description={t('profile.sections.professionalDesc')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label={t('profile.fields.yearsExperience')}>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      min="0"
                      value={profile.yearsExperience}
                      onChange={(e) => updateField('yearsExperience', parseInt(e.target.value) || 0)}
                      placeholder={t('profile.fields.yearsExperiencePlaceholder')}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label={t('profile.fields.positionCompany')}>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.positionCompany}
                      onChange={(e) => updateField('positionCompany', e.target.value)}
                      placeholder={t('profile.fields.positionPlaceholder')}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label={t('profile.fields.stacksDominated')} description={t('profile.fields.stacksDesc')}>
                    <TagInput
                      value={profile.stacks}
                      onChange={(value) => updateField('stacks', value)}
                      placeholder={t('profile.fields.stacksPlaceholder')}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label={t('profile.fields.skillsToDevelop')} description={t('profile.fields.skillsDesc')}>
                    <TagInput
                      value={profile.skillsToDevelop}
                      onChange={(value) => updateField('skillsToDevelop', value)}
                      placeholder={t('profile.fields.skillsPlaceholder')}
                    />
                  </FormField>
                </div>

                <FormField label={t('profile.fields.linkedinUrl')} error={errors.linkedinUrl}>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.linkedinUrl}
                      onChange={(e) => updateField('linkedinUrl', e.target.value)}
                      placeholder={t('profile.fields.linkedinPlaceholder')}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label={t('profile.fields.githubUrl')} error={errors.githubUrl}>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.githubUrl}
                      onChange={(e) => updateField('githubUrl', e.target.value)}
                      placeholder={t('profile.fields.githubPlaceholder')}
                      className="pl-10"
                    />
                  </div>
                </FormField>
              </div>
            </SectionCard>
          )}

          {activeTab === 'learning' && (
            <SectionCard
              title={t('profile.sections.learning')}
              description={t('profile.sections.learningDesc')}
            >
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('profile.comingSoon.title')}</h3>
                <p className="text-gray-600">{t('profile.comingSoon.learning')}</p>
              </div>
            </SectionCard>
          )}

          {activeTab === 'career' && (
            <SectionCard
              title={t('profile.sections.career')}
              description={t('profile.sections.careerDesc')}
            >
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('profile.comingSoon.title')}</h3>
                <p className="text-gray-600">{t('profile.comingSoon.career')}</p>
              </div>
            </SectionCard>
          )}

          {/* Save Button */}
          {activeTab === 'personal' || activeTab === 'professional' ? (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('common.buttons.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('common.buttons.save')}
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
