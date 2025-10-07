import { useMemo } from 'react';
import { Achievement, AchievementStats } from '../types/achievement.types';

export function useAchievementStats(achievements: Achievement[]): AchievementStats {
  return useMemo(() => {
    const completed = achievements.filter(a => a.status === 'completed');
    const inProgress = achievements.filter(a => a.status === 'in_progress');
    const locked = achievements.filter(a => a.status === 'locked');

    const totalXP = completed.reduce((sum, a) => sum + a.xpReward, 0);
    const availableXP = achievements
      .filter(a => a.status !== 'completed')
      .reduce((sum, a) => sum + a.xpReward, 0);

    const completionPercentage = achievements.length > 0
      ? Math.round((completed.length / achievements.length) * 100)
      : 0;

    return {
      total: achievements.length,
      completed: completed.length,
      inProgress: inProgress.length,
      locked: locked.length,
      totalXP,
      availableXP,
      completionPercentage
    };
  }, [achievements]);
}
