import { useState, useCallback } from 'react';
import { AchievementCategory, AchievementFilters } from '../types/achievement.types';

export function useAchievementFilters() {
  const [filters, setFilters] = useState<AchievementFilters>({
    category: 'all',
    sortBy: 'status'
  });

  const setCategory = useCallback((category: 'all' | AchievementCategory) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: 'all', sortBy: 'status' });
  }, []);

  return {
    filters,
    setCategory,
    setSearchQuery,
    resetFilters
  };
}
