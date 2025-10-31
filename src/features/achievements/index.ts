// Main component
export { AchievementsPage } from './components/AchievementsPage';

// Sub-components (optional exports for advanced usage)
export { AchievementCard } from './components/AchievementCard';
export { AchievementStats } from './components/AchievementStats';
export { AchievementTabs } from './components/AchievementTabs';
export { AchievementProgress } from './components/AchievementProgress';

// Hooks
export { useAchievements } from './hooks/useAchievements';
export { useAchievementStats } from './hooks/useAchievementStats';
export { useAchievementActions } from './hooks/useAchievementActions';
export { useAchievementFilters } from './hooks/useAchievementFilters';

// Types
export type {
  Achievement,
  AchievementStatus,
  AchievementCategory,
  AchievementFilters,
  AchievementAction,
  CategoryConfig
} from './types/achievement.types';
export type { AchievementStats as AchievementStatsData } from './types/achievement.types';

// Constants
export { CATEGORY_CONFIGS, STATUS_PRIORITY } from './constants/categoryConfig';
