import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useOAuth';
import { useToast } from '@/hooks/use-toast';
import { StudentProfile } from '@/types/profile';
import { getProfile, updateProfile } from '@/lib/profile.service';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { SectionCard } from '@/components/profile/SectionCard';
import { FormField } from '@/components/form/FormField';
import { TagInput } from '@/components/profile/TagInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, User, Mail, MapPin, Globe, Briefcase, Target, Building, Linkedin, Github, BookOpen, Languages } from 'lucide-react';

const countries = [
  'Brazil', 'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
  'Portugal', 'Ireland', 'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'India',
  'China', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Paraguay', 'Venezuela',
  'Ecuador', 'Bolivia', 'Guyana', 'Suriname', 'French Guiana'
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

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Check for changes - simplified for now
  useEffect(() => {
    if (profile) {
      setHasChanges(true);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      
      // Prefill email from auth context
      if (user?.email) {
        data.email = user.email;
      }
      
      setProfile(data);
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
    
    setProfile({
      ...profile,
      [field]: value
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
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
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
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
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
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
                        value={i18n.language}
                        onValueChange={(value) => {
                          i18n.changeLanguage(value);
                          toast({
                            title: t('common.buttons.save'),
                            description: t('profile.messages.updateSuccess'),
                          });
                        }}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="pt-BR">Português (BR)</SelectItem>
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
                      placeholder="0"
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
