import { useEffect, useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch, StatusFilter, SortSelector, type StatusFilterValue, type SortOption } from '@/components/filters';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Module {
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  order: number;
  is_published: boolean;
  course_id: string;
  courses?: {
    id: string;
    title: string;
    order: number;
  };
}

type PublishedModulesProps = {
  limit?: number;
  className?: string;
  showSearch?: boolean;
};

export function PublishedModules({ limit, className, showSearch = true }: PublishedModulesProps) {
  const { t } = useTranslation();
  const supabase = useMemo(() => createClientBrowser(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [sortOption, setSortOption] = useState<SortOption>('course_order');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ['publishedModules'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Module[]> => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, summary, slug, order, is_published, course_id, courses(id, title, order)')
        .eq('is_published', true)
        .order('course_id', { ascending: true })
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Filter and group modules
  const groupedModules = useMemo(() => {
    let filtered = modules;

    // Filter by status (modules don't have status, but we can filter by is_published)
    if (statusFilter !== 'all') {
      filtered = filtered.filter((mod) => {
        if (statusFilter === 'available') {
          return mod.is_published === true;
        }
        // For coming_soon, we don't have that status for modules, so show all published
        return mod.is_published === true;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (mod) =>
          mod.title.toLowerCase().includes(term) ||
          (mod.summary && mod.summary.toLowerCase().includes(term))
      );
    }

    // Sort modules before grouping
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          // Modules don't have created_at, so use order
          return a.order - b.order;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'course_order':
          // Sort by course order first, then module order
          const aCourse = Array.isArray(a.courses) ? a.courses[0] : a.courses;
          const bCourse = Array.isArray(b.courses) ? b.courses[0] : b.courses;
          const courseOrderDiff = (aCourse?.order || 0) - (bCourse?.order || 0);
          if (courseOrderDiff !== 0) return courseOrderDiff;
          return a.order - b.order;
        case 'module_order':
          return a.order - b.order;
        default:
          return a.order - b.order;
      }
    });

    // Group by course
    const groups: Map<string, { courseTitle: string; courseOrder: number; modules: Module[] }> = new Map();

    filtered.forEach((mod) => {
      const course = Array.isArray(mod.courses) ? mod.courses[0] : mod.courses;
      const courseId = course?.id || mod.course_id;
      const courseTitle = course?.title || 'Unknown Course';
      const courseOrder = course?.order || 0;

      if (!groups.has(courseId)) {
        groups.set(courseId, { courseTitle, courseOrder, modules: [] });
      }
      groups.get(courseId)!.modules.push(mod);
    });

    // Sort groups by course order
    return Array.from(groups.entries()).sort((a, b) => a[1].courseOrder - b[1].courseOrder);
  }, [modules, searchTerm, statusFilter, sortOption]);

  // Initialize expanded courses on first load
  useEffect(() => {
    if (groupedModules.length > 0 && expandedCourses.size === 0) {
      // Expand all courses initially
      setExpandedCourses(new Set(groupedModules.map(([id]) => id)));
    }
  }, [groupedModules, expandedCourses.size]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

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

  if (modules.length === 0) {
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

  const visibleGroups = limit ? groupedModules.slice(0, limit) : groupedModules;

  return (
    <div className={className}>
      {(showSearch || true) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {showSearch && (
              <ContentSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search modules..."
              />
            )}
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            <SortSelector
              value={sortOption}
              onChange={setSortOption}
              options={['recent', 'alphabetical', 'course_order', 'module_order']}
            />
          </div>
        </div>
      )}

      {groupedModules.length === 0 && searchTerm && (
        <EmptyState
          variant="search"
          icon={Layers}
          title="No modules found"
          description={`No modules match "${searchTerm}"`}
          size="md"
        />
      )}

      {visibleGroups.length > 0 && (
        <div className="space-y-4">
          {visibleGroups.map(([courseId, group]) => (
            <Collapsible
              key={courseId}
              open={expandedCourses.has(courseId)}
              onOpenChange={() => toggleCourse(courseId)}
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-forge-cream/30 rounded-lg hover:bg-forge-cream/50 transition-colors text-left">
                {expandedCourses.has(courseId) ? (
                  <ChevronDown className="h-4 w-4 text-forge-orange shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-forge-orange shrink-0" />
                )}
                <span className="font-semibold text-forge-dark">{group.courseTitle}</span>
                <Badge variant="outline" size="sm" className="ml-auto">
                  {group.modules.length} modules
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch mt-4 pl-6">
                  {group.modules.map((module) => {
                    const query = new URLSearchParams({ moduleId: module.id }).toString();

                    return (
                      <Link
                        key={module.id}
                        to={`${DASHBOARD_LEARN_COURSE(module.course_id)}?${query}`}
                        className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange/60"
                      >
                        <Card className="relative overflow-hidden border-forge-cream/80 hover:shadow-md transition-shadow h-full min-h-[200px] flex flex-col cursor-pointer">
                          <CardHeader className="space-y-2">
                            <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-base leading-tight line-clamp-2 break-words">
                              <Layers className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                              <span>#{module.order} · {module.title}</span>
                            </CardTitle>
                            {module.summary && (
                              <CardDescription className="text-xs text-forge-gray line-clamp-2">
                                {module.summary}
                              </CardDescription>
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
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
