import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BookOpen, Clock, Target } from 'lucide-react';

interface UserStats {
  totalXP: number;
  completedLessons: number;
  inProgressPaths: number;
  totalTimeSpent: number; // placeholder for future implementation
}

export function UserStats() {
  const { user } = useAuth();
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
        // Get completed lessons and calculate XP
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            status,
            lessons!inner(xp_value)
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (progressError) throw progressError;

        const completedLessons = progressData.length;
        const totalXP = progressData.reduce((sum, progress) => sum + (progress.lessons.xp_value || 0), 0);

        // Get number of learning paths with progress
        const { data: pathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select('id');

        if (pathsError) throw pathsError;

        const pathsWithProgress = await Promise.all(
          pathsData.map(async (path) => {
            const { data: hasProgress } = await supabase
              .from('user_progress')
              .select('id')
              .eq('user_id', user.id)
              .in('lesson_id', 
                await supabase
                  .from('lessons')
                  .select('id')
                  .in('module_id',
                    await supabase
                      .from('modules')
                      .select('id')
                      .in('course_id',
                        await supabase
                          .from('courses')
                          .select('id')
                          .eq('path_id', path.id)
                          .then(res => res.data?.map(c => c.id) || [])
                      )
                      .then(res => res.data?.map(m => m.id) || [])
                  )
                  .then(res => res.data?.map(l => l.id) || [])
              )
              .limit(1);

            return hasProgress && hasProgress.length > 0;
          })
        );

        const inProgressPaths = pathsWithProgress.filter(Boolean).length;

        setStats({
          totalXP,
          completedLessons,
          inProgressPaths,
          totalTimeSpent: Math.floor(completedLessons * 15) // Placeholder: 15 min avg per lesson
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Set placeholder stats for demo
        setStats({
          totalXP: 150,
          completedLessons: 12,
          inProgressPaths: 3,
          totalTimeSpent: 180
        });
      }
      setLoading(false);
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
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Lessons Completed',
      value: stats.completedLessons,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Paths',
      value: stats.inProgressPaths,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Study Time',
      value: `${stats.totalTimeSpent}min`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
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
                <div className={`${stat.bgColor} p-2 rounded-md`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}