import { CategoryConfig, AchievementCategory } from '../types/achievement.types';
import { Users, Target, BookOpen, Share2 } from 'lucide-react';

export const CATEGORY_CONFIGS: Record<AchievementCategory, CategoryConfig> = {
  community: {
    label: 'achievements.categories.community',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Users
  },
  profile: {
    label: 'achievements.categories.profile',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Target
  },
  learning: {
    label: 'achievements.categories.learning',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: BookOpen
  },
  social: {
    label: 'achievements.categories.social',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: Share2
  }
};

export const STATUS_PRIORITY: Record<string, number> = {
  in_progress: 1,
  locked: 2,
  completed: 3
};
