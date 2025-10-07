import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Achievement, AchievementFilters } from '../types/achievement.types';
import { getAchievementsData } from '../constants/achievementData';

function filterAchievements(achievements: Achievement[], filters: AchievementFilters): Achievement[] {
  let results = achievements;

  // Filter by category
  if (filters.category !== 'all') {
    results = results.filter(a => a.category === filters.category);
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    results = results.filter(a => filters.status!.includes(a.status));
  }

  // Filter by search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  }

  // Sort achievements
  if (filters.sortBy === 'xp') {
    results = results.sort((a, b) => b.xpReward - a.xpReward);
  } else if (filters.sortBy === 'progress') {
    results = results.sort((a, b) => {
      const progressA = a.progress && a.maxProgress ? (a.progress / a.maxProgress) : 0;
      const progressB = b.progress && b.maxProgress ? (b.progress / b.maxProgress) : 0;
      return progressB - progressA;
    });
  } else if (filters.sortBy === 'status') {
    // Default sort by status priority: in_progress > locked > completed
    const statusPriority = { in_progress: 1, locked: 2, completed: 3 };
    results = results.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }

  return results;
}

export function useAchievements(filters?: AchievementFilters) {
  const { t } = useTranslation();

  // Get raw achievements data with translations
  const rawAchievements = useMemo(() => getAchievementsData(t), [t]);

  // Apply filters if provided
  const filteredAchievements = useMemo(() => {
    if (!filters) return rawAchievements;
    return filterAchievements(rawAchievements, filters);
  }, [rawAchievements, filters]);

  return {
    achievements: filteredAchievements,
    isLoading: false,
    error: null
  };
}
