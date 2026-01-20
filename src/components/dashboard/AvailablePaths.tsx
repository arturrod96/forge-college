import { useState, useMemo } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { toast } from 'sonner';
import { BookMarked, Check, CheckCircle, CirclePlay, Clock, Flame, Bell, X, Layers3 } from 'lucide-react';
import EnhancedButton from '@/components/ui/enhanced-button';
import { DASHBOARD_LEARN_PATH } from '@/routes/paths';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { ContentSearch, FilterPopover, type StatusFilterValue, type SortOption, type ProgressFilterValue } from '@/components/filters';
import { pickPublishedLocalization, DEFAULT_LOCALE } from '@/lib/localization';
import { cn } from '@/lib/utils';
import type { Tables } from '@/types/supabase';
import { HoverEffectGrid } from '@/components/ui/card-hover-effect';

type LearningPathLocalization = Tables<'learning_path_localizations'>;

interface LearningPath {
  id: string;
  title: string;
  description: string;
  isEnrolled?: boolean;
  isOnWaitlist?: boolean;
  courseCount?: number;
  status?: 'draft' | 'published' | 'coming_soon';
  progressStatus?: 'not_started' | 'in_progress' | 'completed';
  courses?: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}

type LearningPathRow = Tables<'learning_paths'> & {
  courses: Array<{ id: string; title: string; order: number }> | null;
  learning_path_localizations: LearningPathLocalization[] | null;
};

type AvailablePathsProps = {
  limit?: number;
  className?: string;
};

