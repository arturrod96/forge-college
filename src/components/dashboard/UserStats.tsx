import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { StatCard } from '@/components/ui/stat-card';
import { Trophy, BookOpen, Clock, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserStats {
  totalXP: number;
  completedLessons: number;
  inProgressPaths: number;
  totalTimeSpent: number;
}

export function UserStats() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    completedLessons: 0,
    inProgressPaths: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchStats = async () => {
      const start = Date.now();
      if (isMounted) setLoading(true);
      try {
        // 1) progress rows
        const { data: progressRows, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id, status')
          .eq('user_id', user.id)
          .in('status', ['in_progress', 'completed']);
        if (progressError) throw new Error(progressError.message || t('dashboard.userStats.errors.loadProgress'));

        const rows = (progressRows || []) as any[];
        const completedLessonsIds = new Set(
          rows.filter((r: any) => r.status === 'completed').map((r: any) => r.lesson_id)
        );
        const completedLessons = completedLessonsIds.size;
        const lessonIds: string[] = Array.from(new Set(rows.map((r: any) => r.lesson_id).filter(Boolean)));

        // 2) fetch lessons in chunks to avoid long URLs
        const chunkSize = 50;
        let lessons: any[] = [];
        if (lessonIds.length > 0) {
          for (let i = 0; i < lessonIds.length; i += chunkSize) {
            const chunk = lessonIds.slice(i, i + chunkSize);
            const { data: ldata, error: lerr } = await supabase
              .from('lessons')
              .select('id, xp_value, duration_minutes, modules(courses(path_id))')
              .in('id', chunk);
            if (lerr) throw new Error(lerr.message || t('dashboard.userStats.errors.loadLessons'));
            lessons = lessons.concat(ldata || []);
          }
        }

        let totalXP = 0;
        let totalTimeSpent = 0;
        const pathIds = new Set<string>();

        lessons.forEach((l: any) => {
          // Add XP for all interacted lessons or only completed? Usually XP is for completed lessons.
          // The previous code was summing XP for ALL lessons in the list (which includes in_progress).
          // But usually you get XP only when completed.
          // Let's check logic: "lessons" contains all lessons user has interaction with (in_progress or completed).
          // Assuming we want XP for completed ones.
          
          if (completedLessonsIds.has(l.id)) {
            totalXP += l?.xp_value || 0;
            totalTimeSpent += l?.duration_minutes || 0;
          }
          
          const pid = l?.modules?.courses?.path_id || l?.modules?.path_id;
          if (pid) pathIds.add(pid);
        });

        const inProgressPaths = pathIds.size;

        if (isMounted) {
          const computed: UserStats = {
            totalXP,
            completedLessons,
            inProgressPaths,
            totalTimeSpent,
          };
          setStats(computed);
        }
      } catch (error: any) {
        if (!isMounted) return;
        console.error('Error fetching user statistics:', error?.message || error);
        setStats({ totalXP: 0, completedLessons: 0, inProgressPaths: 0, totalTimeSpent: 0 });
      } finally {
        if (!isMounted) return;
        const elapsed = Date.now() - start;
        const MIN_SKELETON_MS = 600;
        const delay = Math.max(0, MIN_SKELETON_MS - elapsed);
        setTimeout(() => { if (isMounted) setLoading(false); }, delay);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, [user, supabase]);

  const statCards = [
    {
      label: t('dashboard.userStats.totalXp'),
      value: stats.totalXP,
      icon: Trophy,
      colorScheme: 'yellow' as const,
    },
    {
      label: t('dashboard.userStats.completedLessons'),
      value: stats.completedLessons,
      icon: BookOpen,
      colorScheme: 'green' as const,
    },
    {
      label: t('dashboard.userStats.activePaths'),
      value: stats.inProgressPaths,
      icon: Target,
      colorScheme: 'blue' as const,
    },
    {
      label: t('dashboard.userStats.studyTime'),
      value: t('dashboard.userStats.studyTimeValue', { minutes: stats.totalTimeSpent }),
      icon: Clock,
      colorScheme: 'purple' as const,
    }
  ];

  return (
    <div className="grid gap-card-gap md:grid-cols-4">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          colorScheme={stat.colorScheme}
          variant="gradient"
          isLoading={loading}
          aria-label={`${stat.label}: ${stat.value}`}
        />
      ))}
    </div>
  );
}
