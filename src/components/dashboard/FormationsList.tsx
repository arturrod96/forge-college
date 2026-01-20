import { useTranslation } from 'react-i18next';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap, Layers3, Star, CircleCheckBig, Clock, CirclePlay, Flame, CheckCircle } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import * as R from '@/routes/paths';
import type { Tables } from '@/types/supabase';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useOAuth';
import { useState, useMemo } from 'react';
import { ContentSearch, FilterPopover, type StatusFilterValue, type SortOption, type ProgressFilterValue } from '@/components/filters';
import { HoverEffectGrid } from '@/components/ui/card-hover-effect';
import { toast } from 'sonner';

type FormationRow = Tables<'formations'>['Row'];
type FormationPathRow = Tables<'formation_paths'>['Row'];
type LearningPathSummary = Pick<Tables<'learning_paths'>['Row'], 'id' | 'title'>;

type FormationQueryRow = FormationRow & {
  formation_paths?: Array<
    Pick<FormationPathRow, 'order'> & {
      learning_paths: LearningPathSummary | null
    }
  > | null
};

interface FormationCardModel {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  status: Tables<'formations'>['Row']['status'];
  paths_count: number;
  paths: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  created_at: string | null;
  progressStatus?: 'not_started' | 'in_progress' | 'completed';
  /** User is enrolled in the first path of this formation (trilha) */
  firstPathEnrolled?: boolean;
}

type FormationsListProps = {
  limit?: number;
  className?: string;
};

// TODO: Uncomment to re-enable waitlist functionality
// const waitlistFormSchema = z.object({
//   full_name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   interest: z.string().min(10, 'Interest must be at least 10 characters'),
// });

// type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

// async function sendWaitlistEmail(data: {
//   full_name: string;
//   email: string;
//   interest: string;
//   formation_title: string;
// }) {
//   const response = await fetch('/api/send-waitlist-email', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || 'Failed to send email');
//   }

//   return result;
// }

