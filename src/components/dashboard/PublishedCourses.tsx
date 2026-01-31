import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Check, Clock, PlayCircle, CircleCheck, Folder, CirclePlay, Flame, Bell, X, CheckCircle, BookMarked } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch, FilterPopover, type StatusFilterValue, type ProgressFilterValue, type SortOption } from '@/components/filters';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { toast } from 'sonner';
import { HoverEffectGrid } from '@/components/ui/card-hover-effect';
import { getCourseTitleWithLocalizations, getDescriptionFromLocalizations, getTitleFromLocalizations } from '@/lib/localization';

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
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const locale = i18n.language || 'pt-BR';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('path_order');
  const [joiningWaitlistId, setJoiningWaitlistId] = useState<string | null>(null);
  const [leavingWaitlistId, setLeavingWaitlistId] = useState<string | null>(null);
  const [hoveredWaitlistCourseId, setHoveredWaitlistCourseId] = useState<string | null>(null);

  // Fetch courses with localizations for title/description by locale
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['publishedCourses', locale],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, slug, duration_minutes, thumbnail_url, order, status, is_published, course_localizations(locale, title, description), modules(id, title, order, module_localizations(locale, title))')
        .eq('is_published', true)
        .order('order', { ascending: true });
      if (error) throw error;

      return (data || []).map((course: any) => {
        const courseLocs = course.course_localizations;
        const modules = (course.modules || [])
          .map((m: any) => ({
            id: m.id,
            title: getTitleFromLocalizations(m.module_localizations, locale, m.title),
            order: m.order ?? 0,
          }))
          .filter((m: any) => m.id && m.title)
          .sort((a: any, b: any) => a.order - b.order);

        return {
          id: course.id,
          title: getCourseTitleWithLocalizations({ title: course.title }, courseLocs, locale),
          description: getDescriptionFromLocalizations(courseLocs ?? [], locale, course.description) || course.description || '',
          slug: course.slug,
          duration_minutes: course.duration_minutes,
          thumbnail_url: course.thumbnail_url,
          order: course.order,
          status: course.status,
          is_published: course.is_published,
          modules,
        };
      });
    },
  });

  // Fetch waitlist status for courses
  const { data: waitlistedCourses = [] } = useQuery<string[]>({
    queryKey: ['waitlistedCourses', user?.id],
    enabled: !!user?.id && courses.length > 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<string[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('waiting_list')
        .select('course_id')
        .eq('user_id', user.id)
        .not('course_id', 'is', null);
      
      if (error) {
        console.error('Error fetching waitlisted courses:', error);
        return [];
      }
      
      return (data || []).map((entry: any) => entry.course_id).filter(Boolean);
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

  // Join waitlist mutation
  const joinWaitlistMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user || !user.id) {
        throw new Error('Must be logged in to join waiting list');
      }
      
      // Check if already on waitlist first
      const { data: existingEntry } = await supabase
        .from('waiting_list')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (existingEntry) {
        return { courseId, alreadyOnList: true };
      }
      
      // Try using RPC function first
      let entryId: string | null = null;
      let rpcError: any = null;
      
      try {
        const { data, error } = await supabase.rpc('add_to_waiting_list', {
          p_learning_path_id: null,
          p_formation_id: null,
          p_course_id: courseId,
          p_email: user.email || ''
        });
        
        if (error) {
          rpcError = error;
        } else {
          entryId = data;
        }
      } catch (err) {
        rpcError = err;
      }
      
      // If RPC function doesn't exist or fails, fall back to direct insert
      if (rpcError && (rpcError.code === '42883' || rpcError.message?.includes('function') || rpcError.message?.includes('does not exist'))) {
        const { data: insertData, error: insertError } = await supabase
          .from('waiting_list')
          .insert({ 
            user_id: user.id, 
            course_id: courseId,
            email: user.email || ''
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error inserting into waiting_list:', insertError);
          if (insertError.code === '23505') {
            return { courseId, alreadyOnList: true };
          }
          throw new Error(insertError.message || 'Failed to join waiting list');
        }
        
        if (insertData) {
          return { courseId, alreadyOnList: false };
        }
      } else if (rpcError) {
        if (rpcError.message?.includes('already') || rpcError.message?.includes('unique') || rpcError.code === '23505') {
          return { courseId, alreadyOnList: true };
        }
        throw new Error(rpcError.message || 'Failed to join waiting list');
      }
      
      if (entryId) {
        return { courseId, alreadyOnList: false };
      }
      
      return { courseId, alreadyOnList: false };
    },
    onMutate: async (courseId) => {
      setJoiningWaitlistId(courseId);
      
      await queryClient.cancelQueries({ queryKey: ['waitlistedCourses', user?.id] });
      
      const previousWaitlisted = queryClient.getQueryData<string[]>(['waitlistedCourses', user?.id]);
      
      if (previousWaitlisted) {
        queryClient.setQueryData<string[]>(['waitlistedCourses', user?.id], (old) => {
          if (!old) return old;
          return [...old, courseId];
        });
      }
      
      return { previousWaitlisted };
    },
    onSuccess: (result) => {
      if (result.alreadyOnList) {
        toast.info('You are already on the waiting list for this course!');
      } else {
        toast.success('You have been added to the waiting list! You will receive an email when this course becomes available.');
      }
      queryClient.invalidateQueries({ queryKey: ['waitlistedCourses', user?.id] });
    },
    onError: (error, courseId, context) => {
      console.error('Error joining waiting list:', error);
      const message = error instanceof Error ? error.message : 'Failed to join waiting list';
      
      if (context?.previousWaitlisted) {
        queryClient.setQueryData(['waitlistedCourses', user?.id], context.previousWaitlisted);
      }
      
      if (message.includes('already on') || message.includes('already')) {
        toast.info('You are already on the waiting list for this course!');
        queryClient.invalidateQueries({ queryKey: ['waitlistedCourses', user?.id] });
      } else {
        toast.error(message);
      }
    },
    onSettled: () => setJoiningWaitlistId(null),
  });

  // Leave waitlist mutation
  const leaveWaitlistMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user || !user.id) {
        throw new Error('Must be logged in to leave waiting list');
      }
      
      const { error } = await supabase
        .from('waiting_list')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      
      if (error) {
        throw new Error(error.message || 'Failed to leave waiting list');
      }
      
      return courseId;
    },
    onMutate: async (courseId) => {
      setLeavingWaitlistId(courseId);
      
      await queryClient.cancelQueries({ queryKey: ['waitlistedCourses', user?.id] });
      
      const previousWaitlisted = queryClient.getQueryData<string[]>(['waitlistedCourses', user?.id]);
      
      if (previousWaitlisted) {
        queryClient.setQueryData<string[]>(['waitlistedCourses', user?.id], (old) => {
          if (!old) return old;
          return old.filter(id => id !== courseId);
        });
      }
      
      return { previousWaitlisted };
    },
    onSuccess: () => {
      toast.success('You have been removed from the waiting list.');
      queryClient.invalidateQueries({ queryKey: ['waitlistedCourses', user?.id] });
    },
    onError: (error, courseId, context) => {
      console.error('Error leaving waiting list:', error);
      const message = error instanceof Error ? error.message : 'Failed to leave waiting list';
      toast.error(message);
      
      if (context?.previousWaitlisted) {
        queryClient.setQueryData(['waitlistedCourses', user?.id], context.previousWaitlisted);
      }
    },
    onSettled: () => setLeavingWaitlistId(null),
  });

  const handleJoinWaitlist = async (courseId: string) => {
    if (!user) {
      toast.error('You must be logged in to join the waiting list');
      return;
    }
    joinWaitlistMutation.mutate(courseId);
  };

  const handleLeaveWaitlist = async (courseId: string) => {
    if (!user) {
      toast.error('You must be logged in to leave the waiting list');
      return;
    }
    leaveWaitlistMutation.mutate(courseId);
  };

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
      // Helper function to get priority: Enrolled > Available/Not Started > Completed > Coming Soon
      const getPriority = (course: CourseWithProgress) => {
        if (course.status === 'coming_soon') return 3;
        if (course.progressStatus === 'in_progress') return 0;
        if (course.progressStatus === 'not_started') return 1;
        if (course.progressStatus === 'completed') return 2;
        return 4; // fallback
      };

      switch (sortOption) {
        case 'recent':
          // Courses don't have created_at in this query, so use priority first, then order
          const recentPriorityDiff = getPriority(a) - getPriority(b);
          if (recentPriorityDiff !== 0) return recentPriorityDiff;
          return a.order - b.order;
        case 'alphabetical':
          const alphaPriorityDiff = getPriority(a) - getPriority(b);
          if (alphaPriorityDiff !== 0) return alphaPriorityDiff;
          return a.title.localeCompare(b.title);
        case 'path_order':
        default:
          // Default order: Enrolled (in_progress) > Available/Not Started (not_started) > Completed (completed) > Coming Soon (coming_soon)
          const priorityDiff = getPriority(a) - getPriority(b);
          if (priorityDiff !== 0) return priorityDiff;
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
        title={t('courses.emptyNoData')}
        description={t('courses.emptyNoDataDescription')}
        size="md"
      />
    );
  }

  return (
    <div className={className}>
      {(showSearch || true) && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <FilterPopover
              statusValue={statusFilter}
              onStatusChange={setStatusFilter}
              progressSelected={progressFilter}
              onProgressChange={setProgressFilter}
              sortValue={sortOption}
              onSortChange={setSortOption}
              sortOptions={['recent', 'alphabetical', 'path_order']}
            />
            {showSearch && (
              <ContentSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('search.courses')}
                className="w-full max-w-xs"
              />
            )}
          </div>
        </div>
      )}

      {visibleCourses.length === 0 && (searchTerm || statusFilter !== 'all' || progressFilter.length > 0) && (
        <EmptyState
          variant="no-results"
          icon={BookOpen}
          title={t('courses.emptyNoResults')}
          description={t('courses.emptyNoMatch', { term: searchTerm })}
          size="md"
        />
      )}

      {visibleCourses.length > 0 && (
        <HoverEffectGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visibleCourses.map((course) => {
            const isAvailable = course.status !== 'coming_soon';
            const isInProgress = course.progressStatus === 'in_progress';
            const isCompleted = course.progressStatus === 'completed';
            const isComingSoon = course.status === 'coming_soon';
            const isOnWaitlist = waitlistedCourses.includes(course.id);

            const card = (
              <Card
                className={[
                    'relative rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow h-full min-h-[480px] flex flex-col group',
                    isAvailable ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed',
                  ].join(' ')}
                >
                {/* Thumbnail - overflow-hidden only here so card shadow is not clipped */}
                <div className="h-48 flex items-center justify-center relative overflow-hidden rounded-t-lg" style={{ backgroundColor: !isAvailable ? '#4a5a4a' : '#303b2e' }}>
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookMarked className="h-16 w-16 text-forge-orange" />
                  )}
                  
                  {/* Badges sobre a thumbnail */}
                  {isInProgress && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                        {t('dashboard.enrolled')}
                      </Badge>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                        {t('filters.progressOptions.completed')}
                      </Badge>
                    </div>
                  )}
                  {course.status === 'coming_soon' && !isInProgress && !isCompleted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                        {t('filters.statusOptions.coming_soon')}
                      </Badge>
                    </div>
                  )}
                  {isAvailable && !isInProgress && !isCompleted && course.status !== 'coming_soon' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="default" size="sm" icon={CheckCircle} iconPosition="left">
                        {t('filters.statusOptions.available')}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="space-y-1.5 p-6 flex-1 min-h-0 flex flex-col">
                  <div className="space-y-2">
                    <CardTitle className="font-semibold tracking-tight text-xl">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]">
                      {course.description || t('courses.descriptionFallback')}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4 mt-auto">
                  {/* Count + Modules preview (same pattern as formation/path cards) */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      {t('courses.modules', { count: course.modules?.length || 0 })}
                    </div>
                    {course.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration_minutes} min
                      </div>
                    )}
                  </div>

                  {course.modules && course.modules.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">{t('courses.modulesLabel')}</h4>
                      <div className="space-y-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <div key={module.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-forge-orange font-medium">{index + 1}.</span>
                            <span className="truncate">{module.title}</span>
                          </div>
                        ))}
                        {course.modules.length > 3 && (
                          <div className="text-xs text-gray-500">
                            {t('courses.moreModules', { count: course.modules.length - 3 })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  {isInProgress ? (
                    <EnhancedButton 
                      className="w-full text-sm py-2" 
                      size="sm" 
                      withGradient
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(DASHBOARD_LEARN_COURSE(course.id));
                      }}
                    >
                      {t('common.buttons.continueLearning')}
                    </EnhancedButton>
                  ) : isComingSoon ? (
                    isOnWaitlist ? (
                      <EnhancedButton
                        onClick={() => handleLeaveWaitlist(course.id)}
                        onMouseEnter={() => setHoveredWaitlistCourseId(course.id)}
                        onMouseLeave={() => setHoveredWaitlistCourseId(null)}
                        disabled={leavingWaitlistId === course.id}
                        className="w-full text-sm py-2 border-forge-orange text-forge-orange hover:bg-forge-orange/5 hover:border-forge-orange bg-white"
                        variant="outline"
                        size="sm"
                      >
                        {leavingWaitlistId === course.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            {t('courses.leaving')}
                          </>
                        ) : hoveredWaitlistCourseId === course.id ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            {t('courses.leave')}
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            {t('courses.onWaitlist')}
                          </>
                        )}
                      </EnhancedButton>
                    ) : (
                      <EnhancedButton
                        onClick={() => handleJoinWaitlist(course.id)}
                        disabled={joiningWaitlistId === course.id}
                        className="w-full text-sm py-2 border-forge-orange text-forge-orange hover:bg-forge-orange/5 hover:border-forge-orange bg-white"
                        variant="outline"
                        size="sm"
                      >
                        {joiningWaitlistId === course.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            {t('courses.joining')}
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            {t('courses.notifyMe')}
                          </>
                        )}
                      </EnhancedButton>
                    )
                  ) : (
                    <EnhancedButton 
                      className="w-full text-sm py-2" 
                      size="sm" 
                      withGradient
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(DASHBOARD_LEARN_COURSE(course.id));
                      }}
                    >
                      {t('courses.startCourse')}
                    </EnhancedButton>
                  )}

                </CardContent>
              </Card>
            );

            if (!isAvailable) {
              return <div key={course.id} className="h-full">{card}</div>;
            }

            // For available courses, wrap in Link to make card clickable
            return (
              <Link
                key={course.id}
                to={DASHBOARD_LEARN_COURSE(course.id)}
                className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {card}
              </Link>
            );
          })}
        </HoverEffectGrid>
      )}
    </div>
  );
}
