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

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courseCount?: number;
  waitingListCount?: number;
}

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
          courses!inner(id)
        `)
        .eq('status', 'coming_soon');
      if (pathsError) throw pathsError;

      // Get waiting list counts for each path
      const pathIds = (pathsData || []).map((path: any) => path.id);
      let waitingListCounts: Record<string, number> = {};
      
      if (pathIds.length > 0) {
        const { data: waitingListData, error: waitingListError } = await supabase
          .from('waiting_list')
          .select('learning_path_id')
          .in('learning_path_id', pathIds);
        
        if (!waitingListError && waitingListData) {
          waitingListCounts = waitingListData.reduce((acc: Record<string, number>, item: any) => {
            acc[item.learning_path_id] = (acc[item.learning_path_id] || 0) + 1;
            return acc;
          }, {});
        }
      }

      return (pathsData || []).map((path: any) => ({
        id: path.id,
        title: path.title,
        description: path.description,
        courseCount: path.courses.length,
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
      if (error) throw new Error(error.message || 'Failed to join waiting list');
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
      toast.error(error.message || 'Failed to join waiting list');
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayPaths.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No coming soon paths</h3>
        <p className="text-gray-500">Check back later for new learning paths!</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {displayPaths.map((path) => (
        <Card key={path.id} className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {path.title}
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
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
              className="w-full"
              variant="outline"
            >
              {joiningId === path.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Join Waiting List
                </>
              )}
            </EnhancedButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
