import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import { useAuth } from '@/hooks/useOAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, BookOpen, Users, Clock, CircleCheckBig } from 'lucide-react'
import * as R from '@/routes/paths'
import type { Tables } from '@/types/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

type FormationPathItem = {
  id: string
  title: string
  order: number
  status: 'draft' | 'published' | 'coming_soon'
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
}

const isPostgrestError = (value: unknown): value is PostgrestError =>
  typeof value === 'object' && value !== null && 'code' in value && 'message' in value

export default function FormationDetailPage() {
  const { formationId } = useParams<{ formationId: string }>()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()
  const { user } = useAuth()

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
            learning_paths(id, title, status)
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
          return {
            id: fp.learning_paths.id,
            title: fp.learning_paths.title,
            order: fp.order ?? 0,
            status: fp.learning_paths.status as FormationPathItem['status'],
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
      }
    },
  })

  const joinWaitingListMutation = useMutation({
    mutationFn: async () => {
      if (!formationId) throw new Error('Formation not found')
      if (!user) {
        throw new Error('You need to be logged in to join the waiting list')
      }

      const { error: insertError } = await supabase.from('waiting_list').insert({
        formation_id: formationId,
        user_id: user.id,
        email: user.email ?? '',
      })

      if (insertError) throw insertError
    },
    onSuccess: () => {
      toast.success('You have been added to the waiting list for this formation')
      queryClient.invalidateQueries({ queryKey: ['formation-detail', formationId, user?.id] })
    },
    onError: (mutationError) => {
      if (isPostgrestError(mutationError) && mutationError.code === '23505') {
        toast.info('You are already on the waiting list for this formation')
        queryClient.invalidateQueries({ queryKey: ['formation-detail', formationId, user?.id] })
        return
      }
      const message = isPostgrestError(mutationError)
        ? mutationError.message
        : mutationError instanceof Error
          ? mutationError.message
          : 'Failed to join waiting list'
      toast.error(message)
    },
  })

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
          <ArrowLeft className="h-4 w-4" /> Back to formations
        </Link>
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="p-8 text-center text-forge-gray">
            {error instanceof Error ? error.message : 'We could not load this formation.'}
          </CardContent>
        </Card>
      </div>
    )
  }

  const createdAtDistance = formation.created_at
    ? formatDistanceToNow(new Date(formation.created_at), { addSuffix: true })
    : null

  const publishedAtDistance = formation.published_at
    ? formatDistanceToNow(new Date(formation.published_at), { addSuffix: true })
    : null

  const isComingSoon = formation.status === 'coming_soon'
  const joinDisabled = joinWaitingListMutation.isPending || formation.isUserOnWaitlist
  const firstPublishedPath = formation.paths.find((path) => path.status === 'published')

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link to={R.DASHBOARD_FORMATIONS} className="inline-flex items-center gap-2 text-sm text-forge-orange hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to formations
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-forge-dark">{formation.title}</h1>
              <Badge 
                variant={isComingSoon ? 'coming-soon' : formation.status === 'published' ? 'available' : 'outline'}
                icon={formation.status === 'published' ? CircleCheckBig : undefined}
                iconPosition="left"
              >
                {isComingSoon ? 'Coming soon' : formation.status === 'published' ? 'Available' : 'Draft'}
              </Badge>
            </div>
            <p className="text-forge-gray max-w-2xl">
              {formation.description || 'Explore the curated learning paths included in this formation.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-forge-gray">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" />{formation.paths.length} learning paths</span>
              {isComingSoon && (
                <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{formation.waitingListCount} on waiting list</span>
              )}
              {createdAtDistance && (
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />Created {createdAtDistance}</span>
              )}
              {publishedAtDistance && (
                <span className="inline-flex items-center gap-1 text-forge-orange">
                  <Clock className="h-4 w-4" />Published {publishedAtDistance}
                </span>
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
                    ? 'You are on the waiting list'
                    : joinWaitingListMutation.isPending
                      ? 'Joining...'
                      : user
                        ? 'Join the waiting list'
                        : 'Sign in to join'}
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
                  Start learning
                </EnhancedButton>
              </Link>
            ) : (
              <EnhancedButton className="min-w-[220px]" variant="outline" disabled>
                Paths coming soon
              </EnhancedButton>
            )}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-forge-dark">Included learning paths</h2>
        {formation.paths.length === 0 ? (
          <Card className="border-dashed border-forge-cream/70 bg-white/70">
            <CardContent className="p-8 text-center text-forge-gray">
              Learning paths will be added to this formation soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {formation.paths.map((path, index) => (
              <Card key={path.id} className="flex flex-col border border-forge-cream/70 bg-white/80">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-forge-orange">{index + 1}</span>
                    <Badge 
                      variant={path.status === 'published' ? 'available' : path.status === 'coming_soon' ? 'coming-soon' : 'outline'}
                      icon={path.status === 'published' ? CircleCheckBig : undefined}
                      iconPosition="left"
                    >
                      {path.status === 'published' ? 'Available' : path.status === 'coming_soon' ? 'Coming soon' : 'Draft'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight text-forge-dark">
                    {path.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto">
                  {path.status === 'published' ? (
                    <Link to={R.DASHBOARD_LEARN_PATH(path.id)}>
                      <EnhancedButton variant="outline" className="w-full">View path</EnhancedButton>
                    </Link>
                  ) : (
                    <EnhancedButton variant="ghost" className="w-full" disabled>
                      {path.status === 'coming_soon' ? 'Coming soon' : 'Not yet published'}
                    </EnhancedButton>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
