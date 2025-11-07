import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpenText, Clock, Play, HelpCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order: number;
  lesson_type: 'text' | 'video' | 'quiz';
  duration_minutes: number | null;
  xp_value: number;
  is_published: boolean;
  module_id: string;
  modules?: {
    title: string;
    course_id?: string;
  };
}

type PublishedLessonsProps = {
  limit?: number;
  className?: string;
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Play;
    case 'quiz':
      return HelpCircle;
    default:
      return BookOpenText;
  }
};

const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case 'text':
      return 'Text Lesson';
    case 'video':
      return 'Video Lesson';
    case 'quiz':
      return 'Quiz';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export function PublishedLessons({ limit, className }: PublishedLessonsProps) {
  const { t } = useTranslation();
  const supabase = createClientBrowser();

  const { data: lessons = [], isLoading } = useQuery<Lesson[]>({
    queryKey: ['publishedLessons'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, slug, order, lesson_type, duration_minutes, xp_value, is_published, module_id, modules(title)')
        .eq('is_published', true)
        .order('module_id', { ascending: true })
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <LoadingGrid
        count={limit || 6}
        columns={{ sm: 1, md: 2, lg: 3 }}
        aspectRatio="portrait"
        showContent={true}
      />
    );
  }

  const visibleLessons = limit ? lessons.slice(0, limit) : lessons;

  if (visibleLessons.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        icon={BookOpenText}
        title="No lessons available"
        description="Lessons will be available as modules are published"
        size="md"
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {visibleLessons.map((lesson) => {
          const Icon = getLessonIcon(lesson.lesson_type);
          const module = Array.isArray(lesson.modules) ? lesson.modules[0] : lesson.modules;
          const moduleTitle = module?.title || 'Unknown Module';

          return (
            <Card
              key={lesson.id}
              className="relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[250px] flex flex-col"
            >
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words">
                  <Icon className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                  <span>#{lesson.order} · {lesson.title}</span>
                </CardTitle>
                <CardDescription className="text-[13px] text-forge-gray">
                  {moduleTitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 mt-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" size="sm">
                    {getLessonTypeLabel(lesson.lesson_type)}
                  </Badge>
                  {lesson.duration_minutes && (
                    <Badge variant="outline" size="sm" icon={Clock} iconPosition="left">
                      {lesson.duration_minutes} min
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-forge-gray font-medium">
                  {lesson.xp_value} XP
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
