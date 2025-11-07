import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  order: number;
  status: 'draft' | 'published' | 'coming_soon';
  is_published: boolean;
}

type PublishedCoursesProps = {
  limit?: number;
  className?: string;
};

export function PublishedCourses({ limit, className }: PublishedCoursesProps) {
  const { t } = useTranslation();
  const supabase = createClientBrowser();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['publishedCourses'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, slug, duration_minutes, thumbnail_url, order, status, is_published')
        .eq('is_published', true)
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

  const visibleCourses = limit ? courses.slice(0, limit) : courses;

  if (visibleCourses.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        icon={BookOpen}
        title="No courses available"
        description="Start exploring our courses soon!"
        size="md"
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {visibleCourses.map((course) => (
          <Card
            key={course.id}
            className="relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[300px] flex flex-col"
          >
            {course.thumbnail_url && (
              <div className="h-40 bg-gradient-to-b from-forge-orange/10 to-forge-cream/30 overflow-hidden">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words">
                <BookOpen className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                <span>{course.title}</span>
              </CardTitle>
              <CardDescription className="text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]">
                {course.description || 'Explore this course to enhance your skills'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 text-xs text-forge-gray">
                {course.duration_minutes && (
                  <>
                    <Clock className="h-3.5 w-3.5 text-forge-orange" />
                    {course.duration_minutes} minutes
                  </>
                )}
              </div>
              {course.status === 'coming_soon' && (
                <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                  Coming Soon
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
