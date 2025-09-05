import { useMemo } from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
      if (error) throw new Error(error.message || 'Failed to load learning habits');
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

  return (
    <Card className={`h-full min-h-[220px] flex flex-col ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-lg">Study habits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Current streak</div>
            <div className="text-2xl font-semibold">{isLoading ? '-' : streakDays} day{!isLoading && streakDays !== 1 ? 's' : ''}</div>
          </div>
          <div className="text-xs text-gray-500">Keep it going daily</div>
        </div>

        {/* Weekly goal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-gray-600">Weekly goal</div>
            <div className="text-sm font-medium">{isLoading ? '-' : weekCount}/{WEEKLY_GOAL} lessons</div>
          </div>
          <Progress value={Math.min(100, (weekCount / WEEKLY_GOAL) * 100)} />
        </div>

        {/* 7-day mini series */}
        <div className="grid grid-cols-7 gap-1">
          {weekSeries.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className="w-6 rounded bg-forge-orange/20"
                style={{ height: Math.max(6, Math.min(28, v * 8)) }}
                title={`${v} completions`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default LearningHabits;
