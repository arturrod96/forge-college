import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types/achievement.types';
import { CATEGORY_CONFIGS } from '../constants/categoryConfig';
import { AchievementProgress } from './AchievementProgress';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  onActionClick: (achievement: Achievement) => void;
  onHover?: (achievement: Achievement | null) => void;
  isSelected?: boolean;
}

export const AchievementCard = memo(({
  achievement,
  onActionClick,
  onHover,
  isSelected = false
}: AchievementCardProps) => {
  const { t } = useTranslation();
  const Icon = achievement.icon;
  const config = CATEGORY_CONFIGS[achievement.category];
  const CategoryIcon = config.icon;

  const isCompleted = achievement.status === 'completed';
  const isLocked = achievement.status === 'locked';

  const cardClassName = cn(
    'relative overflow-hidden transition-all duration-300 cursor-pointer',
    'h-full flex flex-col', // Equal height cards with flex layout
    'hover:shadow-lg hover:scale-[1.02]',
    isSelected && 'ring-2 ring-forge-orange shadow-lg scale-[1.02]',
    isCompleted && 'border-green-300 bg-green-50/30',
    isLocked && 'opacity-60 border-gray-200',
    !isCompleted && !isLocked && 'border-forge-cream'
  );

  return (
    <Card
      className={cardClassName}
      onMouseEnter={() => onHover?.(achievement)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onHover?.(achievement)}
    >
      {/* Status Indicator */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="relative">
            <CheckCircle2 className="h-6 w-6 text-green-600 animate-in zoom-in duration-300" />
          </div>
        </div>
      )}
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Icon with ring indicator */}
          <div className={cn(
            config.bgColor,
            'p-3.5 rounded-xl shadow-sm flex-shrink-0 transition-all duration-300',
            isCompleted && 'ring-2 ring-green-300',
            !isLocked && !isCompleted && 'ring-1 ring-gray-200 hover:ring-2 hover:ring-forge-orange/50'
          )}>
            <Icon className={cn('h-7 w-7', config.color)} />
          </div>
          {/* Title and description with improved hierarchy */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold leading-tight mb-2 min-h-[28px]">
              {achievement.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed line-clamp-2 min-h-[40px]">
              {achievement.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3">
        {/* Category & XP Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={cn(config.borderColor, config.color)}>
            {CategoryIcon && <CategoryIcon className="h-3 w-3 mr-1" />}
            {t(config.label)}
          </Badge>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-forge-orange" />
            <span className="font-bold text-forge-orange">{achievement.xpReward} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        {achievement.progress !== undefined && achievement.maxProgress && (
          <AchievementProgress
            current={achievement.progress}
            max={achievement.maxProgress}
          />
        )}

        {/* Spacer to push bottom elements down */}
        <div className="flex-1" />

        {/* Bottom Section - always aligned at card bottom */}
        <div className="mt-auto space-y-2">
          {/* Action Button */}
          {achievement.action && !isCompleted && !isLocked && (
            <Button
              className="w-full bg-forge-orange hover:bg-forge-orange/90"
              onClick={() => onActionClick(achievement)}
            >
              {achievement.action.label}
            </Button>
          )}

          {/* Status Messages */}
          {isCompleted && (
            <div className="text-center text-sm font-medium text-green-700 bg-green-100 py-2 rounded-md">
              {t('achievements.completedBadge')}
            </div>
          )}

          {isLocked && (
            <div className="text-center text-sm text-gray-500 bg-gray-100 py-2 rounded-md">
              {t('achievements.locked')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

AchievementCard.displayName = 'AchievementCard';
