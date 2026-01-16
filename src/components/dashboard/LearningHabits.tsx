import { useMemo } from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from '@/components/ui/enhanced-card';

type ProgressRow = {
  completed_at: string | null;
};

const WEEKLY_GOAL = 5;

type LearningHabitsProps = {
  className?: string;
};

export function LearningHabits({ className }: LearningHabitsProps) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();

  const { data: completions = [], isLoading } = useQuery<ProgressRow[]>({
    queryKey: ['learningHabits', user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    keepPreviousData: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_at')
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message || t('dashboard.learningHabits.loadError'));
      return data as ProgressRow[];
    },
  });

  const { streakDays, weekCount, weekSeries } = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const row of completions) {
      if (!row.completed_at) continue;
      const date = new Date(row.completed_at);
      const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
      byDay.set(key, (byDay.get(key) || 0) + 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Streak calculation (consecutive days ending today if any, otherwise until last day with activity but shown as 0 if no activity today)
    let streak = 0;
    for (let d = new Date(today); ; d.setDate(d.getDate() - 1)) {
      const key = d.toISOString().slice(0, 10);
      const count = byDay.get(key) || 0;
      if (streak === 0 && count === 0) {
        // if first day has 0 (no activity today), streak remains 0
        break;
      }
      if (count > 0) {
        streak += 1;
      } else {
        break;
      }
    }

    // Last 7 days series and count
    const last7: number[] = [];
    let weekSum = 0;
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toISOString().slice(0, 10);
      const count = byDay.get(key) || 0;
      last7.push(count);
      weekSum += count;
    }

    return {
      streakDays: streak,
      weekCount: weekSum,
      weekSeries: last7,
    };
  }, [completions]);

  const streakText = isLoading ? '-' : t('dashboard.learningHabits.dayCount', { count: streakDays });

  return (
    <EnhancedCard 
      variant="gradient" 
      size="lg"
      className={`h-full min-h-[220px] flex flex-col ${className || ''}`}
    >
      <EnhancedCardHeader>
        <EnhancedCardTitle size="md">{t('dashboard.learningHabits.title')}</EnhancedCardTitle>
      </EnhancedCardHeader>
      <EnhancedCardContent className="space-y-4">
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">{t('dashboard.learningHabits.currentStreak')}</div>
            <div className="text-2xl font-semibold">{streakText}</div>
          </div>
        </div>

        {/* Weekly goal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-gray-600">{t('dashboard.learningHabits.weeklyGoal')}</div>
          </div>
          <Progress value={Math.min(100, (streakDays / 7) * 100)} />
        </div>

        {/* 7-day mini series */}
        <div className="grid grid-cols-7 gap-1">
          {weekSeries.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className="w-6 rounded bg-forge-orange-600 shadow-sm"
                style={{ height: Math.max(6, Math.min(28, v * 8)) }}
                title={t('dashboard.learningHabits.completions', { count: v })}
              />
            </div>
          ))}
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
