import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Compute a safe OAuth redirect URL, forcing app subdomain in production
export function getOAuthRedirectUrl(): string {
  try {
    if (typeof window === 'undefined') return '/auth/callback'
    const origin = window.location.origin
    const host = window.location.hostname

    // Local/dev environments
    if (host.includes('localhost') || host.startsWith('127.')) {
      return `${origin}/auth/callback`
    }

    // If user is on the apex domain, force app subdomain
    if (host === 'forge.college') {
      return `https://app.forge.college/auth/callback`
    }

    return `${origin}/auth/callback`
  } catch {
    return '/auth/callback'
  }
}
