import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Layers, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';

interface Module {
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  order: number;
  is_published: boolean;
  course_id: string;
  courses?: {
    title: string;
  };
}

type PublishedModulesProps = {
  limit?: number;
  className?: string;
};

export function PublishedModules({ limit, className }: PublishedModulesProps) {
  const { t } = useTranslation();
  const supabase = createClientBrowser();

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ['publishedModules'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, summary, slug, order, is_published, course_id, courses(title)')
        .eq('is_published', true)
        .order('course_id', { ascending: true })
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

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

  const visibleModules = limit ? modules.slice(0, limit) : modules;

  if (visibleModules.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        icon={Layers}
        title="No modules available"
        description="Modules will be available as courses are published"
        size="md"
      />
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {visibleModules.map((module) => {
          const course = Array.isArray(module.courses)
            ? module.courses[0]
            : module.courses;
          const courseTitle = course?.title || 'Unknown Course';
          const query = new URLSearchParams({ moduleId: module.id }).toString();

          return (
            <Link
              key={module.id}
              to={`${DASHBOARD_LEARN_COURSE(module.course_id)}?${query}`}
              className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange/60"
            >
              <Card className="relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[250px] flex flex-col cursor-pointer">
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words">
                    <Layers className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                    <span>#{module.order} · {module.title}</span>
                  </CardTitle>
                  <CardDescription className="text-[13px] text-forge-gray">
                    {courseTitle}
                  </CardDescription>
                  {module.summary && (
                    <p className="text-xs text-forge-gray line-clamp-2">
                      {module.summary}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 mt-auto">
                  <Badge variant="outline" size="sm">
                    Module
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
