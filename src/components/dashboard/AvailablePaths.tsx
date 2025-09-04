import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { toast } from 'sonner';
import { BookOpen, Users, Flame } from 'lucide-react';
import EnhancedButton from '@/components/ui/enhanced-button';
import { DASHBOARD_LEARN_PATH } from '@/routes/paths';
import { DASHBOARD_STRINGS } from '@/strings/dashboard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  isEnrolled?: boolean;
  courseCount?: number;
}

type AvailablePathsProps = {
  limit?: number;
  className?: string;
};

export function AvailablePaths({ limit, className }: AvailablePathsProps) {
  const { user } = useAuth();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const { data: paths = [], isLoading } = useQuery<LearningPath[]>({
    queryKey: ['availablePaths', user?.id],
    queryFn: async (): Promise<LearningPath[]> => {
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          id, title, description,
          courses!inner(id)
        `);
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
        isEnrolled: enrolledPaths.includes(path.id),
        courseCount: path.courses.length,
      }));
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw error;
      return pathId;
    },
    onMutate: (pathId) => {
      setEnrollingId(pathId);
    },
    onSuccess: () => {
      toast.success(DASHBOARD_STRINGS.availablePaths.enrollSuccess);
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] });
      queryClient.invalidateQueries({ queryKey: ['myPaths'] });
    },
    onError: (error) => {
      console.error('Error enrolling:', error);
      toast.error(DASHBOARD_STRINGS.availablePaths.enrollError);
    },
    onSettled: () => setEnrollingId(null),
  });

  const handleEnroll = async (pathId: string) => {
    if (!user) {
      toast.error(DASHBOARD_STRINGS.availablePaths.mustLoginToEnroll);
      return;
    }
    enrollMutation.mutate(pathId);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(limit || 3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const visiblePaths = typeof limit === 'number' && limit > 0 ? paths.slice(0, limit) : paths;

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {visiblePaths.map((path) => (
          <Card
            key={path.id}
            className={`relative border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[300px] flex flex-col ${path.isEnrolled ? 'ring-1 ring-forge-orange/20' : ''}`}
          >
            {path.isEnrolled && (
              <div className="absolute top-2 right-2 bg-forge-orange text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 shadow-sm">
                <Flame className="h-3 w-3" />{DASHBOARD_STRINGS.availablePaths.enrolledBadge}
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
                {DASHBOARD_STRINGS.availablePaths.courses(path.courseCount || 0)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 mt-auto">
              {path.isEnrolled ? (
                <EnhancedButton className="w-full text-sm py-2" size="sm" withGradient asChild>
                  <Link to={DASHBOARD_LEARN_PATH(path.id)}>
                    {DASHBOARD_STRINGS.availablePaths.continueLearning}
                  </Link>
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
                    {enrollingId === path.id ? DASHBOARD_STRINGS.availablePaths.enrolling : DASHBOARD_STRINGS.availablePaths.enroll}
                  </EnhancedButton>
                  {user && (
                    <EnhancedButton variant="ghost" size="sm" className="w-full" asChild>
                      <Link to={DASHBOARD_LEARN_PATH(path.id)}>
                        {DASHBOARD_STRINGS.availablePaths.viewDetails}
                      </Link>
                    </EnhancedButton>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
