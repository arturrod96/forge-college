import { createClientBrowser } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { StudentProfile } from '@/types/profile';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

const DEFAULT_LANGUAGE: StudentProfile['communicationLanguage'] = 'pt-BR';

const mapRowToProfile = (row: ProfileRow, email: string): StudentProfile => ({
  fullName: row.full_name,
  email,
  country: row.country,
  city: row.city,
  languages: row.languages,
  communicationLanguage: (row.communication_language as StudentProfile['communicationLanguage']) ?? DEFAULT_LANGUAGE,
  yearsExperience: row.years_experience,
  stacks: row.stacks,
  skillsToDevelop: row.skills_to_develop,
  positionCompany: row.position_company,
  linkedinUrl: row.linkedin_url ?? undefined,
  githubUrl: row.github_url ?? undefined,
  walletAddress: row.wallet_address ?? undefined,
});

const mapProfileToPayload = (profile: StudentProfile, userId: string): Database['public']['Tables']['profiles']['Insert'] => ({
  user_id: userId,
  wallet_address: profile.walletAddress ?? null,
  full_name: profile.fullName,
  country: profile.country,
  city: profile.city,
  languages: profile.languages,
  years_experience: profile.yearsExperience,
  stacks: profile.stacks,
  skills_to_develop: profile.skillsToDevelop,
  position_company: profile.positionCompany,
  linkedin_url: profile.linkedinUrl ?? null,
  github_url: profile.githubUrl ?? null,
  communication_language: profile.communicationLanguage,
});

const buildEmptyProfile = (email: string, language: StudentProfile['communicationLanguage']): StudentProfile => ({
  fullName: '',
  email,
  country: '',
  city: '',
  languages: [],
  communicationLanguage: language,
  yearsExperience: 0,
  stacks: [],
  skillsToDevelop: [],
  positionCompany: '',
  linkedinUrl: undefined,
  githubUrl: undefined,
  walletAddress: undefined,
});

export async function getProfile(): Promise<StudentProfile> {
  const supabase = createClientBrowser();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const preferredLanguage =
    (user.user_metadata?.communication_language as StudentProfile['communicationLanguage']) ?? DEFAULT_LANGUAGE;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const emptyProfile = buildEmptyProfile(user.email ?? '', preferredLanguage);

    const insertPayload = mapProfileToPayload(emptyProfile, user.id);
    const { error: insertError } = await supabase.from('profiles').insert(insertPayload);

    if (insertError) {
      throw insertError;
    }

    return emptyProfile;
  }

  return mapRowToProfile(data, user.email ?? '');
}

export async function updateProfile(data: StudentProfile): Promise<void> {
  const supabase = createClientBrowser();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const payload = mapProfileToPayload(data, user.id);

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'user_id' });
  if (error) {
    throw error;
  }

  const existingLanguage = user.user_metadata?.communication_language;
  if (existingLanguage !== data.communicationLanguage) {
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { communication_language: data.communicationLanguage },
    });

    if (metadataError) {
      // Log the error but do not block the profile update flow
      console.warn('Failed to sync communication language with auth metadata', metadataError);
    }
  }
}
