import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BookOpen, Users, Flame } from 'lucide-react';
import EnhancedButton from '@/components/ui/enhanced-button';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  isEnrolled?: boolean;
  courseCount?: number;
}

export function AvailablePaths() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaths = async () => {
      setLoading(true);
      try {
        // Buscar todos os learning paths com contagem de cursos
        const { data: pathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select(`
            id, title, description,
            courses!inner(id)
          `);

        if (pathsError) throw pathsError;

        // Se usuário logado, verificar matrículas
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
            enrolledPaths = enrollments.map(e => e.learning_path_id);
          }
        }

        // Mapear dados com informações de matrícula
        const pathsWithEnrollment = pathsData.map(path => ({
          id: path.id,
          title: path.title,
          description: path.description,
          isEnrolled: enrolledPaths.includes(path.id),
          courseCount: path.courses.length
        }));

        setPaths(pathsWithEnrollment);
      } catch (error) {
        console.error('Error fetching learning paths:', error);
        toast.error('Error loading learning paths');
      }
      setLoading(false);
    };

    fetchPaths();
  }, [user]);

  const handleEnroll = async (pathId: string) => {
    if (!user) {
      toast.error('You need to be logged in to enroll');
      return;
    }

    setEnrollingId(pathId);
    try {
      const { error } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: user.id,
          learning_path_id: pathId
        });

      if (error) throw error;

      toast.success('Enrollment successful!');
      
      // Atualizar estado local
      setPaths(paths.map(path => 
        path.id === pathId 
          ? { ...path, isEnrolled: true }
          : path
      ));
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Error enrolling');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <Card key={path.id} className={`relative border-forge-cream hover:shadow-md transition-shadow ${path.isEnrolled ? 'ring-1 ring-forge-orange/20' : ''}`}>
            {path.isEnrolled && (
              <div className="absolute top-2 right-2 bg-forge-orange text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Flame className="h-3 w-3" /> Matriculado
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-forge-dark">
                <BookOpen className="h-5 w-5 text-forge-orange" />
                {path.title}
              </CardTitle>
              <CardDescription className="text-forge-gray">{path.description}</CardDescription>
              <div className="flex items-center gap-2 text-sm text-forge-gray">
                <Users className="h-4 w-4 text-forge-orange" />
                {path.courseCount} curso{path.courseCount !== 1 ? 's' : ''}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {path.isEnrolled ? (
                <Link to={`/dashboard/learn/path/${path.id}`}>
                  <EnhancedButton className="w-full" withGradient>
                    Continuar aprendendo
                  </EnhancedButton>
                </Link>
              ) : (
                <>
                  <EnhancedButton 
                    onClick={() => handleEnroll(path.id)}
                    disabled={enrollingId === path.id || !user}
                    className="w-full"
                    variant="outline"
                  >
                    {enrollingId === path.id ? 'Matriculando...' : 'Matricular'}
                  </EnhancedButton>
                  {user && (
                    <Link to={`/dashboard/learn/path/${path.id}`}>
                      <EnhancedButton variant="ghost" size="sm" className="w-full">
                        Ver detalhes
                      </EnhancedButton>
                    </Link>
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
