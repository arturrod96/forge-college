import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { useTranslation } from 'react-i18next';

interface RecentCourse {
  id: string;
  title: string;
  description: string;
}

type ContinueLearningCardProps = {
  className?: string;
};

export function ContinueLearningCard({ className }: ContinueLearningCardProps) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const { t } = useTranslation();
  const [recentCourse, setRecentCourse] = useState<RecentCourse | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['continueLearning', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!progressData) return null;

      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('modules(courses(id, title, description))')
        .eq('id', progressData.lesson_id)
        .single();
      if (lessonError || !lessonData) return null;
      const moduleEntry = Array.isArray(lessonData.modules)
        ? lessonData.modules[0]
        : lessonData.modules;
      const courseEntry = moduleEntry
        ? (Array.isArray(moduleEntry.courses) ? moduleEntry.courses[0] : moduleEntry.courses)
        : null;
      if (!courseEntry) return null;
      const course: RecentCourse = {
        id: courseEntry.id,
        title: courseEntry.title,
        description: courseEntry.description,
      };
      setRecentCourse(course);
      return course;
    },
  });

  const placeholder = (
    <Card className={`bg-blue-50/60 border-blue-100 mb-8 h-full min-h-[220px] flex flex-col ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-2xl">{t('dashboard.continueLearning.title')}</CardTitle>
        <CardDescription>{t('dashboard.continueLearning.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-10 w-2/3 bg-blue-100 animate-pulse rounded" />
      </CardContent>
    </Card>
  );

  if (isLoading) return placeholder;
  if (!recentCourse) return null;

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 mb-8 h-full min-h-[220px] flex flex-col ${className || ''}`}>
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">{t('dashboard.continueLearning.title')}</CardTitle>
        <CardDescription>{t('dashboard.continueLearning.subtitle')}</CardDescription>
        <p className="text-xl font-semibold pt-2">{recentCourse.title}</p>
      </CardHeader>
      <CardContent>
        <Link to={DASHBOARD_LEARN_COURSE(recentCourse.id)}>
          <Button size="lg" className="w-full md:w-auto">{t('common.buttons.continueLearning')}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
