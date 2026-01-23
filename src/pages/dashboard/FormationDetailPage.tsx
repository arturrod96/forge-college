import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import { useAuth } from '@/hooks/useOAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ArrowLeft, BookMarked, Users, Clock, CircleCheckBig, CirclePlay, Layers3, CheckCircle, Flame, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import * as R from '@/routes/paths'
import type { Tables } from '@/types/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

type PathProgressStatus = 'not_started' | 'in_progress' | 'completed'

type FormationPathItem = {
  id: string
  title: string
  order: number
  status: 'draft' | 'published' | 'coming_soon'
  courses: Array<{ id: string; title: string; order: number }>
}

interface FormationDetail {
  id: string
  title: string
  description?: string | null
  thumbnail_url?: string | null
  created_at: string | null
  published_at: string | null
  status: 'draft' | 'published' | 'coming_soon'
  paths: FormationPathItem[]
  waitingListCount: number
  isUserOnWaitlist: boolean
  /** Path IDs the user is enrolled in (from user_enrollments) */
  enrolledPathIds: string[]
  /** Progress status per path (only for enrolled paths) */
  pathProgress: Record<string, PathProgressStatus>
}

const isPostgrestError = (value: unknown): value is PostgrestError =>
  typeof value === 'object' && value !== null && 'code' in value && 'message' in value

