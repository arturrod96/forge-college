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
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useQuery } from '@tanstack/react-query';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { useTranslation } from 'react-i18next';
import { LoadingCard } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen } from 'lucide-react';
import { getCourseTitleWithLocalizations } from '@/lib/localization';

interface RecentCourse {
  id: string;
  title: string;
  title_en?: string | null;
  title_pt_br?: string | null;
  description: string;
  course_localizations?: { locale: string; title: string | null }[] | null;
}

type ContinueLearningCardProps = {
  className?: string;
};

export function ContinueLearningCard({ className }: ContinueLearningCardProps) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const { t, i18n } = useTranslation();
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
        .select('modules(courses(id, title, title_en, title_pt_br, description, course_localizations(locale, title)))')
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
        title_en: courseEntry.title_en ?? undefined,
        title_pt_br: courseEntry.title_pt_br ?? undefined,
        description: courseEntry.description,
        course_localizations: (courseEntry as { course_localizations?: { locale: string; title: string | null }[] }).course_localizations ?? undefined,
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
      aria-label={t('dashboard.continueLearning.ariaLabel', { course: getCourseTitleWithLocalizations(recentCourse, recentCourse.course_localizations, i18n.language) })}
    >
      <EnhancedCardHeader>
        <EnhancedCardTitle size="lg">
          {t('dashboard.continueLearning.title')}
        </EnhancedCardTitle>
        <EnhancedCardDescription size="md" className="text-forge-cream-200/90">
          {t('dashboard.continueLearning.subtitle')}
        </EnhancedCardDescription>
        <p className="text-xl font-semibold pt-2 text-forge-formationFg">
          {getCourseTitleWithLocalizations(recentCourse, recentCourse.course_localizations, i18n.language)}
        </p>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <Link to={DASHBOARD_LEARN_COURSE(recentCourse.id)}>
          <EnhancedButton
            size="lg"
            withGradient
            className="w-full md:w-auto"
            aria-label={t('common.buttons.continueLearning') + ' - ' + getCourseTitleWithLocalizations(recentCourse, recentCourse.course_localizations, i18n.language)}
          >
            {t('common.buttons.continueLearning')}
          </EnhancedButton>
        </Link>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
