import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, TrendingUp, Target, CheckCircle2, Lock } from 'lucide-react';
import { Achievement, AchievementStats } from '../types/achievement.types';
import { CATEGORY_CONFIGS } from '../constants/categoryConfig';
import { AchievementProgress } from './AchievementProgress';
import { cn } from '@/lib/utils';

interface AchievementsSidebarProps {
  stats: AchievementStats;
  selectedAchievement: Achievement | null;
  suggestedAchievement: Achievement | null;
  onActionClick: (achievement: Achievement) => void;
}

export function AchievementsSidebar({
  stats,
  selectedAchievement,
  suggestedAchievement,
  onActionClick,
}: AchievementsSidebarProps) {
  const { t } = useTranslation();

  // If an achievement is selected, show its details
  if (selectedAchievement) {
    const Icon = selectedAchievement.icon;
    const config = CATEGORY_CONFIGS[selectedAchievement.category];
    const CategoryIcon = config.icon;
    const isCompleted = selectedAchievement.status === 'completed';
    const isLocked = selectedAchievement.status === 'locked';

    return (
      <div className="w-96 shrink-0 hidden lg:block sticky top-6 self-start space-y-4">
        <Card className={cn(
          'border-2',
          isCompleted && 'border-green-300 bg-green-50/20',
          isLocked && 'border-gray-200',
          !isCompleted && !isLocked && 'border-forge-orange/30'
        )}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                config.bgColor,
                'p-4 rounded-xl shadow-sm',
                isCompleted && 'ring-2 ring-green-300',
                !isLocked && !isCompleted && 'ring-1 ring-gray-200'
              )}>
                <Icon className={cn('h-8 w-8', config.color)} />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className={cn(config.borderColor, config.color, 'mb-2')}>
                  {CategoryIcon && <CategoryIcon className="h-3 w-3 mr-1" />}
                  {t(config.label)}
                </Badge>
                {isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">{t('achievements.completedBadge')}</span>
                  </div>
                )}
                {isLocked && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-medium">{t('achievements.locked')}</span>
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl leading-tight">{selectedAchievement.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed mt-2">
              {selectedAchievement.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* XP Reward */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-sm font-medium text-gray-700">{t('achievements.xpReward')}</span>
              <div className="flex items-center gap-1">
                <Award className="h-5 w-5 text-forge-orange" />
                <span className="text-xl font-bold text-forge-orange">
                  {selectedAchievement.xpReward} XP
                </span>
              </div>
            </div>

            {/* Progress */}
            {selectedAchievement.progress !== undefined && selectedAchievement.maxProgress && (
              <div>
                <AchievementProgress
                  current={selectedAchievement.progress}
                  max={selectedAchievement.maxProgress}
                />
              </div>
            )}

            {/* Action Button */}
            {selectedAchievement.action && !isCompleted && !isLocked && (
              <Button
                className="w-full bg-forge-orange hover:bg-forge-orange/90"
                onClick={() => onActionClick(selectedAchievement)}
              >
                {selectedAchievement.action.label}
              </Button>
            )}

            {isCompleted && (
              <div className="text-center text-sm font-medium text-green-700 bg-green-100 py-3 rounded-md">
                ✓ {t('achievements.completedBadge')}
              </div>
            )}

            {isLocked && (
              <div className="text-center text-sm text-gray-500 bg-gray-100 py-3 rounded-md">
                🔒 {t('achievements.locked')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-forge-orange" />
              {t('achievements.sidebar.tips')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>• {t('achievements.sidebar.tip1')}</p>
            <p>• {t('achievements.sidebar.tip2')}</p>
            <p>• {t('achievements.sidebar.tip3')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default state: Show summary stats and suggested achievement
  return (
    <div className="w-96 shrink-0 hidden lg:block sticky top-6 self-start space-y-4">
      {/* Compact Stats with Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-forge-orange" />
            {t('achievements.sidebar.overview')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Overall Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span className="font-medium">{t('achievements.overallProgress')}</span>
              <span className="font-bold text-forge-orange">
                {stats.completionPercentage}%
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full transition-all duration-500 ease-out rounded-full bg-forge-orange"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Completed Stats */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-600">{t('achievements.completed')}</span>
            <span className="text-lg font-bold">
              {stats.completed}<span className="text-gray-400">/{stats.total}</span>
            </span>
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('achievements.inProgress')}</span>
            <span className="text-lg font-bold text-blue-600">{stats.inProgress}</span>
          </div>

          {/* XP Combined in one row */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-gray-600">XP</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-forge-orange" />
                <span className="text-sm font-bold text-forge-orange">{stats.totalXP}</span>
              </div>
              <span className="text-xs text-gray-400">
                of {stats.totalXP + stats.availableXP}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Next Achievement */}
      {suggestedAchievement && (
        <Card className="border-2 border-forge-orange/40 bg-orange-50/30">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-forge-orange" />
              <CardTitle className="text-base">{t('achievements.sidebar.nextSuggested')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={cn(
                CATEGORY_CONFIGS[suggestedAchievement.category].bgColor,
                'p-2.5 rounded-lg'
              )}>
                <suggestedAchievement.icon
                  className={cn('h-5 w-5', CATEGORY_CONFIGS[suggestedAchievement.category].color)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight mb-1">
                  {suggestedAchievement.title}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {suggestedAchievement.description}
                </p>
              </div>
            </div>

            {/* Progress if available */}
            {suggestedAchievement.progress !== undefined && suggestedAchievement.maxProgress && (
              <AchievementProgress
                current={suggestedAchievement.progress}
                max={suggestedAchievement.maxProgress}
              />
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-forge-orange" />
                <span className="text-sm font-bold text-forge-orange">
                  {suggestedAchievement.xpReward} XP
                </span>
              </div>
              {suggestedAchievement.action && (
                <Button
                  size="sm"
                  className="bg-forge-orange hover:bg-forge-orange/90"
                  onClick={() => onActionClick(suggestedAchievement)}
                >
                  {suggestedAchievement.action.label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contextual Guidance - Dynamic based on user state */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            {stats.completed === 0 ? t('achievements.sidebar.gettingStarted') : t('achievements.sidebar.keepGoing')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-700 space-y-2">
          <p className="leading-relaxed">
            <strong>{t('achievements.sidebar.hoverTip')}</strong>
          </p>

          {/* Dynamic messages based on progress */}
          {stats.inProgress > 0 && (
            <p className="text-blue-700 font-medium">
              {t('achievements.sidebar.inProgressMessage', { count: stats.inProgress })}
            </p>
          )}

          {stats.completed === 0 && (
            <p className="text-forge-orange font-medium">
              {t('achievements.sidebar.quickWinsTip')}
            </p>
          )}

          {stats.completionPercentage >= 50 && stats.completionPercentage < 100 && (
            <p className="text-green-700 font-medium">
              {t('achievements.sidebar.halfwayThere', {
                remaining: stats.total - stats.completed
              })}
            </p>
          )}

          {stats.completionPercentage === 100 && (
            <p className="text-green-700 font-medium">
              🎉 {t('achievements.sidebar.allComplete')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