export default function FormationDetailPage() {
  const { formationId } = useParams<{ formationId: string }>()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { t } = useTranslation()

  const {
    data: formation,
    isLoading,
    isError,
    error,
  } = useQuery<FormationDetail>({
    queryKey: ['formation-detail', formationId, user?.id],
    enabled: Boolean(formationId),
    queryFn: async () => {
      if (!formationId) throw new Error('Formation not found')

      const { data, error: formationError } = await supabase
        .from('formations')
        .select(`
          id, title, description, thumbnail_url, created_at, published_at, status,
          formation_paths(
            order,
            learning_paths(id, title, status, courses(id, title, order))
          )
        `)
        .eq('id', formationId)
        .single()

      if (formationError || !data) throw formationError ?? new Error('Formation not found')

      type FormationRow = Tables<'formations'>['Row']
      type FormationPathRow = Tables<'formation_paths'>['Row']
      type LearningPathRow = Tables<'learning_paths'>['Row']

      type FormationDetailQueryRow = FormationRow & {
        formation_paths?: Array<
          Pick<FormationPathRow, 'order'> & {
            learning_paths: Pick<LearningPathRow, 'id' | 'title' | 'status'> | null
          }
        > | null
      }

      const formationRow = data as FormationDetailQueryRow

      const paths: FormationPathItem[] = (formationRow.formation_paths ?? [])
        .map((fp) => {
          if (!fp.learning_paths) return null
          const lp = fp.learning_paths as { id: string; title: string; status: string; courses?: Array<{ id: string; title: string; order?: number }> }
          const courses = (lp.courses || [])
            .map((c) => ({ id: c.id, title: c.title, order: c.order ?? 0 }))
            .filter((c) => c.id && c.title)
            .sort((a, b) => a.order - b.order)
          return {
            id: lp.id,
            title: lp.title,
            order: fp.order ?? 0,
            status: lp.status as FormationPathItem['status'],
            courses,
          }
        })
        .filter((path): path is FormationPathItem => Boolean(path))
        .sort((a, b) => a.order - b.order)

      const { data: waitingListCount, error: waitingListError } = await supabase.rpc(
        'get_formation_waiting_list_count',
        { p_formation_id: formationId }
      )

      if (waitingListError) throw waitingListError

      let isUserOnWaitlist = false
      if (user?.id) {
        const { data: existing, error: existingError } = await supabase
          .from('waiting_list')
          .select('id')
          .eq('formation_id', formationId)
          .eq('user_id', user.id)
          .maybeSingle()

        if (existingError) throw existingError
        isUserOnWaitlist = Boolean(existing)
      }

      let enrolledPathIds: string[] = []
      const pathProgress: Record<string, PathProgressStatus> = {}

      if (user?.id && paths.length > 0) {
        const pathIds = paths.map((p) => p.id)
        const { data: enrolls } = await supabase
          .from('user_enrollments')
          .select('learning_path_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .in('learning_path_id', pathIds)
        enrolledPathIds = (enrolls || []).map((e: { learning_path_id?: string }) => e.learning_path_id).filter((id): id is string => Boolean(id))

        // Calculate progress for enrolled paths
        if (enrolledPathIds.length > 0) {
          // Get all courses for enrolled paths with their modules and lessons
          const { data: coursesData } = await supabase
            .from('courses')
            .select('id, path_id, modules(id, lessons(id))')
            .in('path_id', enrolledPathIds)

          // Build lesson to path mapping
          const lessonToPath: Record<string, string> = {}
          const allLessonIds: string[] = []
          const pathLessonCounts: Record<string, number> = {}

          for (const pathId of enrolledPathIds) {
            pathLessonCounts[pathId] = 0
          }

          for (const course of coursesData || []) {
            const coursePathId = (course as { path_id?: string }).path_id
            if (!coursePathId || !enrolledPathIds.includes(coursePathId)) continue

            const modules = (course as { modules?: Array<{ id: string; lessons?: Array<{ id: string }> }> }).modules || []
            for (const mod of modules) {
              for (const lesson of mod.lessons || []) {
                if (lesson?.id) {
                  lessonToPath[lesson.id] = coursePathId
                  allLessonIds.push(lesson.id)
                  pathLessonCounts[coursePathId] = (pathLessonCounts[coursePathId] || 0) + 1
                }
              }
            }
          }

          // Fetch user progress for all lessons
          if (allLessonIds.length > 0) {
            const { data: progressData } = await supabase
              .from('user_progress')
              .select('lesson_id, status')
              .eq('user_id', user.id)
              .in('lesson_id', allLessonIds)

            // Count completed lessons per path
            const pathCompletedCounts: Record<string, number> = {}
            const pathInProgressCounts: Record<string, number> = {}

            for (const pathId of enrolledPathIds) {
              pathCompletedCounts[pathId] = 0
              pathInProgressCounts[pathId] = 0
            }

            for (const p of progressData || []) {
              const pathId = lessonToPath[p.lesson_id]
              if (pathId) {
                if (p.status === 'completed') {
                  pathCompletedCounts[pathId] = (pathCompletedCounts[pathId] || 0) + 1
                } else if (p.status === 'in_progress') {
                  pathInProgressCounts[pathId] = (pathInProgressCounts[pathId] || 0) + 1
                }
              }
            }

            // Determine progress status for each path
            for (const pathId of enrolledPathIds) {
              const total = pathLessonCounts[pathId] || 0
              const completed = pathCompletedCounts[pathId] || 0
              const inProgress = pathInProgressCounts[pathId] || 0

              if (total === 0) {
                pathProgress[pathId] = 'not_started'
              } else if (completed === total) {
                pathProgress[pathId] = 'completed'
              } else if (completed > 0 || inProgress > 0) {
                pathProgress[pathId] = 'in_progress'
              } else {
                pathProgress[pathId] = 'not_started'
              }
            }
          }
        }
      }

      return {
        id: formationRow.id,
        title: formationRow.title,
        description: formationRow.description,
        thumbnail_url: formationRow.thumbnail_url,
        created_at: formationRow.created_at,
        published_at: formationRow.published_at,
        status: formationRow.status as FormationDetail['status'],
        paths,
        waitingListCount: waitingListCount ?? 0,
        isUserOnWaitlist,
        enrolledPathIds,
        pathProgress,
      }
    },
  })

  const joinWaitingListMutation = useMutation({
    mutationFn: async () => {
      if (!formationId) throw new Error('Formation not found')
      if (!user) {
        throw new Error(t('formationDetail.mustLoginToJoinWaitlist'))
      }

      const { error: insertError } = await supabase.from('waiting_list').insert({
        formation_id: formationId,
        user_id: user.id,
        email: user.email ?? '',
      })

      if (insertError) throw insertError
    },
    onSuccess: () => {
      toast.success(t('formationDetail.addedToWaitlist'))
      queryClient.invalidateQueries({ queryKey: ['formation-detail', formationId, user?.id] })
    },
    onError: (mutationError) => {
      if (isPostgrestError(mutationError) && mutationError.code === '23505') {
        toast.info(t('formationDetail.alreadyOnWaitlist'))
        queryClient.invalidateQueries({ queryKey: ['formation-detail', formationId, user?.id] })
        return
      }
      const message = isPostgrestError(mutationError)
        ? mutationError.message
        : mutationError instanceof Error
          ? mutationError.message
          : t('formationDetail.joinWaitlistFailed')
      toast.error(message)
    },
  })

  const [enrollingPathId, setEnrollingPathId] = useState<string | null>(null)

  const enrollMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!user) throw new Error(t('dashboard.mustLoginToEnroll'))
      const { error } = await supabase
        .from('user_enrollments')
        .insert({ user_id: user.id, learning_path_id: pathId })
      if (error) throw new Error(error.message || t('dashboard.errors.failedToEnroll'))
      return pathId
    },
    onMutate: (pathId) => setEnrollingPathId(pathId),
    onSuccess: () => {
      toast.success(t('dashboard.enrollSuccess'))
      queryClient.invalidateQueries({ queryKey: ['formation-detail', formationId, user?.id] })
      queryClient.invalidateQueries({ queryKey: ['availablePaths'] })
      queryClient.invalidateQueries({ queryKey: ['myPaths'] })
      queryClient.invalidateQueries({ queryKey: ['pathOverview'] })
    },
    onError: (err) => {
      console.error('Enroll error:', err)
      toast.error(t('dashboard.enrollError'))
    },
    onSettled: () => setEnrollingPathId(null),
  })

  const handleEnroll = (pathId: string) => {
    if (!user) {
      toast.error(t('dashboard.mustLoginToEnroll'))
      return
    }
    enrollMutation.mutate(pathId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="h-10 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-1/2 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full rounded bg-gray-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !formation) {
    return (
      <div className="space-y-6">
        <Link to={R.DASHBOARD_FORMATIONS} className="inline-flex items-center gap-2 text-sm text-forge-orange hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t('formationDetail.backToFormations')}
        </Link>
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="p-8 text-center text-forge-gray">
            {error instanceof Error ? error.message : t('formationDetail.loadError')}
          </CardContent>
        </Card>
      </div>
    )
  }

  const isComingSoon = formation.status === 'coming_soon'
  const joinDisabled = joinWaitingListMutation.isPending || formation.isUserOnWaitlist
  const firstPublishedPath = formation.paths.find((path) => path.status === 'published')
  const formationEnrolled = formation.enrolledPathIds.length > 0
  const firstPathEnrolled = firstPublishedPath ? formation.enrolledPathIds.includes(firstPublishedPath.id) : false

  // Categorize paths
  const inProgressPaths = formation.paths.filter(
    (p) => formation.enrolledPathIds.includes(p.id) && formation.pathProgress[p.id] === 'in_progress'
  )
  const completedPaths = formation.paths.filter(
    (p) => formation.enrolledPathIds.includes(p.id) && formation.pathProgress[p.id] === 'completed'
  )
  const availablePaths = formation.paths.filter(
    (p) => p.status === 'published' && !formation.enrolledPathIds.includes(p.id)
  )
  const comingSoonPaths = formation.paths.filter(
    (p) => p.status === 'coming_soon' || p.status === 'draft'
  )

  // Progress stats
  const totalPaths = formation.paths.length
  const completedCount = completedPaths.length
  const inProgressCount = inProgressPaths.length
  const progressPercentage = totalPaths > 0 ? Math.round((completedCount / totalPaths) * 100) : 0

  // Helper to render a path card
  const renderPathCard = (path: FormationPathItem) => {
    const pathIsComingSoon = path.status === 'coming_soon'
    const pathIsDraft = path.status === 'draft'
    const isEnrolled = formation.enrolledPathIds.includes(path.id)
    const courseCount = path.courses?.length ?? 0
    const courses = path.courses ?? []
    const pathProgressStatus = formation.pathProgress[path.id]

    return (
      <Card
        key={path.id}
        className={cn(
          'relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full min-h-[480px] flex flex-col group',
          (pathIsComingSoon || pathIsDraft) && 'opacity-70 cursor-not-allowed'
        )}
      >
        {/* Thumbnail */}
        <div
          className="h-48 flex items-center justify-center relative"
          style={{ backgroundColor: pathIsComingSoon || pathIsDraft ? '#4a5a4a' : '#303b2e' }}
        >
          <Layers3 className="h-16 w-16 text-forge-orange" />

          {/* Badges */}
          {pathProgressStatus === 'completed' && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="success" size="sm" icon={Flame} iconPosition="left">
                {t('filters.progressOptions.completed')}
              </Badge>
            </div>
          )}
          {pathProgressStatus === 'in_progress' && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="enrolled" size="sm" icon={CirclePlay} iconPosition="left">
                {t('filters.progressOptions.in_progress')}
              </Badge>
            </div>
          )}
          {path.status === 'published' && !isEnrolled && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="default" size="sm" icon={CheckCircle} iconPosition="left">
                {t('filters.statusOptions.available')}
              </Badge>
            </div>
          )}
          {path.status === 'coming_soon' && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="coming-soon" size="sm" icon={Clock} iconPosition="left">
                {t('filters.statusOptions.coming_soon')}
              </Badge>
            </div>
          )}
          {path.status === 'draft' && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" size="sm">
                {t('filters.statusOptions.draft')}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="flex-1 min-h-0 flex flex-col">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              {path.title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookMarked className="h-4 w-4" />
              {t('dashboard.availablePaths.courses', { count: courseCount })}
            </div>
          </div>

          {/* Courses preview */}
          {courses.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">
                {t('dashboard.availablePaths.coursesLabel')}
              </h4>
              <div className="space-y-1">
                {courses.slice(0, 3).map((course, idx) => (
                  <div key={course.id} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-forge-orange font-medium">{idx + 1}.</span>
                    <span className="truncate">{course.title}</span>
                  </div>
                ))}
                {courses.length > 3 && (
                  <div className="text-xs text-gray-500">
                    {t('dashboard.availablePaths.moreCourses', { count: courses.length - 3 })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {path.status === 'published' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link to={R.DASHBOARD_LEARN_PATH(path.id)} className="flex-1 min-w-0">
                <EnhancedButton
                  variant="outline"
                  className="w-full !bg-white hover:!bg-gray-50 hover:!text-forge-orange"
                >
                  {t('dashboard.availablePaths.viewPath')}
                </EnhancedButton>
              </Link>
              {isEnrolled ? (
                <Link to={R.DASHBOARD_LEARN_PATH(path.id)} className="flex-1 min-w-0">
                  <EnhancedButton className="w-full">
                    {t('common.buttons.continue')}
                  </EnhancedButton>
                </Link>
              ) : (
                <div className="flex-1 min-w-0">
                  <EnhancedButton
                    className="w-full"
                    onClick={() => handleEnroll(path.id)}
                    disabled={!user || enrollingPathId === path.id}
                  >
                    {enrollingPathId === path.id
                      ? t('dashboard.enrolling')
                      : t('dashboard.enroll')}
                  </EnhancedButton>
                </div>
              )}
            </div>
          )}
          {(pathIsComingSoon || pathIsDraft) && (
            <div className="mt-4">
              <EnhancedButton variant="ghost" className="w-full" disabled>
                {pathIsComingSoon
                  ? t('filters.statusOptions.coming_soon')
                  : t('formationDetail.notYetPublished')}
              </EnhancedButton>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link to={R.DASHBOARD_FORMATIONS} className="inline-flex items-center gap-2 text-sm text-forge-orange hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t('formationDetail.backToFormations')}
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-forge-dark">{formation.title}</h1>
              <Badge
                variant={isComingSoon ? 'coming-soon' : formationEnrolled && formation.status === 'published' ? 'enrolled' : formation.status === 'published' ? 'available' : 'outline'}
                icon={formationEnrolled && formation.status === 'published' ? CirclePlay : formation.status === 'published' ? CircleCheckBig : undefined}
                iconPosition="left"
              >
                {isComingSoon ? t('filters.statusOptions.coming_soon') : formationEnrolled && formation.status === 'published' ? t('dashboard.enrolled') : formation.status === 'published' ? t('filters.statusOptions.available') : t('filters.statusOptions.draft')}
              </Badge>
            </div>
            <p className="text-forge-gray max-w-2xl">
              {formation.description || t('formationDetail.descriptionFallback')}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-forge-gray">
              <span className="inline-flex items-center gap-1"><Layers3 className="h-4 w-4" />{t('formationDetail.learningPathsCount', { count: formation.paths.length })}</span>
              {isComingSoon && (
                <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{formation.waitingListCount} {t('formationDetail.onWaitingList')}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isComingSoon ? (
              <>
                <EnhancedButton
                  onClick={() => joinWaitingListMutation.mutate()}
                  disabled={joinDisabled || !user}
                  className="min-w-[220px]"
                  variant={formation.isUserOnWaitlist ? 'outline' : 'primary'}
                >
                  {formation.isUserOnWaitlist
                    ? t('formationDetail.onWaitlist')
                    : joinWaitingListMutation.isPending
                      ? t('formationDetail.joining')
                      : user
                        ? t('formationDetail.joinWaitlist')
                        : t('formationDetail.signInToJoin')}
                </EnhancedButton>
                {!user && (
                  <p className="text-xs text-muted-foreground text-right">
                    You must be signed in to join the waiting list.
                  </p>
                )}
                <p className="text-xs text-muted-foreground max-w-xs">
                  We will notify you as soon as this formation opens for enrollment.
                </p>
              </>
            ) : firstPublishedPath ? (
              <Link to={R.DASHBOARD_LEARN_PATH(firstPublishedPath.id)}>
                <EnhancedButton className="min-w-[220px]" withGradient>
                  {firstPathEnrolled ? t('common.buttons.continue') : t('formationDetail.startLearning')}
                </EnhancedButton>
              </Link>
            ) : (
              <EnhancedButton className="min-w-[220px]" variant="outline" disabled>
                {t('formationDetail.pathsComingSoon')}
              </EnhancedButton>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview - only show if user has enrolled in at least one path */}
      {formationEnrolled && (
        <section className="space-y-4">
          <Card className="bg-gradient-to-r from-forge-cream/50 to-white border-forge-cream/70">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-forge-orange/10">
                    <TrendingUp className="h-8 w-8 text-forge-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-forge-dark">{t('formationDetail.formationProgress')}</h3>
                    <p className="text-sm text-forge-gray">
                      {t('formationDetail.pathsCompleted', { completed: completedCount, total: totalPaths })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-full md:w-48 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-forge-orange h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-forge-orange whitespace-nowrap">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* In Progress Paths */}
      {inProgressPaths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CirclePlay className="h-5 w-5 text-forge-orange" />
            <h2 className="text-xl font-semibold text-forge-dark">{t('formationDetail.inProgressPaths')}</h2>
            <Badge variant="outline" className="ml-2">{inProgressPaths.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {inProgressPaths.map(renderPathCard)}
          </div>
        </section>
      )}

      {/* Completed Paths */}
      {completedPaths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-forge-dark">{t('formationDetail.completedPaths')}</h2>
            <Badge variant="success" className="ml-2">{completedPaths.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {completedPaths.map(renderPathCard)}
          </div>
        </section>
      )}

      {/* Available Paths */}
      {availablePaths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-forge-dark">{t('formationDetail.availablePaths')}</h2>
            <Badge variant="default" className="ml-2">{availablePaths.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {availablePaths.map(renderPathCard)}
          </div>
        </section>
      )}

      {/* Coming Soon Paths */}
      {comingSoonPaths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-forge-dark">{t('formationDetail.comingSoonPaths')}</h2>
            <Badge variant="coming-soon" className="ml-2">{comingSoonPaths.length}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
            {comingSoonPaths.map(renderPathCard)}
          </div>
        </section>
      )}

      {/* Empty state when no paths at all */}
      {formation.paths.length === 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-forge-dark">{t('formationDetail.includedPaths')}</h2>
          <Card className="border-dashed border-forge-cream/70 bg-white/70">
            <CardContent className="p-8 text-center text-forge-gray">
              {t('formationDetail.pathsAddedSoon')}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
