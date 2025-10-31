import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, BookOpen, Clock, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserStats {
  totalXP: number;
  completedLessons: number;
  inProgressPaths: number;
  totalTimeSpent: number;
}

const MOCK_STATS: UserStats = {
  totalXP: 1320,
  completedLessons: 9,
  inProgressPaths: 2,
  totalTimeSpent: 210,
};

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
  const [useMock, setUseMock] = useState(true);

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
        const completedLessons = rows.filter((r: any) => r.status === 'completed').length;
        const lessonIds: string[] = Array.from(new Set(rows.map((r: any) => r.lesson_id).filter(Boolean)));

        // 2) fetch lessons in chunks to avoid long URLs
        const chunkSize = 50;
        let lessons: any[] = [];
        if (lessonIds.length > 0) {
          for (let i = 0; i < lessonIds.length; i += chunkSize) {
            const chunk = lessonIds.slice(i, i + chunkSize);
            const { data: ldata, error: lerr } = await supabase
              .from('lessons')
              .select('id, xp_value, modules(courses(path_id))')
              .in('id', chunk);
            if (lerr) throw new Error(lerr.message || t('dashboard.userStats.errors.loadLessons'));
            lessons = lessons.concat(ldata || []);
          }
        }

        let totalXP = 0;
        const pathIds = new Set<string>();
        lessons.forEach((l: any) => {
          totalXP += l?.xp_value || 0;
          const pid = l?.modules?.courses?.path_id || l?.modules?.path_id;
          if (pid) pathIds.add(pid);
        });

        const inProgressPaths = pathIds.size;

        if (isMounted) {
          const computed: UserStats = {
            totalXP,
            completedLessons,
            inProgressPaths,
            totalTimeSpent: Math.max(0, Math.floor(completedLessons * 15))
          };
          setStats(computed);
          setUseMock(!(computed.totalXP || computed.completedLessons || computed.inProgressPaths));
        }
      } catch (error: any) {
        if (!isMounted) return;
        console.error('Error fetching user statistics:', error?.message || error);
        setStats({ totalXP: 0, completedLessons: 0, inProgressPaths: 0, totalTimeSpent: 0 });
        setUseMock(true);
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

  const display = useMock || loading ? MOCK_STATS : stats;

  const statCards = [
    {
      title: t('dashboard.userStats.totalXp'),
      value: display.totalXP,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    {
      title: t('dashboard.userStats.completedLessons'),
      value: display.completedLessons,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    {
      title: t('dashboard.userStats.activePaths'),
      value: display.inProgressPaths,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      title: t('dashboard.userStats.studyTime'),
      value: t('dashboard.userStats.studyTimeValue', { minutes: display.totalTimeSpent }),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-2 rounded-md shadow-inner`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
