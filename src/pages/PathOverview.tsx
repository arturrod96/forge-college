import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientBrowser } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EnhancedButton from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { DASHBOARD_LEARN_COURSE, DASHBOARD_EXPLORE } from '@/routes/paths';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookMarked, Folder, CirclePlay, Flame, CheckCircle, CircleCheckBig } from 'lucide-react';
import { getTitleFromLocalizations, getDescriptionFromLocalizations, getCourseTitleWithLocalizations } from '@/lib/localization';

interface ModuleSummary {
  id: string;
  title: string;
  order: number;
}

interface CourseSummary {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  modules: ModuleSummary[];
}

interface LearningPathDetail {
  id: string;
  title: string;
  description: string | null;
  courses: CourseSummary[];
}

type CourseProgressStatus = 'not_started' | 'in_progress' | 'completed';

export default function PathOverview() {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClientBrowser();
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'pt-BR';

  const { data, isLoading, error } = useQuery<{
    path: LearningPathDetail;
    isEnrolled: boolean;
    courseProgress: Record<string, CourseProgressStatus>;
  } | null>({
    queryKey: ['pathOverview', pathId, user?.id, locale],
    enabled: Boolean(pathId),
    queryFn: async () => {
      // Load path + courses with modules and lessons (for progress) and localizations
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select(
          'id, title, description, learning_path_localizations(locale, title, description), courses(id, title, description, thumbnail_url, order, course_localizations(locale, title, description), modules(id, title, order, lessons(id)))'
        )
        .eq('id', pathId)
        .single();
      if (pathError) throw pathError;

      const rawCourses = (pathData.courses || []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      const pathLocs = (pathData as { learning_path_localizations?: { locale: string; title: string | null; description?: string | null }[] }).learning_path_localizations;

      const path: LearningPathDetail = {
        id: pathData.id,
        title: getTitleFromLocalizations(pathLocs, locale, pathData.title),
        description: getDescriptionFromLocalizations(pathLocs, locale, pathData.description),
        courses: rawCourses.map((c: any) => {
          const modules = (c.modules || [])
            .map((m: any) => ({ id: m.id, title: m.title, order: m.order ?? 0 }))
            .filter((m: any) => m.id && m.title)
            .sort((a: any, b: any) => a.order - b.order);
          const courseLocs = c.course_localizations;
          return {
            id: c.id,
            title: getCourseTitleWithLocalizations({ title: c.title }, courseLocs, locale),
            description: getDescriptionFromLocalizations(courseLocs ?? [], locale, c.description ?? null) || null,
            thumbnail_url: c.thumbnail_url ?? null,
            modules,
          };
        }),
      };

      let isEnrolled = false;
      if (user) {
        const { data: enroll, error: enrollErr } = await supabase
          .from('user_enrollments')
          .select('learning_path_id')
          .eq('user_id', user.id)
          .eq('learning_path_id', pathId)
          .eq('is_active', true)
          .maybeSingle();
        if (!enrollErr) isEnrolled = Boolean(enroll);
      }

      // Build courseProgress when user is enrolled
      const courseProgress: Record<string, CourseProgressStatus> = {};
      if (user?.id && isEnrolled && rawCourses.length > 0) {
        const lessonToCourse: Record<string, string> = {};
        const allLessonIds: string[] = [];
        for (const c of rawCourses) {
          for (const m of c.modules || []) {
            for (const l of m.lessons || []) {
              if (l?.id) {
                lessonToCourse[l.id] = c.id;
                allLessonIds.push(l.id);
              }
            }
          }
        }
        if (allLessonIds.length > 0) {
          const { data: progress } = await supabase
            .from('user_progress')
            .select('lesson_id, status')
            .eq('user_id', user.id)
            .in('lesson_id', allLessonIds);
          const byCourse: Record<string, { total: number; completed: number; inProgress: number }> = {};
          for (const c of rawCourses) byCourse[c.id] = { total: 0, completed: 0, inProgress: 0 };
          for (const l of allLessonIds) {
            const cid = lessonToCourse[l];
            if (cid && byCourse[cid]) byCourse[cid].total++;
          }
          for (const p of progress || []) {
            const cid = lessonToCourse[p.lesson_id];
            if (cid && byCourse[cid]) {
              if (p.status === 'completed') byCourse[cid].completed++;
              else if (p.status === 'in_progress') byCourse[cid].inProgress++;
            }
          }
          for (const [cid, s] of Object.entries(byCourse)) {
            if (s.total === 0) courseProgress[cid] = 'not_started';
            else if (s.completed === s.total) courseProgress[cid] = 'completed';
            else if (s.completed > 0 || s.inProgress > 0) courseProgress[cid] = 'in_progress';
            else courseProgress[cid] = 'not_started';
          }
        }
      }

      return { path, isEnrolled, courseProgress };
    },
  });

  // When enrolled, resolve the first incomplete lesson to deep-link "Continuar"
  const { data: nextLesson } = useQuery<{ courseId: string; moduleId: string; lessonId: string } | null>({
    queryKey: ['pathNextLesson', pathId, user?.id],
    enabled: Boolean(pathId && user?.id && data?.isEnrolled),
    queryFn: async () => {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, modules(id, order, lessons(id, order))')
        .eq('path_id', pathId)
        .order('order', { ascending: true });

      const ordered: { courseId: string; moduleId: string; lessonId: string }[] = [];
      for (const c of coursesData || []) {
        const mods = ((c as any).modules || []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        for (const m of mods) {
          const less = ((m as any).lessons || []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          for (const l of less) {
            ordered.push({ courseId: c.id, moduleId: m.id, lessonId: l.id });
          }
        }
      }
      if (ordered.length === 0) return null;

      const lessonIds = ordered.map((x) => x.lessonId);
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, status')
        .eq('user_id', user!.id)
        .in('lesson_id', lessonIds);

      const completedSet = new Set((progress || []).filter((p) => p.status === 'completed').map((p) => p.lesson_id));
      const next = ordered.find((x) => !completedSet.has(x.lessonId)) ?? null;
      return next;
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !pathId) throw new Error(t('dashboard.errors.notAuthenticated'));
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId });
      if (error) throw new Error(error.message || t('dashboard.errors.failedToEnroll'));
    },
    onSuccess: () => {
      toast.success(t('dashboard.pathOverview.continue'));
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] });
      queryClient.invalidateQueries({ queryKey: ['myPaths'] });
      queryClient.invalidateQueries({ queryKey: ['pathOverview'] });
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['formation-detail'] });
    },
    onError: () => toast.error(t('dashboard.enrollError')),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Supabase error loading path overview:', error)
  }

  if (!data) {
    return <div className="text-gray-500">{t('dashboard.pathOverview.notFound')}</div>;
  }

  const { path, isEnrolled, courseProgress = {} } = data;

  const continueUrl =
    nextLesson
      ? `${DASHBOARD_LEARN_COURSE(nextLesson.courseId)}?lessonId=${nextLesson.lessonId}&moduleId=${nextLesson.moduleId}`
      : path.courses[0]
        ? DASHBOARD_LEARN_COURSE(path.courses[0].id)
        : '#';

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link to={DASHBOARD_EXPLORE} className="inline-flex items-center gap-2 text-sm text-forge-orange hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t('dashboard.pathOverview.backToPaths')}
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-forge-dark">{path.title}</h1>
              <Badge
                variant={isEnrolled ? 'enrolled' : 'available'}
                icon={isEnrolled ? CirclePlay : CircleCheckBig}
                iconPosition="left"
              >
                {isEnrolled ? t('dashboard.enrolled') : t('filters.statusOptions.available')}
              </Badge>
            </div>
            <p className="text-forge-gray max-w-2xl">
              {path.description || t('dashboard.pathOverview.descriptionFallback')}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-forge-gray">
              <span className="inline-flex items-center gap-1">
                <BookMarked className="h-4 w-4" />
                {t('dashboard.availablePaths.courses', { count: path.courses.length })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!isEnrolled ? (
              <EnhancedButton
                onClick={() => enrollMutation.mutate()}
                disabled={!user || enrollMutation.isPending}
                className="min-w-[220px]"
                withGradient
              >
                {enrollMutation.isPending ? t('dashboard.enrolling') : t('dashboard.enroll')}
              </EnhancedButton>
            ) : (
              <Link to={continueUrl}>
                <EnhancedButton className="min-w-[220px]" withGradient>
                  {t('dashboard.pathOverview.continue')}
                </EnhancedButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-forge-dark">{t('dashboard.pathOverview.courses')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {path.courses.map((course) => {
            const isInProgress = courseProgress[course.id] === 'in_progress';
            const isCompleted = courseProgress[course.id] === 'completed';
            const modules = course.modules || [];

            const card = (
              <Card
                className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[480px] flex flex-col group cursor-pointer"
              >
                {/* Thumbnail */}
                <div
                  className="h-48 flex items-center justify-center relative"
                  style={{ backgroundColor: '#303b2e' }}
                >
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookMarked className="h-16 w-16 text-forge-orange" />
                  )}

                  {/* Badges */}
                  {isInProgress && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                        {t('dashboard.enrolled')}
                      </Badge>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                        {t('filters.progressOptions.completed')}
                      </Badge>
                    </div>
                  )}
                  {!isInProgress && !isCompleted && isEnrolled && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="default" size="sm" icon={CheckCircle} iconPosition="left">
                        {t('filters.statusOptions.available')}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="flex-1 min-h-0 flex flex-col space-y-2 p-6">
                  <CardTitle className="flex items-start gap-2 text-forge-dark tracking-normal text-lg md:text-xl leading-tight line-clamp-2 break-words flex-1">
                    <BookMarked className="h-4 w-4 mt-0.5 text-forge-orange shrink-0" />
                    <span>{course.title}</span>
                  </CardTitle>
                  <CardDescription className="text-[13px] text-forge-gray line-clamp-3 min-h-[3.75rem]">
                    {course.description || t('courses.descriptionFallback')}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4 mt-auto">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      {t('courses.modules', { count: modules.length })}
                    </div>
                  </div>

                  {/* Modules preview */}
                  {modules.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">
                        {t('courses.modulesLabel')}
                      </h4>
                      <div className="space-y-1">
                        {modules.slice(0, 3).map((module, index) => (
                          <div
                            key={module.id}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <span className="text-forge-orange font-medium">{index + 1}.</span>
                            <span className="truncate">{module.title}</span>
                          </div>
                        ))}
                        {modules.length > 3 && (
                          <div className="text-xs text-gray-500">
                            {t('courses.moreModules', { count: modules.length - 3 })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  <EnhancedButton
                    className="w-full text-sm py-2"
                    size="sm"
                    withGradient
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(DASHBOARD_LEARN_COURSE(course.id));
                    }}
                  >
                    {isInProgress
                      ? t('common.buttons.continueLearning')
                      : t('courses.startCourse')}
                  </EnhancedButton>
                </CardContent>
              </Card>
            );

            return (
              <Link
                key={course.id}
                to={DASHBOARD_LEARN_COURSE(course.id)}
                className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
