import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, BookOpen, Clock, Target } from 'lucide-react';

interface UserStats {
  totalXP: number;
  completedLessons: number;
  inProgressPaths: number;
  totalTimeSpent: number; // placeholder for future implementation
}

export function UserStats() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    completedLessons: 0,
    inProgressPaths: 0,
    totalTimeSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        // 1) Fetch user progress (only ids and status)
        const { data: progressRows, error: progressError } = await supabase
          .from('user_progress')
          .select('lesson_id, status')
          .eq('user_id', user.id)
          .in('status', ['in_progress', 'completed']);

        if (progressError) throw new Error(progressError.message || 'Failed to load user progress');

        const rows = progressRows || [];
        const completedLessons = rows.filter((p: any) => p.status === 'completed').length;
        const lessonIds = Array.from(new Set(rows.map((r: any) => r.lesson_id).filter(Boolean)));

        if (lessonIds.length === 0) {
          setStats({ totalXP: 0, completedLessons, inProgressPaths: 0, totalTimeSpent: 0 });
          return;
        }

        // 2) Fetch lessons with nested modules -> courses to get path_id
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('id, xp_value, modules(courses(path_id))')
          .in('id', lessonIds);

        if (lessonsError) throw new Error(lessonsError.message || 'Failed to load lessons');

        // Normalize nested path_id w/ both possible nesting keys
        let totalXP = 0;
        const pathIds = new Set<string>();
        (lessonsData || []).forEach((l: any) => {
          totalXP += l?.xp_value || 0;
          const pid = l?.modules?.courses?.path_id || l?.modules?.path_id;
          if (pid) pathIds.add(pid);
        });

        const inProgressPaths = pathIds.size;

        setStats({
          totalXP,
          completedLessons,
          inProgressPaths,
          totalTimeSpent: Math.max(0, Math.floor(completedLessons * 15))
        });
      } catch (error: any) {
        console.error('Error fetching user statistics:', error?.message || error);
        setStats({ totalXP: 0, completedLessons: 0, inProgressPaths: 0, totalTimeSpent: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total XP',
      value: stats.totalXP,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
    },
    {
      title: 'Completed Lessons',
      value: stats.completedLessons,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    {
      title: 'Active Paths',
      value: stats.inProgressPaths,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      title: 'Study Time',
      value: `${stats.totalTimeSpent} min`,
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
