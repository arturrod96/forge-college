import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { Loader2, Save, User, Mail, MapPin, Globe, Briefcase, Target, Building, Linkedin, Github, BookOpen } from 'lucide-react';

const countries = [
  'Brazil', 'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
  'Portugal', 'Ireland', 'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'India',
  'China', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Paraguay', 'Venezuela',
  'Ecuador', 'Bolivia', 'Guyana', 'Suriname', 'French Guiana'
];

export default function Profile() {
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
        title: "Error",
        description: "Failed to load profile. Please try again.",
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
      newErrors.fullName = 'Full name is required';
    }
    
    if (!profile.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (profile.linkedinUrl && !isValidUrl(profile.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }
    
    if (profile.githubUrl && !isValidUrl(profile.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
      });
      return;
    }

    try {
      setSaving(true);
      await updateProfile(profile);
      setErrors({});
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load profile</p>
        <Button onClick={loadProfile} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal and professional information</p>
      </div>

      {/* Unsaved Changes Hint */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">You have unsaved changes</span>
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
              title="Personal Information"
              description="Update your basic personal details and contact information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" required error={errors.fullName}>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label="Email" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email can only be changed in your account settings</p>
                </FormField>

                <FormField label="Country" required error={errors.country}>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Select value={profile.country} onValueChange={(value) => updateField('country', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your country" />
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

                <FormField label="City">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Enter your city"
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Languages" description="Add languages you speak">
                    <TagInput
                      value={profile.languages}
                      onChange={(value) => updateField('languages', value)}
                      placeholder="Type a language and press Enter"
                    />
                  </FormField>
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === 'professional' && (
            <SectionCard
              title="Professional Profile"
              description="Share your work experience, skills, and career information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Years of Experience in Technology">
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

                <FormField label="Position & Company">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.positionCompany}
                      onChange={(e) => updateField('positionCompany', e.target.value)}
                      placeholder="e.g., Senior Backend @ ACME"
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Stacks Dominated" description="Technologies you're proficient in">
                    <TagInput
                      value={profile.stacks}
                      onChange={(value) => updateField('stacks', value)}
                      placeholder="e.g., Java, Python, Solidity, React"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Skills to Develop" description="Areas you want to improve">
                    <TagInput
                      value={profile.skillsToDevelop}
                      onChange={(value) => updateField('skillsToDevelop', value)}
                      placeholder="e.g., DeFi, Smart Contracts, Web3"
                    />
                  </FormField>
                </div>

                <FormField label="LinkedIn URL" error={errors.linkedinUrl}>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.linkedinUrl}
                      onChange={(e) => updateField('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label="GitHub URL" error={errors.githubUrl}>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={profile.githubUrl}
                      onChange={(e) => updateField('githubUrl', e.target.value)}
                      placeholder="https://github.com/username"
                      className="pl-10"
                    />
                  </div>
                </FormField>
              </div>
            </SectionCard>
          )}

          {activeTab === 'learning' && (
            <SectionCard
              title="Learning Progress"
              description="Track your learning journey and achievements"
            >
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">Learning progress tracking will be available in the next update.</p>
              </div>
            </SectionCard>
          )}

          {activeTab === 'career' && (
            <SectionCard
              title="Career Preferences"
              description="Set your job preferences and career goals"
            >
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">Career preferences will be available in the next update.</p>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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
