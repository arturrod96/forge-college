import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { AchievementCard } from './AchievementCard';
import { Achievement, AchievementCategory } from '../types/achievement.types';

interface AchievementTabsProps {
  selectedCategory: 'all' | AchievementCategory;
  onCategoryChange: (category: 'all' | AchievementCategory) => void;
  achievements: Achievement[];
  onAchievementAction: (achievement: Achievement) => void;
  onAchievementHover?: (achievement: Achievement | null) => void;
  selectedAchievementId?: string;
}

export function AchievementTabs({
  selectedCategory,
  onCategoryChange,
  achievements,
  onAchievementAction,
  onAchievementHover,
  selectedAchievementId
}: AchievementTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs
      value={selectedCategory}
      onValueChange={(v) => onCategoryChange(v as 'all' | AchievementCategory)}
      className="space-y-6"
    >
      <TabsList className="flex w-full gap-2 overflow-x-auto sm:grid sm:grid-cols-5 sm:gap-0 sm:overflow-visible">
        <TabsTrigger className="flex-1 min-w-[140px] sm:min-w-0" value="all">{t('achievements.all')}</TabsTrigger>
        <TabsTrigger className="flex-1 min-w-[140px] sm:min-w-0" value="community">{t('achievements.categories.community')}</TabsTrigger>
        <TabsTrigger className="flex-1 min-w-[140px] sm:min-w-0" value="profile">{t('achievements.categories.profile')}</TabsTrigger>
        <TabsTrigger className="flex-1 min-w-[140px] sm:min-w-0" value="learning">{t('achievements.categories.learning')}</TabsTrigger>
        <TabsTrigger className="flex-1 min-w-[140px] sm:min-w-0" value="social">{t('achievements.categories.social')}</TabsTrigger>
      </TabsList>

      <TabsContent value={selectedCategory} className="space-y-4">
        {achievements.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('achievements.emptyState.title')}
              </h3>
              <p className="text-gray-600 max-w-md">
                {selectedCategory === 'all'
                  ? t('achievements.emptyState.descriptionAll')
                  : t('achievements.emptyState.descriptionCategory', {
                      category: t(`achievements.categories.${selectedCategory}`)
                    })
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {achievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onActionClick={onAchievementAction}
                onHover={onAchievementHover}
                isSelected={achievement.id === selectedAchievementId}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
