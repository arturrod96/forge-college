import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EnhancedButton from '@/components/ui/enhanced-button';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { DASHBOARD_STRINGS } from '@/strings/dashboard';
import { toast } from 'sonner';

interface CourseSummary {
  id: string;
  title: string;
  description: string | null;
}

interface LearningPathDetail {
  id: string;
  title: string;
  description: string | null;
  courses: CourseSummary[];
}

export function PathOverview() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const { data, isLoading, error } = useQuery<{ path: LearningPathDetail; isEnrolled: boolean } | null>({
    queryKey: ['pathOverview', pathId, user?.id],
    enabled: Boolean(pathId),
    queryFn: async () => {
      // Load path + courses
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select('id, title, description, courses(id, title, description)')
        .eq('id', pathId)
        .single();
      if (pathError) throw pathError;

      const path: LearningPathDetail = {
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        courses: (pathData.courses || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
        })),
      };

      let isEnrolled = false;
      if (user) {
        const { data: enroll, error: enrollErr } = await supabase
          .from('user_enrollments')
          .select('learning_path_id')
          .eq('user_id', user.id)
          .eq('learning_path_id', pathId)
          .eq('is_active', true)
          .maybeSingle();
        if (!enrollErr) isEnrolled = Boolean(enroll);
      }

      return { path, isEnrolled };
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !pathId) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw new Error(error.message || 'Failed to enroll');
    },
    onSuccess: () => {
      toast.success(DASHBOARD_STRINGS.pathOverview.continue);
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] });
      queryClient.invalidateQueries({ queryKey: ['myPaths'] });
      queryClient.invalidateQueries({ queryKey: ['pathOverview'] });
    },
    onError: () => toast.error(DASHBOARD_STRINGS.availablePaths.enrollError),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Supabase error loading path overview:', error)
  }

  if (!data) {
    return <div className="text-gray-500">{DASHBOARD_STRINGS.pathOverview.notFound}</div>;
  }

  const { path, isEnrolled } = data;

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center px-2 py-1 rounded bg-forge-orange/10 text-forge-orange text-xs font-medium">
          {DASHBOARD_STRINGS.pathOverview.badge}
        </div>
        <h1 className="text-3xl font-bold mt-2 text-forge-dark">{path.title}</h1>
        {path.description && (
          <p className="mt-2 text-forge-gray">{path.description}</p>
        )}
      </header>

      {!isEnrolled ? (
        <div>
          <EnhancedButton
            onClick={() => enrollMutation.mutate()}
            disabled={!user || enrollMutation.isPending}
            withGradient
          >
            {enrollMutation.isPending ? DASHBOARD_STRINGS.pathOverview.enrolling : DASHBOARD_STRINGS.pathOverview.enroll}
          </EnhancedButton>
        </div>
      ) : (
        <div>
          <EnhancedButton asChild withGradient>
            <Link to={path.courses[0] ? DASHBOARD_LEARN_COURSE(path.courses[0].id) : '#'}>
              {DASHBOARD_STRINGS.pathOverview.continue}
            </Link>
          </EnhancedButton>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {path.courses.map((course) => (
            <Card key={course.id} className="border-forge-cream">
              <CardHeader>
                <CardTitle className="text-forge-dark">{course.title}</CardTitle>
                {course.description && (
                  <CardDescription className="text-forge-gray">{course.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <EnhancedButton asChild variant="outline" className="w-full">
                  <Link to={DASHBOARD_LEARN_COURSE(course.id)}>
                    {DASHBOARD_STRINGS.availablePaths.viewDetails}
                  </Link>
                </EnhancedButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PathOverview;
