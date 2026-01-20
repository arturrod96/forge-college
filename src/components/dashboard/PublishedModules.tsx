import { useEffect, useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useOAuth';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { Folder, ChevronDown, ChevronRight, CirclePlay, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch, StatusFilter, SortSelector, ProgressFilter, type StatusFilterValue, type SortOption, type ProgressFilterValue } from '@/components/filters';
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
  progressStatus?: 'not_started' | 'in_progress' | 'completed';
}

type PublishedModulesProps = {
  limit?: number;
  className?: string;
  showSearch?: boolean;
};

export function PublishedModules({ limit, className, showSearch = true }: PublishedModulesProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterValue[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('course_order');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ['publishedModules', user?.id],
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
      
      // Calculate progress for modules if user is logged in
      const moduleProgressMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      
      if (user && data && data.length > 0) {
        const moduleIds = data.map(m => m.id);
        
        // Get all lessons for these modules
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('id, module_id')
          .in('module_id', moduleIds);
        
        if (lessonsData && lessonsData.length > 0) {
          const lessonIds = lessonsData.map(l => l.id);
          const lessonToModule: Record<string, string> = {};
          lessonsData.forEach(lesson => {
            lessonToModule[lesson.id] = lesson.module_id;
          });
          
          // Get user progress for these lessons
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('lesson_id, status')
            .eq('user_id', user.id)
            .in('lesson_id', lessonIds);
          
          // Calculate progress per module
          const moduleProgress: Record<string, { total: number; completed: number; inProgress: number }> = {};
          moduleIds.forEach(id => {
            moduleProgress[id] = { total: 0, completed: 0, inProgress: 0 };
          });
          
          lessonsData.forEach(lesson => {
            const moduleId = lesson.module_id;
            if (moduleId && moduleProgress[moduleId]) {
              moduleProgress[moduleId].total++;
            }
          });
          
          progressData?.forEach(progress => {
            const moduleId = lessonToModule[progress.lesson_id];
            if (moduleId && moduleProgress[moduleId]) {
              if (progress.status === 'completed') {
                moduleProgress[moduleId].completed++;
              } else if (progress.status === 'in_progress') {
                moduleProgress[moduleId].inProgress++;
              }
            }
          });
          
          // Determine module status
          Object.keys(moduleProgress).forEach(moduleId => {
            const stats = moduleProgress[moduleId];
            if (stats.total === 0) {
              moduleProgressMap[moduleId] = 'not_started';
            } else if (stats.completed === stats.total) {
              moduleProgressMap[moduleId] = 'completed';
            } else if (stats.completed > 0 || stats.inProgress > 0) {
              moduleProgressMap[moduleId] = 'in_progress';
            } else {
              moduleProgressMap[moduleId] = 'not_started';
            }
          });
        }
      }
      
      return (data || []).map(module => ({
        ...module,
        progressStatus: moduleProgressMap[module.id] || 'not_started',
      }));
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

    // Filter by progress
    if (progressFilter.length > 0) {
      filtered = filtered.filter((mod) => {
        return progressFilter.includes(mod.progressStatus || 'not_started');
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
  }, [modules, searchTerm, statusFilter, progressFilter, sortOption]);

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
        icon={Folder}
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
            <ProgressFilter selected={progressFilter} onChange={setProgressFilter} />
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
          icon={Folder}
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
                        <Card className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[200px] flex flex-col cursor-pointer">
                          {/* Thumbnail */}
                          <div className="h-48 flex items-center justify-center relative" style={{ backgroundColor: '#303b2e' }}>
                            <Folder className="h-16 w-16 text-forge-orange" />
                            
                            {/* Badge sobre a thumbnail */}
                            {module.progressStatus === 'in_progress' && (
                              <div className="absolute top-2 right-2 z-10">
                                <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                                  Enrolled
                                </Badge>
                              </div>
                            )}
                            {module.progressStatus === 'completed' && (
                              <div className="absolute top-2 right-2 z-10">
                                <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                                  Completed
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardHeader className="space-y-2">
                            <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-base leading-tight line-clamp-2 break-words">
                              <Folder className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                              <span>#{module.order} · {module.title}</span>
                            </CardTitle>
                            {module.summary && (
                              <CardDescription className="text-xs text-forge-gray line-clamp-2">
                                {module.summary}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-4 mt-auto">
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