export function FormationsList({ limit, className }: FormationsListProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const supabase = createClientBrowser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [enrollingPathId, setEnrollingPathId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // const [selectedFormation, setSelectedFormation] = useState<FormationCardModel | null>(null);
  // const [waitlistDialogOpen, setWaitlistDialogOpen] = useState(false);

  // const form = useForm<WaitlistFormValues>({
  //   resolver: zodResolver(waitlistFormSchema),
  //   defaultValues: {
  //     full_name: user?.user_metadata?.full_name || '',
  //     email: user?.email || '',
  //     interest: '',
  //   },
  // });

  const { data: formations = [], isLoading } = useQuery<FormationCardModel[]>({
    queryKey: ['formations', user?.id],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<FormationCardModel[]> => {
      const { data, error } = await supabase
        .from('formations')
        .select(`
          id, title, description, thumbnail_url, created_at, status,
          formation_paths(
            order,
            learning_paths(id, title)
          )
        `)
        .in('status', ['published', 'coming_soon'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as FormationQueryRow[];

      // Calculate progress and enrollment for formations if user is logged in
      const formationProgressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      let enrolledPathIds: string[] = [];

      if (user && rows.length > 0) {
        // Get all path IDs from all formations
        const allPathIds: string[] = [];
        rows.forEach((formation) => {
          const pathIds = (formation.formation_paths ?? [])
            .map((fp) => fp.learning_paths?.id)
            .filter((id): id is string => Boolean(id));
          allPathIds.push(...pathIds);
        });

        // Fetch user enrollments for these paths
        if (allPathIds.length > 0) {
          const { data: enrollments } = await supabase
            .from('user_enrollments')
            .select('learning_path_id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .in('learning_path_id', allPathIds);
          enrolledPathIds = (enrollments || []).map((e: { learning_path_id?: string }) => e.learning_path_id).filter((id): id is string => Boolean(id));
        }

        // Calculate progress for all paths
        if (allPathIds.length > 0) {
          const progressPromises = allPathIds.map(async (pathId) => {
            try {
              const { data: progress, error: progressError } = await supabase.rpc('get_path_progress', {
                path_id: pathId,
                user_id: user.id,
              });
              if (!progressError && progress !== null && progress !== undefined) {
                const progressPercent = progress as number;
                if (progressPercent === 0) {
                  return { pathId, status: 'not_started' as const };
                } else if (progressPercent === 100) {
                  return { pathId, status: 'completed' as const };
                } else {
                  return { pathId, status: 'in_progress' as const };
                }
              }
              return { pathId, status: 'not_started' as const };
            } catch (err) {
              return { pathId, status: 'not_started' as const };
            }
          });
          const pathProgresses = await Promise.all(progressPromises);
          const pathProgressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
          pathProgresses.forEach(({ pathId, status }) => {
            pathProgressMap[pathId] = status;
          });

          // Calculate formation progress based on path progress
          rows.forEach((formation) => {
            const paths = (formation.formation_paths ?? [])
              .map((fp) => fp.learning_paths?.id)
              .filter((id): id is string => Boolean(id));
            
            if (paths.length === 0) {
              formationProgressMap[formation.id] = 'not_started';
              return;
            }

            const pathStatuses = paths.map(pathId => pathProgressMap[pathId] || 'not_started');
            const hasCompleted = pathStatuses.some(s => s === 'completed');
            const hasInProgress = pathStatuses.some(s => s === 'in_progress');
            const allCompleted = pathStatuses.every(s => s === 'completed');

            if (allCompleted) {
              formationProgressMap[formation.id] = 'completed';
            } else if (hasInProgress || hasCompleted) {
              formationProgressMap[formation.id] = 'in_progress';
            } else {
              formationProgressMap[formation.id] = 'not_started';
            }
          });
        }
      }

      return rows.map((formation) => {
        const paths = (formation.formation_paths ?? [])
          .map((fp) => {
            if (!fp.learning_paths) return null;
            return {
              id: fp.learning_paths.id,
              title: fp.learning_paths.title,
              order: fp.order ?? 0,
            };
          })
          .filter((path): path is { id: string; title: string; order: number } => Boolean(path))
          .sort((a, b) => a.order - b.order);

        return {
          id: formation.id,
          title: formation.title,
          description: formation.description,
          thumbnail_url: formation.thumbnail_url,
          status: formation.status,
          paths_count: paths.length,
          paths,
          created_at: formation.created_at,
          progressStatus: formationProgressMap[formation.id] || 'not_started',
          firstPathEnrolled: paths.length > 0 && enrolledPathIds.includes(paths[0].id),
        } as FormationCardModel;
      });
    },
  });

  // const waitlistMutation = useMutation({
  //   mutationFn: async (values: WaitlistFormValues) => {
  //     if (!selectedFormation) throw new Error('No formation selected');

  //     await sendWaitlistEmail({
  //       ...values,
  //       formation_title: selectedFormation.title,
  //     });

  //     return values;
  //   },
  //   onSuccess: () => {
  //     toast.success('Thank you! We have received your interest and sent a confirmation email.');
  //     setWaitlistDialogOpen(false);
  //     form.reset();
  //     setSelectedFormation(null);
  //     queryClient.invalidateQueries({ queryKey: ['formations'] });
  //   },
  //   onError: (error) => {
  //     console.error('Error joining waitlist:', error);
  //     const message = error instanceof Error ? error.message : 'Failed to join waitlist';
  //     toast.error(message);
  //   },
  // });

  // const handleJoinWaitlist = (formation: FormationCardModel) => {
  //   if (!user) {
  //     toast.error('You must be logged in to join the waitlist');
  //     return;
  //   }
  //   setSelectedFormation(formation);
  //   form.reset({
  //     full_name: user?.user_metadata?.full_name || '',
  //     email: user?.email || '',
  //     interest: '',
  //   });
  //   setWaitlistDialogOpen(true);
  // };

  // const onWaitlistSubmit = (values: WaitlistFormValues) => {
  //   waitlistMutation.mutate(values);
  // };

  // Filter and sort formations
  const processedFormations = useMemo(() => {
    let result = [...formations];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((formation) => {
        if (statusFilter === 'available') {
          return formation.status === 'published';
        }
        if (statusFilter === 'coming_soon') {
          return formation.status === 'coming_soon';
        }
        return true;
      });
    }

    // Filter by progress
    if (progressFilter.length > 0) {
      result = result.filter((formation) => {
        return progressFilter.includes(formation.progressStatus || 'not_started');
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (formation) =>
          formation.title.toLowerCase().includes(term) ||
          (formation.description && formation.description.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Helper function to get priority: Enrolled > Available/Not Started > Completed > Coming Soon
      const getPriority = (formation: FormationCardModel) => {
        if (formation.status === 'coming_soon') return 3;
        if (formation.progressStatus === 'in_progress') return 0;
        if (formation.progressStatus === 'not_started') return 1;
        if (formation.progressStatus === 'completed') return 2;
        return 4; // fallback
      };

      switch (sortOption) {
        case 'recent':
          const recentPriorityDiff = getPriority(a) - getPriority(b);
          if (recentPriorityDiff !== 0) return recentPriorityDiff;
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bDate - aDate;
        case 'alphabetical':
          const alphaPriorityDiff = getPriority(a) - getPriority(b);
          if (alphaPriorityDiff !== 0) return alphaPriorityDiff;
          return a.title.localeCompare(b.title);
        default:
          // Default order: Enrolled (in_progress) > Available/Not Started (not_started) > Completed (completed) > Coming Soon (coming_soon)
          const priorityDiff = getPriority(a) - getPriority(b);
          if (priorityDiff !== 0) return priorityDiff;
          const defaultADate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const defaultBDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return defaultBDate - defaultADate; // Most recent first within same priority
      }
    });

    return result;
  }, [formations, statusFilter, progressFilter, searchTerm, sortOption]);

  const displayFormations = limit ? processedFormations.slice(0, limit) : processedFormations;

  const enrollMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user) throw new Error(t('dashboard.mustLoginToEnroll'));
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw new Error(error.message || t('dashboard.errors.failedToEnroll'));
      return pathId;
    },
    onMutate: (pathId) => setEnrollingPathId(pathId),
    onSuccess: () => {
      toast.success(t('dashboard.enrollSuccess'));
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] });
      queryClient.invalidateQueries({ queryKey: ['myPaths'] });
      queryClient.invalidateQueries({ queryKey: ['pathOverview'] });
      queryClient.invalidateQueries({ queryKey: ['formation-detail'] });
    },
    onError: (err) => {
      console.error('Enroll error:', err);
      toast.error(t('dashboard.enrollError'));
    },
    onSettled: () => setEnrollingPathId(null),
  });

  const handleEnroll = (pathId: string) => {
    if (!user) {
      toast.error(t('dashboard.mustLoginToEnroll'));
      return;
    }
    enrollMutation.mutate(pathId);
  };

  if (isLoading) {
    return (
      <LoadingGrid
        count={limit || 3}
        columns={{ sm: 1, md: 2, lg: 3 }}
        aspectRatio="portrait"
        showContent={true}
      />
    );
  }

  if (displayFormations.length === 0 && !isLoading) {
    if (searchTerm || statusFilter !== 'all') {
      return (
        <EmptyState
          variant="no-results"
          icon={GraduationCap}
          title={t('formations.emptyNoResults')}
          description={searchTerm ? t('formations.emptyNoMatch', { term: searchTerm }) : t('formations.emptyNoFilters')}
          size="md"
        />
      );
    }
    return (
      <EmptyState
        variant="no-data"
        icon={GraduationCap}
        title={t('formations.emptyNoData')}
        description={t('formations.emptyNoDataDescription')}
        size="md"
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <FilterPopover
            statusValue={statusFilter}
            onStatusChange={setStatusFilter}
            progressSelected={progressFilter}
            onProgressChange={setProgressFilter}
            sortValue={sortOption}
            onSortChange={setSortOption}
            sortOptions={['recent', 'alphabetical']}
          />
          <ContentSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('search.formations')}
            className="w-full max-w-xs"
          />
        </div>
      </div>

      <HoverEffectGrid className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch', className)}>
        {displayFormations.map((formation) => {
          const createdAtDistance = formation.created_at
            ? formatDistanceToNow(new Date(formation.created_at))
            : null;

          const isComingSoon = formation.status === 'coming_soon' && formation.progressStatus !== 'in_progress' && formation.progressStatus !== 'completed';

          return (
            <Card
              key={formation.id}
              className={cn(
              "relative overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[480px] flex flex-col group",
              isComingSoon && "opacity-70 cursor-not-allowed"
            )}>
              {/* Thumbnail or placeholder */}
              <div className="h-48 flex items-center justify-center relative" style={{ backgroundColor: isComingSoon ? '#4a5a4a' : '#303b2e' }}>
                {formation.thumbnail_url ? (
                  <img 
                    src={formation.thumbnail_url} 
                    alt={formation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className="h-16 w-16 text-forge-orange" />
                )}
                
                {/* Badges sobre a thumbnail: Completed > Inscrito (enrolled) > Coming soon > Disponível */}
                {formation.progressStatus === 'completed' && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                      {t('filters.progressOptions.completed')}
                    </Badge>
                  </div>
                )}
                {formation.progressStatus !== 'completed' && (formation.progressStatus === 'in_progress' || formation.firstPathEnrolled) && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                      {t('dashboard.enrolled')}
                    </Badge>
                  </div>
                )}
                {formation.status === 'coming_soon' && formation.progressStatus !== 'in_progress' && formation.progressStatus !== 'completed' && !formation.firstPathEnrolled && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                      {t('filters.statusOptions.coming_soon')}
                    </Badge>
                  </div>
                )}
                {formation.status === 'published' && formation.progressStatus !== 'in_progress' && formation.progressStatus !== 'completed' && !formation.firstPathEnrolled && (
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
                    {formation.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Layers3 className="h-4 w-4" />
                    {t('formations.paths', { count: formation.paths_count })}
                  </div>
                </div>

                {/* Learning paths preview */}
                {formation.paths && formation.paths.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">{t('formations.learningPathsLabel')}</h4>
                    <div className="space-y-1">
                      {formation.paths.slice(0, 3).map((path, index) => (
                        <div key={path.id} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-forge-orange font-medium">{index + 1}.</span>
                          <span className="truncate">{path.title}</span>
                        </div>
                      ))}
                      {formation.paths.length > 3 && (
                        <div className="text-xs text-gray-500">
                          {t('formations.morePaths', { count: formation.paths.length - 3 })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {formation.status === 'published' && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Link to={R.DASHBOARD_FORMATION_DETAIL(formation.id)} className="flex-1 min-w-0">
                      <EnhancedButton variant="outline" className="w-full !bg-white hover:!bg-gray-50 hover:!text-forge-orange">
                        {t('formations.viewFormation')}
                      </EnhancedButton>
                    </Link>
                    {formation.paths && formation.paths.length > 0 && (
                      formation.firstPathEnrolled ? (
                        <Link to={R.DASHBOARD_LEARN_PATH(formation.paths[0].id)} className="flex-1 min-w-0">
                          <EnhancedButton className="w-full">
                            {t('common.buttons.continue')}
                          </EnhancedButton>
                        </Link>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <EnhancedButton
                            className="w-full"
                            onClick={() => handleEnroll(formation.paths[0].id)}
                            disabled={!user || enrollingPathId === formation.paths[0].id}
                          >
                            {enrollingPathId === formation.paths[0].id ? t('dashboard.enrolling') : t('dashboard.enroll')}
                          </EnhancedButton>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </HoverEffectGrid>

      {/* Waitlist Dialog - Commented out */}
      {/* <Dialog open={waitlistDialogOpen} onOpenChange={setWaitlistDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notify Me - {selectedFormation?.title}</DialogTitle>
            <DialogDescription>
              Tell us about your interest in this formation. We'll notify you when it launches!
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onWaitlistSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why are you interested?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you're interested in this formation..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us understand your goals and tailor the program.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <EnhancedButton
                  type="button"
                  variant="outline"
                  onClick={() => setWaitlistDialogOpen(false)}
                  disabled={waitlistMutation.isPending}
                >
                  Cancel
                </EnhancedButton>
                <EnhancedButton
                  type="submit"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? 'Joining...' : 'Notify Me'}
                </EnhancedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
