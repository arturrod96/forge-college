import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams, useOutletContext, Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { LessonViewer } from '@/components/dashboard/LessonViewer';
import LessonAIChat from '@/components/ai/LessonAIChat';
import { LearningModeIntro } from '@/components/course/LearningModeIntro';
import { CourseOutlineModal } from '@/components/course/CourseOutlineModal';
import { DASHBOARD_EXPLORE, DASHBOARD_COMMUNITY_PROJECTS } from '@/routes/paths';
import { ModuleProjectsPanel, type ModuleProject, type ProjectSubmissionSummary } from '@/components/dashboard/ModuleProjectsPanel';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { toast } from 'sonner';
import { Check, ChevronDown, MessageCircle, Bot } from 'lucide-react';

type LessonType = 'text' | 'video' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  content: unknown;
  lesson_type: LessonType;
  xp_value: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  projects: ModuleProject[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

type DashboardOutletContext = { setHeaderBreadcrumb: (node: ReactNode | null) => void };

type ProjectSubmissionPayload = {
  projectId: string;
  repositoryUrl: string;
  isUpdate: boolean;
};

export default function CourseView() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [searchParams] = useSearchParams();
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const supabase = createClientBrowser();
  const queryClient = useQueryClient();
  const { setHeaderBreadcrumb } = useOutletContext<DashboardOutletContext>();
  const { user } = useAuth();
  const { t } = useTranslation();

  const lessonIdParam = searchParams.get('lessonId');
  const moduleIdParam = searchParams.get('moduleId');

  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['courseView', courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select(`
          id, title, description,
          modules:modules(id, title, order,
            lessons:lessons(id, title, content, lesson_type, order, xp_value),
            projects:module_projects(id, title, description, xp_value, is_active, created_at)
          )
        `)
        .eq('id', courseId)
        .single();
      if (error) throw new Error(error.message || 'Failed to load course');

      type SupabaseLesson = {
        id: string;
        title: string;
        content: unknown;
        lesson_type: LessonType;
        order: number | null;
        xp_value: number | null;
      };

      type SupabaseProject = {
        id: string;
        title: string;
        description: string | null;
        xp_value: number | null;
        is_active: boolean | null;
        created_at: string | null;
      };

      type SupabaseModule = {
        id: string;
        title: string;
        order: number | null;
        lessons?: SupabaseLesson[] | null;
        projects?: SupabaseProject[] | null;
      };

      type SupabaseCourse = {
        id: string;
        title: string;
        description: string;
        modules?: SupabaseModule[] | null;
      };

      const typedCourse = courseData as SupabaseCourse;

      const normalized: Course = {
        id: typedCourse.id,
        title: typedCourse.title,
        description: typedCourse.description,
        modules: (typedCourse.modules ?? [])
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((module) => ({
            id: module.id,
            title: module.title,
            lessons: (module.lessons ?? [])
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                lesson_type: lesson.lesson_type,
                xp_value: lesson.xp_value ?? 0,
              })),
            projects: (module.projects ?? [])
              .slice()
              .filter((project) => project.is_active ?? true)
              .sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                if (dateA !== dateB) return dateA - dateB;
                return a.title.localeCompare(b.title);
              })
              .map((project, index) => ({
                id: project.id,
                title: project.title,
                description: project.description ?? '',
                order: index + 1,
                xp_value: project.xp_value ?? null,
              })),
          })),
      };

      return normalized;
    },
  });

  const resolvedOpenModuleId = useMemo(() => {
    if (!course) return undefined;
    if (moduleIdParam) return moduleIdParam;
    if (lessonIdParam) {
      for (const m of course.modules) {
        if (m.lessons.some((l) => l.id === lessonIdParam)) return m.id;
      }
    }
    return undefined;
  }, [course, lessonIdParam, moduleIdParam]);

  useEffect(() => {
    if (!course) return;

    // If a specific lesson is requested, prioritize it.
    if (lessonIdParam) {
      for (const m of course.modules) {
        const found = m.lessons.find((l) => l.id === lessonIdParam) ?? null;
        if (found) {
          if (currentLesson?.id !== found.id) setCurrentLesson(found);
          return;
        }
      }
    }

    // If a module is requested, pick its first lesson (only if we don't have a lesson yet).
    if (moduleIdParam && !currentLesson) {
      const mod = course.modules.find((m) => m.id === moduleIdParam) ?? null;
      const first = mod?.lessons?.[0] ?? null;
      if (first) {
        setCurrentLesson(first);
        return;
      }
    }

    // Default to the first lesson in the course.
    if (!currentLesson) {
      const first = course.modules[0]?.lessons?.[0] ?? null;
      if (first) setCurrentLesson(first);
    }
  }, [course, currentLesson, lessonIdParam, moduleIdParam]);

  const projectIds = useMemo(() => {
    if (!course) return [] as string[];
    return course.modules.flatMap((module) => module.projects.map((project) => project.id));
  }, [course]);

  const sortedProjectIds = useMemo(() => {
    if (projectIds.length === 0) return [] as string[];
    return Array.from(new Set(projectIds)).sort();
  }, [projectIds]);

  const projectIdsKey = useMemo(() => sortedProjectIds.join(','), [sortedProjectIds]);

  const { data: submissionsMap = {} } = useQuery<Record<string, ProjectSubmissionSummary>>({
    queryKey: ['module-project-submissions', user?.id, projectIdsKey],
    enabled: Boolean(user && sortedProjectIds.length > 0),
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('module_project_submissions')
        .select('project_id, repository_url, submitted_at')
        .eq('user_id', user.id)
        .in('project_id', sortedProjectIds);

      if (error) throw error;

      const map: Record<string, ProjectSubmissionSummary> = {};
      for (const item of data ?? []) {
        map[item.project_id] = {
          repository_url: item.repository_url,
          submitted_at: item.submitted_at,
        };
      }
      return map;
    },
  });

  const submitMutation = useMutation<void, Error, ProjectSubmissionPayload>({
    mutationFn: async ({ projectId, repositoryUrl }) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase
        .from('module_project_submissions')
        .upsert(
          {
            project_id: projectId,
            user_id: user.id,
            repository_url: repositoryUrl,
            submitted_at: new Date().toISOString(),
          },
          { onConflict: 'project_id,user_id' }
        );
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['module-project-submissions', user?.id, projectIdsKey] });
      toast.success(
        t(variables.isUpdate ? 'projects.notifications.updated' : 'projects.notifications.submitted')
      );
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        toast.error(t('projects.errors.loginRequired'));
        return;
      }
      console.error('Project submission failed', error);
      toast.error(t('projects.notifications.submitError'));
    },
  });

  const handleProjectSubmit = useCallback(
    async (projectId: string, repositoryUrl: string) => {
      const isUpdate = Boolean(submissionsMap[projectId]);
      await submitMutation.mutateAsync({ projectId, repositoryUrl, isUpdate });
    },
    [submissionsMap, submitMutation]
  );

  const submittingProjectId = submitMutation.variables?.projectId ?? null;

  // Clear breadcrumb since we have our own header
  useEffect(() => {
    setHeaderBreadcrumb(null);
    return () => setHeaderBreadcrumb(null);
  }, [setHeaderBreadcrumb]);

  const currentModule = useMemo(() => {
    if (!course || !currentLesson) return null;
    return (
      course.modules.find((module) => module.lessons.some((lesson) => lesson.id === currentLesson.id)) ??
      null
    );
  }, [course, currentLesson]);

  const isLastLessonInModule = useMemo(() => {
    if (!currentModule || !currentLesson) return false;
    if (currentModule.lessons.length === 0) return false;
    const lastLesson = currentModule.lessons[currentModule.lessons.length - 1];
    return lastLesson.id === currentLesson.id;
  }, [currentLesson, currentModule]);

  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap(module => module.lessons);
  }, [course]);

  const currentIndex = useMemo(() => {
    if (!currentLesson) return -1;
    return allLessons.findIndex(l => l.id === currentLesson.id);
  }, [allLessons, currentLesson]);

  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markAsComplete = async () => {
    if (!user || !currentLesson) {
      toast.error('You need to be logged in to track progress');
      return;
    }

    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: currentLesson.id,
            status: 'completed',
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw new Error(error.message || 'Failed to save progress');

      toast.success('Lesson completed! 🎉');

      // Auto navigate to next lesson if available
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast.error('Error saving progress');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forge-orange mx-auto mb-4"></div>
          <p className="text-forge-gray">{t('common.buttons.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Learning Mode Intro Animation */}
      {showIntro && <LearningModeIntro onComplete={() => setShowIntro(false)} />}

      <div className="min-h-[100svh] flex flex-col bg-gradient-to-br from-slate-50 to-white">
        {/* Custom Header for Course View - Redesigned */}
        <header className="h-14 border-b bg-white/95 backdrop-blur-sm flex items-center px-4 sticky top-0 z-30 shadow-sm">
          {/* Left: Back Link */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to={DASHBOARD_EXPLORE}
              className="text-gray-500 hover:text-forge-dark transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </div>

          {/* Center: Lesson Title (Clickable) */}
          <div className="flex-1 flex justify-center px-2">
            <button
              onClick={() => setOutlineOpen(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors max-w-xs sm:max-w-md"
            >
              <span className="text-sm font-medium text-forge-dark truncate">
                {currentLesson?.title || course.title}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-forge-orange transition-colors flex-shrink-0" />
            </button>
          </div>

          {/* Right: Navigation Controls */}
          {currentLesson && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forge-orange to-orange-400 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {currentIndex + 1}/{allLessons.length}
                </span>
              </div>

              {/* Prev/Next Buttons */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => previousLesson && setCurrentLesson(previousLesson)}
                  disabled={!previousLesson}
                  className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r"
                  aria-label="Previous lesson"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => nextLesson && setCurrentLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next lesson"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Complete Button */}
              <button
                onClick={markAsComplete}
                disabled={isCompleting}
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-forge-orange to-orange-500 text-white text-sm font-medium flex items-center gap-2 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isCompleting ? 'Saving...' : 'Complete'}
                </span>
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area - 2 Column Layout */}
        <div className="flex-1 flex h-[calc(100svh-56px)]">
          {/* Center Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-4xl mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:px-8">
              <LessonViewer lesson={currentLesson} course={course} />

              {currentModule && isLastLessonInModule && (
                <div className="mt-8 border rounded-xl bg-white shadow-sm">
                  <ModuleProjectsPanel
                    moduleTitle={currentModule.title}
                    projects={currentModule.projects}
                    submissions={submissionsMap}
                    submittingProjectId={submittingProjectId}
                    onSubmit={handleProjectSubmit}
                    communityLink={DASHBOARD_COMMUNITY_PROJECTS}
                  />
                </div>
              )}
            </div>
          </main>

          {/* AI Chat Sidebar - Fixed (Desktop only) */}
          <aside className="hidden xl:flex xl:flex-col w-80 flex-shrink-0 border-l bg-white sticky top-14 h-[calc(100svh-56px)]">
            <LessonAIChat
              courseTitle={course?.title}
              lessonTitle={currentLesson?.title}
              lessonType={currentLesson?.lesson_type}
              lessonContent={currentLesson?.content}
            />
          </aside>
        </div>

        {/* FAB for AI Chat (Mobile/Tablet) */}
        <button
          onClick={() => setAiChatOpen(true)}
          className="xl:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-forge-orange to-orange-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6" />
        </button>

        {/* AI Chat Drawer (Mobile/Tablet) */}
        <Drawer open={aiChatOpen} onOpenChange={setAiChatOpen}>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader className="border-b">
              <DrawerTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-forge-orange" />
                AI Instructor
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden">
              <LessonAIChat
                courseTitle={course?.title}
                lessonTitle={currentLesson?.title}
                lessonType={currentLesson?.lesson_type}
                lessonContent={currentLesson?.content}
              />
            </div>
          </DrawerContent>
        </Drawer>

        {/* Course Outline Modal */}
        <CourseOutlineModal
          open={outlineOpen}
          onOpenChange={setOutlineOpen}
          course={course}
          currentLessonId={currentLesson?.id}
          defaultOpenModuleId={resolvedOpenModuleId}
          onLessonClick={setCurrentLesson}
        />
      </div>
    </>
  );
}
