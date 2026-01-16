import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Star, CircleCheckBig, Clock, CirclePlay, Flame } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import * as R from '@/routes/paths';
import type { Tables } from '@/types/supabase';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useOAuth';
import { useState, useMemo } from 'react';
import { ContentSearch, StatusFilter, SortSelector, ProgressFilter, type StatusFilterValue, type SortOption, type ProgressFilterValue } from '@/components/filters';

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
  const { user } = useAuth();
  const supabase = createClientBrowser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  // const queryClient = useQueryClient();
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

      // Calculate progress for formations if user is logged in
      const formationProgressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      
      if (user && rows.length > 0) {
        // Get all path IDs from all formations
        const allPathIds: string[] = [];
        rows.forEach((formation) => {
          const paths = (formation.formation_paths ?? [])
            .map((fp) => fp.learning_paths?.id)
            .filter((id): id is string => Boolean(id));
          allPathIds.push(...paths);
        });

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
      switch (sortOption) {
        case 'recent':
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bDate - aDate;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [formations, statusFilter, progressFilter, searchTerm, sortOption]);

  const displayFormations = limit ? processedFormations.slice(0, limit) : processedFormations;

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
          title="No formations found"
          description={searchTerm ? `No formations match "${searchTerm}"` : 'No formations match the selected filters'}
          size="md"
        />
      );
    }
    return (
      <EmptyState
        variant="no-data"
        icon={GraduationCap}
        title="No formations available"
        description="Comprehensive learning programs will be available soon. Check back later!"
        size="md"
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <ContentSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search formations..."
          />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <ProgressFilter selected={progressFilter} onChange={setProgressFilter} />
          <SortSelector
            value={sortOption}
            onChange={setSortOption}
            options={['recent', 'alphabetical']}
          />
        </div>
      </div>

      <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
        {displayFormations.map((formation) => {
          const createdAtDistance = formation.created_at
            ? formatDistanceToNow(new Date(formation.created_at))
            : null;

          return (
          <Card key={formation.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail or placeholder */}
            <div className="h-48 flex items-center justify-center relative" style={{ backgroundColor: '#303b2e' }}>
              {formation.thumbnail_url ? (
                <img 
                  src={formation.thumbnail_url} 
                  alt={formation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap className="h-16 w-16 text-forge-orange" />
              )}
              
              {/* Badges sobre a thumbnail */}
              {formation.progressStatus === 'in_progress' && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                    Enrolled
                  </Badge>
                </div>
              )}
              {formation.progressStatus === 'completed' && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                    Completed
                  </Badge>
                </div>
              )}
              {formation.status === 'coming_soon' && formation.progressStatus !== 'in_progress' && formation.progressStatus !== 'completed' && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                    Coming Soon
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
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
                  <BookOpen className="h-4 w-4" />
                  {formation.paths_count} paths
                </div>
              </div>

              {/* Learning paths preview */}
              {formation.paths && formation.paths.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">Learning Paths:</h4>
                  <div className="space-y-1">
                    {formation.paths.slice(0, 3).map((path, index) => (
                      <div key={path.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-blue-500 font-medium">{index + 1}.</span>
                        <span className="truncate">{path.title}</span>
                      </div>
                    ))}
                    {formation.paths.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{formation.paths.length - 3} more paths
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action button */}
              {formation.status === 'published' && (
                <Link to={R.DASHBOARD_FORMATION_DETAIL(formation.id)} className="mt-4 block">
                  <EnhancedButton className="w-full">
                    View Formation
                  </EnhancedButton>
                </Link>
              )}
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Waitlist Dialog - Commented out */}
      {/* <Dialog open={waitlistDialogOpen} onOpenChange={setWaitlistDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join Waitlist - {selectedFormation?.title}</DialogTitle>
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
                  {waitlistMutation.isPending ? 'Joining...' : 'Join Waitlist'}
                </EnhancedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
