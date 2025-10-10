import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createClientBrowser } from '@/lib/supabase';
import { useAuth } from '@/hooks/useOAuth';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import { LessonViewer } from '@/components/dashboard/LessonViewer';
import LessonAIChat from '@/components/ai/LessonAIChat';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DASHBOARD, DASHBOARD_EXPLORE, DASHBOARD_COMMUNITY_PROJECTS } from '@/routes/paths';
import { ModuleProjectsPanel, type ModuleProject, type ProjectSubmissionSummary } from '@/components/dashboard/ModuleProjectsPanel';
import { toast } from 'sonner';

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

export function CourseView() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const supabase = createClientBrowser();
  const queryClient = useQueryClient();
  const { setHeaderBreadcrumb } = useOutletContext<DashboardOutletContext>();
  const { user } = useAuth();
  const { t } = useTranslation();

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
            projects:projects(id, title, description, project_order)
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
        project_order: number | null;
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
              .sort((a, b) => (a.project_order ?? 0) - (b.project_order ?? 0))
              .map((project) => ({
                id: project.id,
                title: project.title,
                description: project.description ?? '',
                project_order: project.project_order ?? 1,
              })),
          })),
      };

      if (normalized.modules.length && normalized.modules[0].lessons.length) {
        setCurrentLesson(normalized.modules[0].lessons[0]);
      }

      return normalized;
    },
  });

  const projectIds = useMemo(() => {
    if (!course) return [] as string[];
    return course.modules.flatMap((module) => module.projects.map((project) => project.id));
  }, [course]);

  const sortedProjectIds = useMemo(() => {
    if (projectIds.length === 0) return [] as string[];
    return Array.from(new Set(projectIds)).sort();
  }, [projectIds]);

  const projectIdsKey = useMemo(() => sortedProjectIds.join(','), [sortedProjectIds]);

  const { data: submissionsMap = {}, isFetching: loadingSubmissions } = useQuery<Record<string, ProjectSubmissionSummary>>({
    queryKey: ['project-submissions', user?.id, projectIdsKey],
    enabled: Boolean(user && sortedProjectIds.length > 0),
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('project_submissions')
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
    onError: (error) => {
      console.error('Failed to load project submissions', error);
      toast.error(t('projects.notifications.fetchError'));
    },
  });

  const submitMutation = useMutation<void, Error, ProjectSubmissionPayload>({
    mutationFn: async ({ projectId, repositoryUrl }) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase
        .from('project_submissions')
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
      queryClient.invalidateQueries({ queryKey: ['project-submissions', user?.id, projectIdsKey] });
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

  useEffect(() => {
    if (!course) return;
    const crumb = (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={DASHBOARD}>{t('nav.dashboard')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={DASHBOARD_EXPLORE}>{t('nav.paths')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
          {currentLesson && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLesson.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
    setHeaderBreadcrumb(crumb);
    return () => setHeaderBreadcrumb(null);
  }, [course?.title, currentLesson?.title, setHeaderBreadcrumb, t]);

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

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="w-full xl:w-80 xl:shrink-0 xl:border xl:rounded-md xl:bg-white">
        {isLoading || !course ? (
          <div className="p-4 text-gray-500">{t('common.buttons.loading')}</div>
        ) : (
          <CourseTableOfContents
            course={course}
            currentLessonId={currentLesson?.id}
            onLessonClick={setCurrentLesson}
          />
        )}
      </div>
      <div className="flex-1 space-y-6">
        <div className="border rounded-md bg-white min-h-[60vh]">
          <LessonViewer lesson={currentLesson} course={course ?? null} onLessonChange={setCurrentLesson} />
        </div>

        {currentModule && isLastLessonInModule && (
          <ModuleProjectsPanel
            moduleTitle={currentModule.title}
            projects={currentModule.projects}
            submissions={submissionsMap}
            submittingProjectId={submittingProjectId}
            onSubmit={handleProjectSubmit}
            communityLink={DASHBOARD_COMMUNITY_PROJECTS}
          />
        )}
      </div>
      <div className="hidden w-full xl:w-96 xl:shrink-0 xl:sticky xl:top-6 xl:self-start xl:h-[calc(100vh-7rem)] xl:max-h-[calc(100vh-7rem)]">
        <LessonAIChat
          courseTitle={course?.title}
          lessonTitle={currentLesson?.title}
          lessonType={currentLesson?.lesson_type}
          lessonContent={currentLesson?.content}
        />
      </div>
    </div>
  );
}

export default CourseView;
