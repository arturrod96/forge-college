import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { BookOpen, Clock, HelpCircle, PlayCircle, Trophy, Users, Flame } from 'lucide-react'
import EnhancedButton from '@/components/ui/enhanced-button'
import { designTokens } from '@/lib/design-system'

type Lesson = {
  id: string
  title: string
  lesson_type: 'text' | 'video' | 'quiz'
  xp_value: number | null
  order: number
}

type Module = {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string
  description: string | null
  order: number
  modules: Module[]
}

type LearningPath = {
  id: string
  title: string
  description: string | null
  courses: Course[]
}

type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export function PathOverview() {
  const { pathId } = useParams<{ pathId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [expandedDesc, setExpandedDesc] = useState(false)
  const [path, setPath] = useState<LearningPath | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, ProgressStatus>>({})

  useEffect(() => {
    const load = async () => {
      if (!pathId) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('learning_paths')
          .select(`
            id, title, description,
            courses (
              id, title, description, order,
              modules (
                id, title, order,
                lessons ( id, title, lesson_type, xp_value, order )
              )
            )
          `)
          .eq('id', pathId)
          .single()

        if (error) throw error

        // Ordenação para experiência consistente
        data.courses.sort((a: Course, b: Course) => a.order - b.order)
        data.courses.forEach((c: Course) => {
          c.modules.sort((a, b) => a.order - b.order)
          c.modules.forEach((m) => m.lessons.sort((a, b) => a.order - b.order))
        })

        setPath(data as LearningPath)

        // Verificar matrícula
        if (user) {
          const { data: enr, error: enrErr } = await supabase
            .from('user_enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('learning_path_id', data.id)
            .eq('is_active', true)
            .maybeSingle()

          if (enrErr) {
            console.error(enrErr)
          } else {
            setIsEnrolled(!!enr)
          }
        }

        // Progresso do usuário
        const allLessonIds: string[] = data.courses.flatMap((c: Course) =>
          c.modules.flatMap((m: Module) => m.lessons.map((l: Lesson) => l.id))
        )

        if (user && allLessonIds.length) {
          const { data: prog, error: progErr } = await supabase
            .from('user_progress')
            .select('lesson_id, status')
            .eq('user_id', user.id)
            .in('lesson_id', allLessonIds)

          if (progErr) throw progErr

          const map: Record<string, ProgressStatus> = {}
          allLessonIds.forEach((id) => (map[id] = 'not_started'))
          ;(prog || []).forEach((p: any) => {
            map[p.lesson_id] = p.status as ProgressStatus
          })
          setProgressMap(map)
        } else {
          setProgressMap({})
        }
      } catch (e) {
        console.error(e)
        toast.error('Erro ao carregar a trilha.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [pathId, user])

  const metrics = useMemo(() => {
    if (!path) return null

    const lessons = path.courses.flatMap((c) => c.modules.flatMap((m) => m.lessons))
    const totalLessons = lessons.length
    const completed = lessons.filter((l) => progressMap[l.id] === 'completed').length
    const videos = lessons.filter((l) => l.lesson_type === 'video').length
    const quizzes = lessons.filter((l) => l.lesson_type === 'quiz').length
    const totalXP = lessons.reduce((acc, l) => acc + (l.xp_value || 0), 0)

    const hours = Math.max(1, Math.round((totalLessons * 10) / 60))

    const findNextCourseId = (): string | null => {
      for (const course of path.courses) {
        const clessons = course.modules.flatMap((m) => m.lessons)
        const done = clessons.filter((l) => progressMap[l.id] === 'completed').length
        if (done < clessons.length) return course.id
      }
      return path.courses[0]?.id || null
    }

    const coursesProgress = path.courses.map((course) => {
      const clessons = course.modules.flatMap((m) => m.lessons)
      const done = clessons.filter((l) => progressMap[l.id] === 'completed').length
      const pct = clessons.length ? Math.round((done / clessons.length) * 100) : 0
      return { courseId: course.id, percent: pct, completed: done, total: clessons.length }
    })

    return {
      totalLessons,
      completed,
      videos,
      quizzes,
      totalXP,
      hours,
      nextCourseId: findNextCourseId(),
      coursesProgress
    }
  }, [path, progressMap])

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para se matricular.')
      return
    }
    if (!path) return
    try {
      setEnrolling(true)
      const { error } = await supabase.from('user_enrollments').insert({
        user_id: user.id,
        learning_path_id: path.id
      })
      if (error) throw error
      setIsEnrolled(true)
      toast.success('Matrícula realizada com sucesso!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao realizar matrícula.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleContinue = () => {
    if (!isEnrolled) {
      toast.error('Matricule-se para começar.')
      return
    }
    if (metrics?.nextCourseId) {
      navigate(`/dashboard/learn/course/${metrics.nextCourseId}`)
    } else {
      toast.info('Nada para continuar no momento.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Carregando trilha...</div>
      </div>
    )
  }

  if (!path) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-600">Trilha não encontrada.</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 relative">
      {/* Decorative background like landing page */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-10 -left-6 w-40 h-40 bg-forge-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-10 w-56 h-56 bg-forge-cream/80 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="mb-8 rounded-3xl overflow-hidden border border-forge-cream bg-gradient-to-br from-forge-cream to-forge-cream/50">
        <div className="p-6 md:p-8 relative">
          <div className="absolute -top-4 -left-4 opacity-10"><Flame className="text-forge-orange" size={72} /></div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1 rounded-xl text-xs font-medium text-forge-dark border border-forge-cream">
                <BookOpen className="h-4 w-4 text-forge-orange" /> Trilha
              </div>
              <h1 className="mt-3 text-forge-dark font-bold text-3xl md:text-4xl tracking-tight">{path.title}</h1>
              <p className="mt-2 text-forge-gray md:max-w-3xl">
                {expandedDesc ? path.description : (path.description || '').slice(0, 180)}
                {path.description && path.description.length > 180 && (
                  <>
                    {!expandedDesc && '... '}
                    <button className="text-forge-orange hover:underline ml-1" onClick={() => setExpandedDesc((v) => !v)}>
                      {expandedDesc ? 'Ler menos' : 'Ler mais'}
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <EnhancedButton onClick={handleContinue} disabled={!isEnrolled} size="lg" variant={isEnrolled ? 'primary' : 'secondary'} withGradient>
                {isEnrolled ? 'Continuar' : 'Matricule-se para começar'}
              </EnhancedButton>
              {!isEnrolled && (
                <EnhancedButton variant="outline" size="lg" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Matriculando...' : 'Matricular'}
                </EnhancedButton>
              )}
            </div>
          </div>

          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-3 py-2 text-sm text-forge-dark border border-forge-cream"><HelpCircle className="h-4 w-4 text-forge-orange" />Básico</div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-3 py-2 text-sm text-forge-dark border border-forge-cream"><Clock className="h-4 w-4 text-forge-orange" />{metrics.hours} h</div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-3 py-2 text-sm text-forge-dark border border-forge-cream"><PlayCircle className="h-4 w-4 text-forge-orange" />{metrics.videos} vídeos</div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-3 py-2 text-sm text-forge-dark border border-forge-cream"><BookOpen className="h-4 w-4 text-forge-orange" />{metrics.quizzes} exercícios</div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-xl px-3 py-2 text-sm text-forge-dark border border-forge-cream"><Trophy className="h-4 w-4 text-forge-orange" />{metrics.totalXP} XP</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {path.courses.map((course) => {
          const cp = metrics?.coursesProgress.find((p) => p.courseId === course.id) || {
            percent: 0,
            completed: 0,
            total: course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
          }
          return (
            <Card key={course.id} className={`border-forge-cream hover:shadow-md transition-shadow ${cp.percent > 0 && cp.percent < 100 ? 'ring-1 ring-forge-orange/20' : ''}`}>
              <CardHeader className="flex gap-2">
                <CardTitle className="text-lg text-forge-dark">{course.title}</CardTitle>
                {course.description && <CardDescription className="text-forge-gray">{course.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={cp.percent} />
                <div className="text-sm text-forge-gray">{cp.percent}% concluído • {cp.completed}/{cp.total} lições</div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/dashboard/learn/course/${course.id}`}>
                    <EnhancedButton variant="ghost">Ver curso</EnhancedButton>
                  </Link>
                  {cp.percent < 100 && (
                    <EnhancedButton onClick={() => navigate(`/dashboard/learn/course/${course.id}`)}>
                      Continuar
                    </EnhancedButton>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-10 text-sm text-forge-gray flex items-center gap-2">
        <Users className="h-4 w-4 text-forge-orange" />
        Milhares de participantes já estão aprendendo nesta trilha.
      </div>
    </div>
  )
}

export default PathOverview


