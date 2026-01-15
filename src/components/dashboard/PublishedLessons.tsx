import { useMemo, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { LoadingGrid } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpenText, Clock, Play, HelpCircle, ChevronDown, ChevronRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_LEARN_COURSE } from '@/routes/paths';
import { ContentSearch, StatusFilter, SortSelector, type StatusFilterValue, type SortOption } from '@/components/filters';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order: number;
  lesson_type: 'text' | 'video' | 'quiz';
  duration_minutes: number | null;
  xp_value: number;
  is_published: boolean;
  module_id: string;
  modules?: {
    id: string;
    title: string;
    order: number;
    course_id?: string;
  };
}

type LessonWithProgress = Lesson & {
  progressStatus: 'not_started' | 'in_progress' | 'completed';
};

type PublishedLessonsProps = {
  limit?: number;
  className?: string;
  showSearch?: boolean;
  showFilters?: boolean;
};

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Play;
    case 'quiz':
      return HelpCircle;
    default:
      return BookOpenText;
  }
};

const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case 'text':
      return 'Text Lesson';
    case 'video':
      return 'Video Lesson';
    case 'quiz':
      return 'Quiz';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export function PublishedLessons({ limit, className, showSearch = true, showFilters = true }: PublishedLessonsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const supabase = useMemo(() => createClientBrowser(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [sortOption, setSortOption] = useState<SortOption>('module_order');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Fetch lessons
  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: ['publishedLessons'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Lesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, slug, order, lesson_type, duration_minutes, xp_value, is_published, module_id, modules(id, title, order, course_id)')
        .eq('is_published', true)
        .order('module_id', { ascending: true })
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user progress
  const { data: lessonProgress = {} } = useQuery<Record<string, 'not_started' | 'in_progress' | 'completed'>>({
    queryKey: ['lessonProgress', user?.id],
    enabled: !!user?.id && lessons.length > 0,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const lessonIds = lessons.map((l) => l.id);
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, status')
        .eq('user_id', user!.id)
        .in('lesson_id', lessonIds);

      const result: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      progressData?.forEach((p) => {
        result[p.lesson_id] = p.status;
      });
      return result;
    },
  });

  const isLoading = isLoadingLessons;

  // Process lessons: add progress, filter, sort
  const processedLessons = useMemo(() => {
    let result: LessonWithProgress[] = lessons.map((lesson) => ({
      ...lesson,
      progressStatus: lessonProgress[lesson.id] || 'not_started',
    }));

    // Filter by status (lessons don't have status, but we can filter by is_published)
    if (statusFilter !== 'all') {
      result = result.filter((lesson) => {
        if (statusFilter === 'available') {
          return lesson.is_published === true;
        }
        // For coming_soon, we don't have that status for lessons, so show all published
        return lesson.is_published === true;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((lesson) => lesson.title.toLowerCase().includes(term));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          // Lessons don't have created_at, so use order
          return a.order - b.order;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'module_order':
          // Sort by module order first, then lesson order
          const aModule = Array.isArray(a.modules) ? a.modules[0] : a.modules;
          const bModule = Array.isArray(b.modules) ? b.modules[0] : b.modules;
          const moduleOrderDiff = (aModule?.order || 0) - (bModule?.order || 0);
          if (moduleOrderDiff !== 0) return moduleOrderDiff;
          return a.order - b.order;
        default:
          // Default: progress status first, then order
          const statusOrder = { in_progress: 0, not_started: 1, completed: 2 };
          const orderDiff = statusOrder[a.progressStatus] - statusOrder[b.progressStatus];
          if (orderDiff !== 0) return orderDiff;
          return a.order - b.order;
      }
    });

    return result;
  }, [lessons, lessonProgress, searchTerm, statusFilter, sortOption]);

  // Group lessons by module
  const groupedLessons = useMemo(() => {
    const groups: Map<string, { moduleTitle: string; moduleOrder: number; courseId?: string; lessons: LessonWithProgress[] }> = new Map();

    processedLessons.forEach((lesson) => {
      const module = Array.isArray(lesson.modules) ? lesson.modules[0] : lesson.modules;
      const moduleId = module?.id || lesson.module_id;
      const moduleTitle = module?.title || 'Unknown Module';
      const moduleOrder = module?.order || 0;
      const courseId = module?.course_id;

      if (!groups.has(moduleId)) {
        groups.set(moduleId, { moduleTitle, moduleOrder, courseId, lessons: [] });
      }
      groups.get(moduleId)!.lessons.push(lesson);
    });

    // Sort groups by module order
    return Array.from(groups.entries()).sort((a, b) => a[1].moduleOrder - b[1].moduleOrder);
  }, [processedLessons]);

  // Initialize expanded modules on first load
  useMemo(() => {
    if (groupedLessons.length > 0 && expandedModules.size === 0) {
      // Expand modules that have in_progress lessons
      const modulesWithProgress = groupedLessons
        .filter(([, group]) => group.lessons.some((l) => l.progressStatus === 'in_progress'))
        .map(([id]) => id);

      if (modulesWithProgress.length > 0) {
        setExpandedModules(new Set(modulesWithProgress));
      } else {
        // Expand first module if none have progress
        setExpandedModules(new Set([groupedLessons[0][0]]));
      }
    }
  }, [groupedLessons, expandedModules.size]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
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

  if (lessons.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        icon={BookOpenText}
        title="No lessons available"
        description="Lessons will be available as modules are published"
        size="md"
      />
    );
  }

  const visibleGroups = limit ? groupedLessons.slice(0, limit) : groupedLessons;

  return (
    <div className={className}>
      {(showSearch || showFilters) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {showSearch && (
              <ContentSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search lessons..."
              />
            )}
            {showFilters && (
              <>
                <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                <SortSelector
                  value={sortOption}
                  onChange={setSortOption}
                  options={['recent', 'alphabetical', 'module_order']}
                />
              </>
            )}
          </div>
        </div>
      )}

      {processedLessons.length === 0 && searchTerm && (
        <EmptyState
          variant="no-results"
          icon={BookOpenText}
          title="No lessons found"
          description="Try adjusting your filters"
          size="md"
        />
      )}

      {visibleGroups.length > 0 && (
        <div className="space-y-4">
          {visibleGroups.map(([moduleId, group]) => (
            <Collapsible
              key={moduleId}
              open={expandedModules.has(moduleId)}
              onOpenChange={() => toggleModule(moduleId)}
            >
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-forge-cream/30 rounded-lg hover:bg-forge-cream/50 transition-colors text-left">
                {expandedModules.has(moduleId) ? (
                  <ChevronDown className="h-4 w-4 text-forge-orange shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-forge-orange shrink-0" />
                )}
                <span className="font-semibold text-forge-dark">{group.moduleTitle}</span>
                <Badge variant="outline" size="sm" className="ml-auto">
                  {group.lessons.length} lessons
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch mt-4 pl-6">
                  {group.lessons.map((lesson) => {
                    const Icon = getLessonIcon(lesson.lesson_type);
                    const courseId = group.courseId;
                    const query = new URLSearchParams({ lessonId: lesson.id, moduleId: lesson.module_id }).toString();
                    const isInProgress = lesson.progressStatus === 'in_progress';
                    const isCompleted = lesson.progressStatus === 'completed';

                    const card = (
                      <Card
                        className={[
                          'relative overflow-hidden border-forge-cream/80 transition-shadow h-full min-h-[200px] flex flex-col',
                          courseId ? 'hover:shadow-md cursor-pointer' : 'opacity-70 cursor-not-allowed',
                          isInProgress ? 'ring-2 ring-forge-orange/30' : '',
                        ].join(' ')}
                      >
                        <CardHeader className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-base leading-tight line-clamp-2 break-words flex-1">
                              <Icon className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                              <span>#{lesson.order} · {lesson.title}</span>
                            </CardTitle>
                            {isInProgress && (
                              <Badge variant="brand" size="sm" icon={PlayCircle} iconPosition="left">
                                Continue
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="success" size="sm">
                                Done
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 mt-auto">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" size="sm">
                              {getLessonTypeLabel(lesson.lesson_type)}
                            </Badge>
                            {lesson.duration_minutes && (
                              <Badge variant="outline" size="sm" icon={Clock} iconPosition="left">
                                {lesson.duration_minutes} min
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-forge-gray font-medium">
                            {lesson.xp_value} XP
                          </div>
                        </CardContent>
                      </Card>
                    );

                    if (!courseId) return <div key={lesson.id}>{card}</div>;

                    return (
                      <Link
                        key={lesson.id}
                        to={`${DASHBOARD_LEARN_COURSE(courseId)}?${query}`}
                        className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange/60"
                      >
                        {card}
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
