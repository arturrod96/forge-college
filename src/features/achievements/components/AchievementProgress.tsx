import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AchievementProgressProps {
  current: number;
  max: number;
}

export function AchievementProgress({ current, max }: AchievementProgressProps) {
  const { t } = useTranslation();
  const percentage = Math.round((current / max) * 100);

  // Dynamic color based on progress
  const progressColor = percentage >= 75
    ? 'bg-green-500'
    : percentage >= 50
    ? 'bg-blue-500'
    : 'bg-forge-orange';

  // Determine text color to match
  const textColor = percentage >= 75
    ? 'text-green-600'
    : percentage >= 50
    ? 'text-blue-600'
    : 'text-forge-orange';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">{t('achievements.progress')}</span>
        <span className={cn('font-semibold', textColor)}>
          {current}/{max} <span className="text-xs text-gray-500">({percentage}%)</span>
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            progressColor,
            percentage >= 90 && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
