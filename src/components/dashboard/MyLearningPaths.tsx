import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_PATH } from '@/routes/paths';
import { useQuery } from '@tanstack/react-query';
import EnhancedButton from '@/components/ui/enhanced-button';
import { useTranslation } from 'react-i18next';

interface InProgressPath {
  id: string;
  title: string;
  description?: string;
  // We'll calculate this in the future
  progress: number; 
}

export function MyLearningPaths() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const supabase = useMemo(() => createClientBrowser(), []);

  const { data: myPaths = [], isLoading } = useQuery<InProgressPath[]>({
    queryKey: ['myPaths', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<InProgressPath[]> => {
      try {
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('user_enrollments')
          .select(`
            learning_path_id,
            learning_paths!inner(id, title, description)
          `)
          .eq('user_id', user!.id)
          .eq('is_active', true);
        if (enrollmentError) throw enrollmentError;

        const pathsWithProgress = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const path = enrollment.learning_paths;
            const { data: progress, error: progressError } = await supabase
              .rpc('get_path_progress', {
                path_id: path.id,
                user_id: user!.id,
              });
            if (progressError) {
              console.error('Erro ao buscar progresso da trilha:', path.id, progressError);
              return { ...path, progress: 0 };
            }
            return { ...path, progress: progress || 0 };
          })
        );
        return pathsWithProgress;
      } catch (error) {
        console.error('Erro ao buscar trilhas do usuário:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (myPaths.length === 0) {
    return (
      <div className="mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">
              <p className="mb-2">{t('dashboard.myLearningPaths.emptyTitle')}</p>
              <p className="text-sm">{t('dashboard.myLearningPaths.emptySubtitle')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressColor = (value: number) => {
    if (value >= 80) return 'from-green-50 to-green-100 text-green-700';
    if (value >= 40) return 'from-yellow-50 to-yellow-100 text-yellow-700';
    return 'from-gray-50 to-gray-100 text-gray-700';
  };

  return (
    <div className="mb-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {myPaths.map(path => (
          <Card
            key={path.id}
            className={`h-full flex flex-col transition-shadow hover:shadow-md border-forge-cream/80 ${path.progress > 0 ? 'ring-1 ring-forge-orange/10' : ''}`}
          >
            <CardHeader>
              <CardTitle className="tracking-tight">{path.title}</CardTitle>
              {path.description && (
                <CardDescription className="line-clamp-2 text-forge-gray">{path.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs rounded-full px-2 py-1 bg-gradient-to-br ${progressColor(path.progress)} inline-block`}>
                  {t('dashboard.myLearningPaths.progressLabel', { progress: path.progress })}
                </div>
                <Link to={DASHBOARD_LEARN_PATH(path.id)}>
                  <EnhancedButton size="sm" withGradient>
                    {t('dashboard.pathOverview.continue')}
                  </EnhancedButton>
                </Link>
              </div>
              <Progress value={path.progress} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
