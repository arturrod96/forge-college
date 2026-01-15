import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AchievementTabs } from './AchievementTabs';
import { AchievementsSidebar } from './AchievementsSidebar';
import { useAchievements } from '../hooks/useAchievements';
import { useAchievementStats } from '../hooks/useAchievementStats';
import { useAchievementActions } from '../hooks/useAchievementActions';
import { useAchievementFilters } from '../hooks/useAchievementFilters';
import { Achievement } from '../types/achievement.types';

export function AchievementsPage() {
  const { t } = useTranslation();
  const { filters, setCategory } = useAchievementFilters();
  const { achievements } = useAchievements(filters);
  const stats = useAchievementStats(achievements);
  const { handleAchievementAction } = useAchievementActions();

  // State for selected achievement (for sidebar)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Get all achievements for suggesting next one (not filtered by category)
  const { achievements: allAchievements } = useAchievements();

  // Suggest next achievement (prioritize in_progress with highest progress %)
  // Smart filtering: don't suggest what's already visible
  const suggestedAchievement = useMemo(() => {
    const inProgress = allAchievements
      .filter(a => a.status === 'in_progress')
      .sort((a, b) => {
        const progressA = a.progress && a.maxProgress ? (a.progress / a.maxProgress) : 0;
        const progressB = b.progress && b.maxProgress ? (b.progress / b.maxProgress) : 0;
        return progressB - progressA;
      });

    // If viewing "all", don't show suggestion (everything is already visible)
    if (filters.category === 'all') {
      return null;
    }

    // If viewing a specific category, suggest from OTHER categories to avoid duplication
    const suggestionFromOtherCategory = inProgress.find(a => a.category !== filters.category);
    return suggestionFromOtherCategory || null;
  }, [allAchievements, filters.category]);

  return (
    <div className="flex flex-col gap-6 max-w-[1800px] mx-auto px-4 sm:px-6 lg:flex-row">
      {/* Main Content Column */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {t('achievements.title')}
          </h1>
          <p className="text-gray-600">{t('achievements.subtitle')}</p>
        </div>

        <AchievementsSidebar
          stats={stats}
          selectedAchievement={selectedAchievement}
          suggestedAchievement={suggestedAchievement}
          onActionClick={handleAchievementAction}
          variant="mobile"
        />

        {/* Category Tabs & Achievement Grid */}
        <AchievementTabs
          selectedCategory={filters.category}
          onCategoryChange={setCategory}
          achievements={achievements}
          onAchievementAction={handleAchievementAction}
          onAchievementHover={setSelectedAchievement}
          selectedAchievementId={selectedAchievement?.id}
        />
      </div>

      {/* Contextual Sidebar */}
      <AchievementsSidebar
        stats={stats}
        selectedAchievement={selectedAchievement}
        suggestedAchievement={suggestedAchievement}
        onActionClick={handleAchievementAction}
        variant="desktop"
      />
    </div>
  );
}
