import { useState, useMemo } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { toast } from 'sonner';
import { BookOpen, Users, Flame, Clock } from 'lucide-react';
import EnhancedButton from '@/components/ui/enhanced-button';
import { DASHBOARD_LEARN_PATH } from '@/routes/paths';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { ContentSearch, StatusFilter, SortSelector, type StatusFilterValue, type SortOption } from '@/components/filters';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  isEnrolled?: boolean;
  courseCount?: number;
  status?: 'draft' | 'published' | 'coming_soon';
}

type AvailablePathsProps = {
  limit?: number;
  className?: string;
};

export function AvailablePaths({ limit, className }: AvailablePathsProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const { data: paths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['availablePaths', user?.id],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    queryFn: async (): Promise<LearningPath[]> => {
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          id, title, description, status,
          courses(id)
        `)
        .in('status', ['published', 'coming_soon']);
      if (pathsError) throw pathsError;

      let enrolledPaths: string[] = [];
      if (user) {
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('user_enrollments')
          .select('learning_path_id')
          .eq('user_id', user.id)
          .eq('is_active', true);
        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
        } else {
          enrolledPaths = (enrollments || []).map((e: any) => e.learning_path_id);
        }
      }

      return (pathsData || []).map((path: any) => ({
        id: path.id,
        title: path.title,
        description: path.description,
        status: path.status,
        isEnrolled: enrolledPaths.includes(path.id),
        courseCount: path.courses?.length || 0,
      }));
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
      switch (sortOption) {
        case 'recent':
          // For paths, we don't have created_at, so sort by title as fallback
          return 0;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'path_order':
          // Paths don't have an order field in this context, so use alphabetical
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [paths, statusFilter, searchTerm, sortOption]);

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
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <ContentSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search learning paths..."
          />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <SortSelector
            value={sortOption}
            onChange={setSortOption}
            options={['recent', 'alphabetical', 'path_order']}
          />
        </div>
      </div>

      {visiblePaths.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all'
              ? 'No learning paths match your filters'
              : 'No learning paths available'}
          </p>
        </div>
      )}

      {visiblePaths.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visiblePaths.map((path) => {
            const isComingSoon = path.status === 'coming_soon';
            return (
              <Card
                key={path.id}
                className={`relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[300px] flex flex-col ${path.isEnrolled ? 'ring-1 ring-forge-orange/20' : ''}`}
              >
                {path.isEnrolled && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="enrolled"
                      size="sm"
                      icon={Flame}
                      iconPosition="left"
                    >
                      {t('dashboard.availablePaths.enrolledBadge')}
                    </Badge>
                  </div>
                )}
                {isComingSoon && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="coming-soon"
                      size="sm"
                      icon={Clock}
                      iconPosition="left"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words">
                    <BookOpen className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                    <span>{path.title}</span>
                  </CardTitle>
                  <CardDescription className="text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]">
                    {path.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-forge-gray">
                    <Users className="h-3.5 w-3.5 text-forge-orange" />
                    {t('dashboard.availablePaths.courses', { count: path.courseCount || 0 })}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 mt-auto">
                  {path.isEnrolled ? (
                    <EnhancedButton className="w-full text-sm py-2" size="sm" withGradient asChild>
                      <Link to={DASHBOARD_LEARN_PATH(path.id)}>
                        {t('common.buttons.continueLearning')}
                      </Link>
                    </EnhancedButton>
                  ) : isComingSoon ? (
                    <EnhancedButton
                      className="w-full text-sm py-2"
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Coming Soon
                    </EnhancedButton>
                  ) : (
                    <>
                      <EnhancedButton
                        onClick={() => handleEnroll(path.id)}
                        disabled={enrollingId === path.id || !user}
                        className="w-full text-sm py-2"
                        variant="outline"
                        size="sm"
                      >
                        {enrollingId === path.id ? t('dashboard.enrolling') : t('dashboard.enroll')}
                      </EnhancedButton>
                      {user && (
                        <EnhancedButton variant="ghost" size="sm" className="w-full" asChild>
                          <Link to={DASHBOARD_LEARN_PATH(path.id)}>
                            {t('dashboard.viewDetails')}
                          </Link>
                        </EnhancedButton>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
