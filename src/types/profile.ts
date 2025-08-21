export type StudentProfile = {
  fullName: string;
  email: string;            // prefilled from auth, read-only
  country: string;
  city: string;
  languages: string[];      // tag input

  yearsExperience: number;  // integer >= 0
  stacks: string[];         // tag input (Java, Python, Solidity, etc.)
  skillsToDevelop: string[];// tag input (DeFi, Smart Contracts, etc.)
  positionCompany: string;  // e.g., "Senior Backend @ ACME"
  linkedinUrl?: string;
  githubUrl?: string;
};
