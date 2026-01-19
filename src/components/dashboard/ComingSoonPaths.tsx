import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useOAuth';
import { toast } from 'sonner';
import { Clock, Users, Bell, BookOpen } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courseCount?: number;
  waitingListCount?: number;
}

type ComingSoonPathRow = {
  id: string;
  title: string;
  description: string | null;
  courses: { id: string }[] | null;
};

type ComingSoonPathsProps = {
  limit?: number;
  className?: string;
};

export function ComingSoonPaths({ limit, className }: ComingSoonPathsProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const { data: paths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['comingSoonPaths', user?.id],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<LearningPath[]> => {
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          id, title, description,
          courses(id)
        `)
        .eq('status', 'coming_soon');
      if (pathsError) throw pathsError;

      // Get waiting list counts for each path
      const rows = (pathsData ?? []) as ComingSoonPathRow[];
      const pathIds = rows.map((path) => path.id);
      let waitingListCounts: Record<string, number> = {};

      if (pathIds.length > 0) {
        const results = await Promise.all(
          pathIds.map(async (id: string) => {
            const { data: count, error: countError } = await supabase.rpc('get_waiting_list_count', {
              p_learning_path_id: id,
            });
            if (countError) {
              console.error('Error fetching waitlist count', countError);
              return { id, count: 0 };
            }
            return { id, count: count ?? 0 };
          })
        );

        waitingListCounts = results.reduce<Record<string, number>>((acc, { id, count }) => {
          acc[id] = count;
          return acc;
        }, {});
      }

      return rows.map((path) => ({
        id: path.id,
        title: path.title,
        description: path.description ?? '',
        courseCount: Array.isArray(path.courses) ? path.courses.length : 0,
        waitingListCount: waitingListCounts[path.id] || 0,
      }));
    },
  });

  const joinWaitingListMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user) throw new Error('Must be logged in to join waiting list');
      
      const { error } = await supabase
        .from('waiting_list')
        .insert({ 
          user_id: user.id, 
          learning_path_id: pathId,
          email: user.email || ''
        });
      if (error) {
        if (error.code === '23505') {
          throw new Error('You are already on this waiting list');
        }
        throw new Error(error.message || 'Failed to join waiting list');
      }
      return pathId;
    },
    onMutate: (pathId) => {
      setJoiningId(pathId);
    },
    onSuccess: () => {
      toast.success('You have been added to the waiting list!');
      queryClient.invalidateQueries({ queryKey: ['comingSoonPaths'] });
    },
    onError: (error) => {
      console.error('Error joining waiting list:', error);
      const message = error instanceof Error ? error.message : 'Failed to join waiting list';
      toast.error(message);
    },
    onSettled: () => setJoiningId(null),
  });

  const handleJoinWaitingList = async (pathId: string) => {
    if (!user) {
      toast.error('You must be logged in to join the waiting list');
      return;
    }
    joinWaitingListMutation.mutate(pathId);
  };

  const displayPaths = limit ? paths.slice(0, limit) : paths;

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

  if (displayPaths.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        icon={Clock}
        title={t('dashboard.comingSoonPaths.empty.title')}
        description={t('dashboard.comingSoonPaths.empty.description')}
        size="md"
      />
    );
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {displayPaths.map((path) => (
        <Card key={path.id} className="bg-white">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {path.title}
                  <Badge
                    variant="coming-soon"
                    size="md"
                    icon={Clock}
                    iconPosition="left"
                  >
                    Coming Soon
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  {path.description || 'Get ready for an amazing learning journey!'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {path.courseCount} courses
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {path.waitingListCount} on waitlist
              </div>
            </div>
            
            <EnhancedButton
              onClick={() => handleJoinWaitingList(path.id)}
              disabled={joiningId === path.id}
              className="w-full text-xs"
              variant="outline"
              size="sm"
            >
              {joiningId === path.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </>
              )}
            </EnhancedButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
