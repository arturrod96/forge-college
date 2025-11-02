import { useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { toast } from 'sonner';
import { GraduationCap, BookOpen, Users, Star } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Formation {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  paths_count?: number;
  paths?: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  created_at: string;
}

type FormationsListProps = {
  limit?: number;
  className?: string;
};

export function FormationsList({ limit, className }: FormationsListProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();

  const { data: formations = [], isLoading } = useQuery<Formation[]>({
    queryKey: ['formations'],
    enabled: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<Formation[]> => {
      const { data, error } = await supabase
        .from('formations')
        .select(`
          id, title, description, thumbnail_url, created_at,
          formation_paths!inner(
            learning_paths!inner(id, title)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((formation: any) => ({
        id: formation.id,
        title: formation.title,
        description: formation.description,
        thumbnail_url: formation.thumbnail_url,
        paths_count: formation.formation_paths?.length || 0,
        paths: formation.formation_paths?.map((fp: any) => ({
          id: fp.learning_paths.id,
          title: fp.learning_paths.title,
          order: fp.order,
        })) || [],
        created_at: formation.created_at,
      }));
    },
  });

  const displayFormations = limit ? formations.slice(0, limit) : formations;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayFormations.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No formations available</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Comprehensive learning programs will be available soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {displayFormations.map((formation) => (
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
              <CardTitle className="text-xl">{formation.title}</CardTitle>
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
            <Link to={`/formations/${formation.id}`}>
              <EnhancedButton className="w-full">
                View Formation
              </EnhancedButton>
            </Link>

            {/* Creation date */}
            <div className="text-xs text-gray-500 text-center">
              Created {formatDistanceToNow(new Date(formation.created_at))} ago
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
