import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
} from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { LoadingCard } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen } from 'lucide-react';

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

  if (isLoading) {
    return (
      <LoadingCard
        className={className}
        showHeader={true}
        contentLines={2}
        showFooter={true}
      />
    );
  }

  if (!recentCourse) {
    return (
      <EnhancedCard
        variant="gradient"
        size="lg"
        className={className}
      >
        <EmptyState
          variant="no-data"
          icon={BookOpen}
          title={t('dashboard.continueLearning.empty.title')}
          description={t('dashboard.continueLearning.empty.description')}
          size="sm"
        />
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard
      variant="gradient"
      size="lg"
      className={className}
      aria-label={t('dashboard.continueLearning.ariaLabel', { course: recentCourse.title })}
    >
      <EnhancedCardHeader>
        <EnhancedCardTitle size="lg">
          {t('dashboard.continueLearning.title')}
        </EnhancedCardTitle>
        <EnhancedCardDescription size="md">
          {t('dashboard.continueLearning.subtitle')}
        </EnhancedCardDescription>
        <p className="text-xl font-semibold pt-2 text-foreground">
          {recentCourse.title}
        </p>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <Link to={DASHBOARD_LEARN_COURSE(recentCourse.id)}>
          <Button
            size="lg"
            className="w-full md:w-auto"
            aria-label={t('common.buttons.continueLearning') + ' - ' + recentCourse.title}
          >
            {t('common.buttons.continueLearning')}
          </Button>
        </Link>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