export function AvailablePaths({ limit, className }: AvailablePathsProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [joiningWaitlistId, setJoiningWaitlistId] = useState<string | null>(null);
  const [leavingWaitlistId, setLeavingWaitlistId] = useState<string | null>(null);
  const [hoveredWaitlistPathId, setHoveredWaitlistPathId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const resolvedLocale = i18n.language || DEFAULT_LOCALE;

  const { data: paths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['availablePaths', user?.id, resolvedLocale],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    queryFn: async (): Promise<LearningPath[]> => {
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(
          `
            id,
            title,
            description,
            status,
            courses(id, title, order),
            learning_path_localizations(*)
          `
        )
        .in('status', ['published', 'coming_soon']);
      if (pathsError) throw pathsError;

      let enrolledPaths: string[] = [];
      let waitlistedPaths: string[] = [];
      const pathProgressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};

      if (user) {
        // Get enrolled paths
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('user_enrollments')
          .select('learning_path_id')
          .eq('user_id', user.id)
          .eq('is_active', true);
        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
        } else {
          enrolledPaths = (enrollments || []).map((e: any) => e.learning_path_id);

          // Calculate progress for enrolled paths
          if (enrolledPaths.length > 0) {
            const progressPromises = enrolledPaths.map(async (pathId) => {
              try {
                const { data: progress, error: progressError } = await supabase.rpc('get_path_progress', {
                  path_id: pathId,
                  user_id: user.id,
                });
                if (!progressError && progress !== null && progress !== undefined) {
                  const progressPercent = progress as number;
                  if (progressPercent === 0) {
                    pathProgressMap[pathId] = 'not_started';
                  } else if (progressPercent === 100) {
                    pathProgressMap[pathId] = 'completed';
                  } else {
                    pathProgressMap[pathId] = 'in_progress';
                  }
                } else {
                  pathProgressMap[pathId] = 'not_started';
                }
              } catch (err) {
                pathProgressMap[pathId] = 'not_started';
              }
            });
            await Promise.all(progressPromises);
          }
        }

        // Get waitlisted paths - try RPC function first, then fallback to direct query
        try {
          const { data: waitlistData, error: waitlistError } = await supabase.rpc('get_user_waitlisted_paths');

          if (!waitlistError && waitlistData) {
            // Successfully got data from RPC
            waitlistedPaths = waitlistData.map((e: any) => e.learning_path_id);
          } else {
            // RPC failed, try direct query
            if (waitlistError && waitlistError.code !== '42883') {
              console.warn('RPC function failed, trying direct query:', waitlistError);
            }
            const { data: waitlistEntries, error: fallbackError } = await supabase
              .from('waiting_list')
              .select('learning_path_id')
              .eq('user_id', user.id)
              .not('learning_path_id', 'is', null);

            if (fallbackError) {
              console.error('Error fetching waitlist entries (fallback):', fallbackError);
              // If both fail, waitlistedPaths remains empty array
            } else if (waitlistEntries) {
              waitlistedPaths = waitlistEntries.map((e: any) => e.learning_path_id);
            }
          }
        } catch (err) {
          // On exception, try direct query as last resort
          try {
            const { data: waitlistEntries, error: fallbackError } = await supabase
              .from('waiting_list')
              .select('learning_path_id')
              .eq('user_id', user.id)
              .not('learning_path_id', 'is', null);
            if (!fallbackError && waitlistEntries) {
              waitlistedPaths = waitlistEntries.map((e: any) => e.learning_path_id);
            }
          } catch (finalErr) {
            // Silently fail - waitlistedPaths will remain empty
          }
        }
      }

      return ((pathsData as LearningPathRow[] | null | undefined) ?? []).map((path) => {
        // Get localized title and description
        const localization = pickPublishedLocalization(
          path.learning_path_localizations ?? [],
          resolvedLocale,
          DEFAULT_LOCALE
        );

        // Process courses
        const courses = (path.courses || [])
          .map((c: any) => ({
            id: c.id,
            title: c.title,
            order: c.order ?? 0,
          }))
          .filter((c: any) => c.id && c.title)
          .sort((a: any, b: any) => a.order - b.order);

        return {
          id: path.id,
          title: localization?.title ?? path.title,
          description: localization?.description ?? path.description ?? '',
          status: path.status,
          isEnrolled: enrolledPaths.includes(path.id),
          isOnWaitlist: waitlistedPaths.includes(path.id),
          courseCount: courses.length,
          courses,
          progressStatus: pathProgressMap[path.id] || (enrolledPaths.includes(path.id) ? 'not_started' : 'not_started'),
        } satisfies LearningPath;
      });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user) throw new Error(t('dashboard.errors.notAuthenticated'));
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw new Error(error.message || t('dashboard.errors.failedToEnroll'));
      return pathId;
    },
    onMutate: (pathId) => {
      setEnrollingId(pathId);
    },
    onSuccess: () => {
      toast.success(t('dashboard.enrollSuccess'));
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] });
      queryClient.invalidateQueries({ queryKey: ['myPaths'] });
    },
    onError: (error) => {
      console.error('Error enrolling:', error);
      toast.error(t('dashboard.enrollError'));
    },
    onSettled: () => setEnrollingId(null),
  });

  const handleEnroll = async (pathId: string) => {
    if (!user) {
      toast.error(t('dashboard.mustLoginToEnroll'));
      return;
    }
    enrollMutation.mutate(pathId);
  };

  const joinWaitlistMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user || !user.id) {
        throw new Error('Must be logged in to join waiting list');
      }

      // Check if already on waitlist first
      const { data: existingEntry } = await supabase
        .from('waiting_list')
        .select('id, created_at')
        .eq('user_id', user.id)
        .eq('learning_path_id', pathId)
        .maybeSingle();

      if (existingEntry) {
        // User is already on waitlist
        return { pathId, alreadyOnList: true };
      }

      // Try using RPC function first (bypasses RLS issues)
      let entryId: string | null = null;
      let rpcError: any = null;

      try {
        const { data, error } = await supabase.rpc('add_to_waiting_list', {
          p_learning_path_id: pathId,
          p_formation_id: null,
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
        // RPC function not available, fall back to direct insert

        // Fallback: Direct insert (may fail if RLS policies aren't fixed)
        const { data: insertData, error: insertError } = await supabase
          .from('waiting_list')
          .insert({
            user_id: user.id,
            learning_path_id: pathId,
            email: user.email || ''
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting into waiting_list:', insertError);
          if (insertError.code === '23505') {
            // Duplicate key - user is already on waitlist
            return { pathId, alreadyOnList: true };
          }
          throw new Error(insertError.message || 'Failed to join waiting list');
        }

        if (insertData) {
          return { pathId, alreadyOnList: false };
        }
      } else if (rpcError) {
        // RPC function exists but returned an error
        console.error('Error adding to waiting list via RPC:', rpcError);

        // If error mentions already exists or unique violation, user is already on list
        if (rpcError.message?.includes('already') || rpcError.message?.includes('unique') || rpcError.code === '23505') {
          return { pathId, alreadyOnList: true };
        }

        throw new Error(rpcError.message || 'Failed to join waiting list');
      }

      // If we got an entry ID from RPC, it was successfully added
      if (entryId) {
        return { pathId, alreadyOnList: false };
      }

      return { pathId, alreadyOnList: false };
    },
    onMutate: async (pathId) => {
      setJoiningWaitlistId(pathId);

      // Optimistic update: immediately update the UI
      await queryClient.cancelQueries({ queryKey: ['availablePaths', user?.id] });

      const previousPaths = queryClient.getQueryData<LearningPath[]>(['availablePaths', user?.id]);

      if (previousPaths) {
        queryClient.setQueryData<LearningPath[]>(['availablePaths', user?.id], (old) => {
          if (!old) return old;
          return old.map((path) =>
            path.id === pathId ? { ...path, isOnWaitlist: true } : path
          );
        });
      }

      return { previousPaths };
    },
    onSuccess: (result, pathId, context) => {
      if (result.alreadyOnList) {
        toast.info('You are already on the waiting list for this path!');
      } else {
        toast.success('You have been added to the waiting list! You will receive an email when this path becomes available.');
      }
      // Invalidate and refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['availablePaths', user?.id] });
    },
    onError: (error, pathId, context) => {
      console.error('Error joining waiting list:', error);
      const message = error instanceof Error ? error.message : 'Failed to join waiting list';

      // Rollback optimistic update on error
      if (context?.previousPaths) {
        queryClient.setQueryData(['availablePaths', user?.id], context.previousPaths);
      }

      if (message.includes('already on') || message.includes('already')) {
        toast.info('You are already on the waiting list for this path!');
        queryClient.invalidateQueries({ queryKey: ['availablePaths', user?.id] });
        queryClient.refetchQueries({ queryKey: ['availablePaths', user?.id] });
      } else {
        toast.error(message);
      }
    },
    onSettled: () => setJoiningWaitlistId(null),
  });

  const handleJoinWaitlist = async (pathId: string) => {
    if (!user) {
      toast.error('You must be logged in to join the waiting list');
      return;
    }
    joinWaitlistMutation.mutate(pathId);
  };

  const leaveWaitlistMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user || !user.id) {
        throw new Error('Must be logged in to leave waiting list');
      }

      const { error } = await supabase
        .from('waiting_list')
        .delete()
        .eq('user_id', user.id)
        .eq('learning_path_id', pathId);

      if (error) {
        throw new Error(error.message || 'Failed to leave waiting list');
      }

      return pathId;
    },
    onMutate: async (pathId) => {
      setLeavingWaitlistId(pathId);

      // Optimistic update: immediately update the UI
      await queryClient.cancelQueries({ queryKey: ['availablePaths', user?.id] });

      const previousPaths = queryClient.getQueryData<LearningPath[]>(['availablePaths', user?.id]);

      if (previousPaths) {
        queryClient.setQueryData<LearningPath[]>(['availablePaths', user?.id], (old) => {
          if (!old) return old;
          return old.map((path) =>
            path.id === pathId ? { ...path, isOnWaitlist: false } : path
          );
        });
      }

      return { previousPaths };
    },
    onSuccess: () => {
      toast.success('You have been removed from the waiting list.');
      // Invalidate to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['availablePaths', user?.id] });
    },
    onError: (error, pathId, context) => {
      console.error('Error leaving waiting list:', error);
      const message = error instanceof Error ? error.message : 'Failed to leave waiting list';
      toast.error(message);

      // Rollback optimistic update on error
      if (context?.previousPaths) {
        queryClient.setQueryData(['availablePaths', user?.id], context.previousPaths);
      }
    },
    onSettled: () => setLeavingWaitlistId(null),
  });

  const handleLeaveWaitlist = async (pathId: string) => {
    if (!user) {
      toast.error('You must be logged in to leave the waiting list');
      return;
    }
    leaveWaitlistMutation.mutate(pathId);
  };

  // Filter and sort paths
  const processedPaths = useMemo(() => {
    let result = [...paths];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((path) => {
        if (statusFilter === 'available') {
          return path.status === 'published';
        }
        if (statusFilter === 'coming_soon') {
          return path.status === 'coming_soon';
        }
        return true;
      });
    }

    // Filter by progress
    if (progressFilter.length > 0) {
      result = result.filter((path) => {
        return progressFilter.includes(path.progressStatus || 'not_started');
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (path) =>
          path.title.toLowerCase().includes(term) ||
          (path.description && path.description.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Helper function to get priority: Enrolled > Available/Not Started > Completed > Coming Soon
      const getPriority = (path: LearningPath) => {
        if (path.status === 'coming_soon') return 3;
        if (path.isEnrolled || path.progressStatus === 'in_progress') return 0;
        if (path.progressStatus === 'not_started') return 1;
        if (path.progressStatus === 'completed') return 2;
        return 4; // fallback
      };

      switch (sortOption) {
        case 'recent':
          // For paths, we don't have created_at, so use priority first, then title
          const recentPriorityDiff = getPriority(a) - getPriority(b);
          if (recentPriorityDiff !== 0) return recentPriorityDiff;
          return a.title.localeCompare(b.title);
        case 'alphabetical':
          const alphaPriorityDiff = getPriority(a) - getPriority(b);
          if (alphaPriorityDiff !== 0) return alphaPriorityDiff;
          return a.title.localeCompare(b.title);
        case 'path_order':
        default:
          // Default order: Enrolled (isEnrolled or in_progress) > Available/Not Started (not_started) > Completed (completed) > Coming Soon (coming_soon)
          const priorityDiff = getPriority(a) - getPriority(b);
          if (priorityDiff !== 0) return priorityDiff;
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [paths, statusFilter, progressFilter, searchTerm, sortOption]);

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

  const visiblePaths = typeof limit === 'number' && limit > 0 ? processedPaths.slice(0, limit) : processedPaths;

  return (
    <div className={className}>
      {/* Simplified filter bar */}
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
          <ContentSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('search.learningPaths')}
            className="w-full max-w-xs"
          />
        </div>
      </div>

      {visiblePaths.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all'
              ? t('learningPaths.emptyNoMatch')
              : t('learningPaths.emptyNoData')}
          </p>
        </div>
      )}

      {visiblePaths.length > 0 && (
        <HoverEffectGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
          {visiblePaths.map((path) => {
            const isComingSoon = path.status === 'coming_soon';
            const courseCount = path.courseCount || path.courses?.length || 0;
            const courses = path.courses ?? [];

            return (
              <Card
                key={path.id}
                className={cn(
                  'relative overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[480px] flex flex-col group',
                  isComingSoon && 'opacity-70 cursor-not-allowed'
                )}
              >
                {/* Thumbnail - same pattern as FormationsList */}
                <div
                  className="h-48 flex items-center justify-center relative"
                  style={{ backgroundColor: isComingSoon ? '#4a5a4a' : '#303b2e' }}
                >
                  <Layers3 className="h-16 w-16 text-forge-orange" />

                  {/* Badges: Completed > Inscrito > Coming soon > Available */}
                  {path.progressStatus === 'completed' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                        {t('filters.progressOptions.completed')}
                      </Badge>
                    </div>
                  )}
                  {path.progressStatus !== 'completed' &&
                    (path.progressStatus === 'in_progress' || path.isEnrolled) && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                          {t('dashboard.enrolled')}
                        </Badge>
                      </div>
                    )}
                  {path.status === 'coming_soon' &&
                    path.progressStatus !== 'in_progress' &&
                    path.progressStatus !== 'completed' &&
                    !path.isEnrolled && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                          {t('filters.statusOptions.coming_soon')}
                        </Badge>
                      </div>
                    )}
                  {path.status === 'published' &&
                    path.progressStatus !== 'in_progress' &&
                    path.progressStatus !== 'completed' &&
                    !path.isEnrolled && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="default" size="sm" icon={CheckCircle} iconPosition="left">
                          {t('filters.statusOptions.available')}
                        </Badge>
                      </div>
                    )}
                </div>

                <CardHeader className="flex-1 min-h-0 flex flex-col">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {path.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookMarked className="h-4 w-4" />
                      {t('dashboard.availablePaths.courses', { count: courseCount })}
                    </div>
                  </div>

                  {/* Courses preview */}
                  {courses.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">
                        {t('dashboard.availablePaths.coursesLabel')}
                      </h4>
                      <div className="space-y-1">
                        {courses.slice(0, 3).map((course, index) => (
                          <div key={course.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-forge-orange font-medium">{index + 1}.</span>
                            <span className="truncate">{course.title}</span>
                          </div>
                        ))}
                        {courses.length > 3 && (
                          <div className="text-xs text-gray-500">
                            {t('dashboard.availablePaths.moreCourses', { count: courses.length - 3 })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {path.status === 'published' && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Link to={DASHBOARD_LEARN_PATH(path.id)} className="flex-1 min-w-0">
                        <EnhancedButton
                          variant="outline"
                          className="w-full !bg-white hover:!bg-gray-50 hover:!text-forge-orange"
                        >
                          {t('dashboard.availablePaths.viewPath')}
                        </EnhancedButton>
                      </Link>
                      {path.isEnrolled ? (
                        <Link to={DASHBOARD_LEARN_PATH(path.id)} className="flex-1 min-w-0">
                          <EnhancedButton className="w-full">
                            {t('common.buttons.continue')}
                          </EnhancedButton>
                        </Link>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <EnhancedButton
                            className="w-full"
                            onClick={() => handleEnroll(path.id)}
                            disabled={!user || enrollingId === path.id}
                          >
                            {enrollingId === path.id
                              ? t('dashboard.enrolling')
                              : t('dashboard.enroll')}
                          </EnhancedButton>
                        </div>
                      )}
                    </div>
                  )}
                  {isComingSoon && (
                    <div className="mt-4">
                      {path.isOnWaitlist ? (
                        <EnhancedButton
                          onClick={() => handleLeaveWaitlist(path.id)}
                          onMouseEnter={() => setHoveredWaitlistPathId(path.id)}
                          onMouseLeave={() => setHoveredWaitlistPathId(null)}
                          disabled={leavingWaitlistId === path.id}
                          className="w-full"
                          variant="outline"
                          size="sm"
                        >
                          {leavingWaitlistId === path.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                              {t('courses.leaving')}
                            </>
                          ) : hoveredWaitlistPathId === path.id ? (
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
                          onClick={() => handleJoinWaitlist(path.id)}
                          disabled={joiningWaitlistId === path.id}
                          className="w-full"
                          variant="outline"
                          size="sm"
                        >
                          {joiningWaitlistId === path.id ? (
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
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </HoverEffectGrid>
      )}
    </div>
  );
}
