import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface InProgressPath {
  id: string;
  title: string;
  // We'll calculate this in the future
  progress: number; 
}

export function MyLearningPaths() {
  const { user } = useAuth();
  const [myPaths, setMyPaths] = useState<InProgressPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyPaths = async () => {
      setLoading(true);
      try {
        // Buscar apenas learning paths onde o usuário está matriculado
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('user_enrollments')
          .select(`
            learning_path_id,
            learning_paths!inner(id, title)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (enrollmentError) throw enrollmentError;

        const pathsWithProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            const path = enrollment.learning_paths;
            
            // Get user progress for this path usando nova função
            const { data: progress, error: progressError } = await supabase
              .rpc('get_enrolled_path_progress', {
                path_id: path.id,
                user_id: user.id
              });

            if (progressError) {
              console.error('Error fetching progress for path:', path.id, progressError);
              return { ...path, progress: 0 };
            }

            return {
              ...path,
              progress: progress || 0
            };
          })
        );

        setMyPaths(pathsWithProgress);
      } catch (error) {
        console.error('Error fetching user paths:', error);
        setMyPaths([]);
      }
      setLoading(false);
    };

    fetchMyPaths();
  }, [user]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (myPaths.length === 0) {
    return (
      <div className="mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">
              <p className="mb-2">You are not yet enrolled in any path.</p>
              <p className="text-sm">Explore the available paths and enroll to get started!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid gap-4 md:grid-cols-2">
        {myPaths.map(path => (
          <Link to={`/learn/path/${path.id}`} key={path.id}>
            <Card className="hover:bg-gray-50 transition-colors">
              <CardHeader>
                <CardTitle>{path.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={path.progress} />
                <p className="text-sm text-gray-600 mt-2">{path.progress}% complete</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
