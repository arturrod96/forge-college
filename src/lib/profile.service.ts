import { StudentProfile } from '@/types/profile';

// Mock implementation - replace with real API calls later
const STORAGE_KEY = 'forge-college-student-profile';

export async function getProfile(): Promise<StudentProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return empty profile
  return {
    fullName: '',
    email: '',
    country: '',
    city: '',
    languages: [],
    yearsExperience: 0,
    stacks: [],
    skillsToDevelop: [],
    positionCompany: '',
    linkedinUrl: '',
    githubUrl: '',
  };
}

export async function updateProfile(data: StudentProfile): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Store in localStorage for now
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  
  // Simulate potential error (1% chance)
  if (Math.random() < 0.01) {
    throw new Error('Failed to update profile. Please try again.');
  }
}
