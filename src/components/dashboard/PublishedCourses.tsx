import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch } from '@/components/filters';

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

type CourseWithProgress = Course & {
  progressStatus: 'not_started' | 'in_progress' | 'completed';
};

type PublishedCoursesProps = {
  limit?: number;
  className?: string;
  showSearch?: boolean;
};

export function PublishedCourses({ limit, className, showSearch = true }: PublishedCoursesProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['publishedCourses'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
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

  // Fetch user progress for courses
  const { data: courseProgress = {} } = useQuery<Record<string, 'not_started' | 'in_progress' | 'completed'>>({
    queryKey: ['courseProgress', user?.id],
    enabled: !!user?.id && courses.length > 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const courseIds = courses.map((c) => c.id);

      // Get all lessons for these courses via modules
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, modules!inner(course_id)')
        .in('modules.course_id', courseIds);

      if (!lessonsData || lessonsData.length === 0) return {};

      const lessonIds = lessonsData.map((l) => l.id);

      // Get user progress for these lessons
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, status')
        .eq('user_id', user!.id)
        .in('lesson_id', lessonIds);

      // Map lesson to course
      const lessonToCourse: Record<string, string> = {};
      lessonsData.forEach((lesson) => {
        const module = Array.isArray(lesson.modules) ? lesson.modules[0] : lesson.modules;
        if (module?.course_id) {
          lessonToCourse[lesson.id] = module.course_id;
        }
      });

      // Calculate progress per course
      const courseProgressMap: Record<string, { total: number; completed: number; inProgress: number }> = {};
      courseIds.forEach((id) => {
        courseProgressMap[id] = { total: 0, completed: 0, inProgress: 0 };
      });

      lessonsData.forEach((lesson) => {
        const courseId = lessonToCourse[lesson.id];
        if (courseId && courseProgressMap[courseId]) {
          courseProgressMap[courseId].total++;
        }
      });

      progressData?.forEach((progress) => {
        const courseId = lessonToCourse[progress.lesson_id];
        if (courseId && courseProgressMap[courseId]) {
          if (progress.status === 'completed') {
            courseProgressMap[courseId].completed++;
          } else if (progress.status === 'in_progress') {
            courseProgressMap[courseId].inProgress++;
          }
        }
      });

      // Determine status per course
      const result: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      Object.entries(courseProgressMap).forEach(([courseId, stats]) => {
        if (stats.total === 0) {
          result[courseId] = 'not_started';
        } else if (stats.completed === stats.total) {
          result[courseId] = 'completed';
        } else if (stats.completed > 0 || stats.inProgress > 0) {
          result[courseId] = 'in_progress';
        } else {
          result[courseId] = 'not_started';
        }
      });

      return result;
    },
  });

  const isLoading = isLoadingCourses;

  // Combine courses with progress and apply filtering/sorting
  const processedCourses = useMemo(() => {
    let result: CourseWithProgress[] = courses.map((course) => ({
      ...course,
      progressStatus: courseProgress[course.id] || 'not_started',
    }));

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          (course.description && course.description.toLowerCase().includes(term))
      );
    }

    // Sort by progress status: in_progress first, then not_started, then completed
    const statusOrder = { in_progress: 0, not_started: 1, completed: 2 };
    result.sort((a, b) => {
      const orderDiff = statusOrder[a.progressStatus] - statusOrder[b.progressStatus];
      if (orderDiff !== 0) return orderDiff;
      return a.order - b.order;
    });

    return result;
  }, [courses, courseProgress, searchTerm]);

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

  const visibleCourses = limit ? processedCourses.slice(0, limit) : processedCourses;

  if (courses.length === 0) {
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
      {showSearch && (
        <div className="mb-6">
          <ContentSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search courses..."
            className="max-w-md"
          />
        </div>
      )}

      {visibleCourses.length === 0 && searchTerm && (
        <EmptyState
          variant="no-results"
          icon={BookOpen}
          title="No courses found"
          description={`No courses match "${searchTerm}"`}
          size="md"
        />
      )}

      {visibleCourses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visibleCourses.map((course) => {
            const isAvailable = course.status !== 'coming_soon';
            const isInProgress = course.progressStatus === 'in_progress';
            const isCompleted = course.progressStatus === 'completed';

            const card = (
              <Card
                className={[
                  'relative overflow-hidden border-forge-cream/80 transition-shadow h-full min-h-[300px] flex flex-col',
                  isAvailable ? 'hover:shadow-md cursor-pointer' : 'opacity-70 cursor-not-allowed',
                  isInProgress ? 'ring-2 ring-forge-orange/30' : '',
                ].join(' ')}
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
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words flex-1">
                      <BookOpen className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                      <span>{course.title}</span>
                    </CardTitle>
                    {isInProgress && (
                      <Badge variant="brand" size="sm" icon={PlayCircle} iconPosition="left">
                        Continue
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="success" size="sm">
                        Completed
                      </Badge>
                    )}
                  </div>
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
            );

            if (!isAvailable) {
              return <div key={course.id}>{card}</div>;
            }

            return (
              <Link
                key={course.id}
                to={DASHBOARD_LEARN_COURSE(course.id)}
                className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange/60"
              >
                {card}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
