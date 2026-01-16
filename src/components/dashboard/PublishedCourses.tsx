import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Clock, PlayCircle, CircleCheck, Layers, CirclePlay, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch, StatusFilter, ProgressFilter, SortSelector, type StatusFilterValue, type ProgressFilterValue, type SortOption } from '@/components/filters';

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
  modules?: Array<{
    id: string;
    title: string;
    order: number;
  }>;
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
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('path_order');

  // Fetch courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['publishedCourses'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, slug, duration_minutes, thumbnail_url, order, status, is_published, modules(id, title, order)')
        .eq('is_published', true)
        .order('order', { ascending: true });
      if (error) throw error;
      
      return (data || []).map((course: any) => {
        const modules = (course.modules || [])
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            order: m.order ?? 0,
          }))
          .filter((m: any) => m.id && m.title)
          .sort((a: any, b: any) => a.order - b.order);

        return {
          ...course,
          modules,
        };
      });
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

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((course) => {
        if (statusFilter === 'available') {
          return course.status === 'published';
        }
        if (statusFilter === 'coming_soon') {
          return course.status === 'coming_soon';
        }
        return true;
      });
    }

    // Filter by progress
    if (progressFilter.length > 0) {
      result = result.filter((course) => {
        return progressFilter.includes(course.progressStatus);
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          (course.description && course.description.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          // Courses don't have created_at in this query, so use order as fallback
          return a.order - b.order;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'path_order':
          return a.order - b.order;
        default:
          // Default: progress status first, then order
          const statusOrder = { in_progress: 0, not_started: 1, completed: 2 };
          const orderDiff = statusOrder[a.progressStatus] - statusOrder[b.progressStatus];
          if (orderDiff !== 0) return orderDiff;
          return a.order - b.order;
      }
    });

    return result;
  }, [courses, courseProgress, searchTerm, statusFilter, progressFilter, sortOption]);

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
      {(showSearch || true) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {showSearch && (
              <ContentSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search courses..."
              />
            )}
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            <ProgressFilter selected={progressFilter} onChange={setProgressFilter} />
            <SortSelector
              value={sortOption}
              onChange={setSortOption}
              options={['recent', 'alphabetical', 'path_order']}
            />
          </div>
        </div>
      )}

      {visibleCourses.length === 0 && (searchTerm || statusFilter !== 'all' || progressFilter.length > 0) && (
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
                  'relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[300px] flex flex-col',
                  isAvailable ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed',
                  isInProgress ? 'ring-2 ring-forge-orange/30' : '',
                ].join(' ')}
              >
                {/* Thumbnail */}
                <div className="h-48 flex items-center justify-center relative" style={{ backgroundColor: '#303b2e' }}>
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-forge-orange" />
                  )}
                  
                  {/* Badges sobre a thumbnail */}
                  {isInProgress && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                        Enrolled
                      </Badge>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                        Completed
                      </Badge>
                    </div>
                  )}
                  {course.status === 'coming_soon' && !isInProgress && !isCompleted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words flex-1">
                    <BookOpen className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                    <span>{course.title}</span>
                  </CardTitle>
                  <CardDescription className="text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]">
                    {course.description || 'Explore this course to enhance your skills'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mt-auto">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Layers className="h-4 w-4" />
                      {course.modules?.length || 0} {course.modules?.length === 1 ? 'module' : 'modules'}
                    </div>
                    {course.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration_minutes} min
                      </div>
                    )}
                  </div>

                  {/* Modules preview */}
                  {course.modules && course.modules.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Modules:</h4>
                      <div className="space-y-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <div key={module.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-blue-500 font-medium">{index + 1}.</span>
                            <span className="truncate">{module.title}</span>
                          </div>
                        ))}
                        {course.modules.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{course.modules.length - 3} more modules
                          </div>
                        )}
                      </div>
                    </div>
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
