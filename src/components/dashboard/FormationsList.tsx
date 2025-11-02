import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Star } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import * as R from '@/routes/paths';
import type { Tables } from '@/types/supabase';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

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
}

type FormationsListProps = {
  limit?: number;
  className?: string;
};

export function FormationsList({ limit, className }: FormationsListProps) {
  const supabase = createClientBrowser();

  const { data: formations = [], isLoading } = useQuery<FormationCardModel[]>({
    queryKey: ['formations'],
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
        } as FormationCardModel;
      });
    },
  });

  const displayFormations = limit ? formations.slice(0, limit) : formations;

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

  if (displayFormations.length === 0) {
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
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {displayFormations.map((formation) => {
        const createdAtDistance = formation.created_at
          ? formatDistanceToNow(new Date(formation.created_at))
          : null;

        return (
        <Card key={formation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Thumbnail or placeholder */}
          <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            {formation.thumbnail_url ? (
              <img 
                src={formation.thumbnail_url} 
                alt={formation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <GraduationCap className="h-16 w-16 text-blue-400" />
            )}
          </div>

          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                {formation.title}
                <Badge variant={formation.status === 'published' ? 'default' : formation.status === 'coming_soon' ? 'secondary' : 'outline'}>
                  {formation.status === 'published' ? 'Published' : formation.status === 'coming_soon' ? 'Coming Soon' : 'Draft'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm line-clamp-3">
                {formation.description || 'A comprehensive learning program to advance your skills.'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {formation.paths_count} paths
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Program
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
            <Link to={R.DASHBOARD_FORMATION_DETAIL(formation.id)}>
              <EnhancedButton className="w-full">
                {formation.status === 'coming_soon' ? 'Join Waitlist' : 'View Formation'}
              </EnhancedButton>
            </Link>

            {/* Creation date */}
            <div className="text-xs text-gray-500 text-center">
              {createdAtDistance ? `Created ${createdAtDistance} ago` : 'Recently added'}
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}
