import { LucideIcon } from 'lucide-react';

export type AchievementStatus = 'completed' | 'in_progress' | 'locked';
export type AchievementCategory = 'community' | 'profile' | 'learning' | 'social';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: AchievementStatus;
  category: AchievementCategory;
  progress?: number;
  maxProgress?: number;
  icon: LucideIcon;
  action?: AchievementAction;
}

export interface AchievementAction {
  label: string;
  url?: string;
  type?: 'external' | 'internal' | 'callback';
  handler?: () => void;
}

export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon?: LucideIcon;
}

export interface AchievementStats {
  total: number;
  completed: number;
  inProgress: number;
  locked: number;
  totalXP: number;
  availableXP: number;
  completionPercentage: number;
}

export interface AchievementFilters {
  category: 'all' | AchievementCategory;
  status?: AchievementStatus[];
  sortBy?: 'xp' | 'progress' | 'status';
  searchQuery?: string;
}
