import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createClientBrowser } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, FolderGit2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProjectSubmissionRow {
  repository_url: string
  submitted_at: string | null
  user_id: string | null
}

interface ProjectRow {
  id: string
  title: string
  description: string | null
  project_order: number
  module: {
    id: string
    title: string
    order: number | null
    course: {
      id: string
      title: string
    } | null
  } | null
  submissions: ProjectSubmissionRow[] | null
}

const stripHtml = (value: string | null | undefined) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, '').trim()
}

export function CommunityProjects() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const { t } = useTranslation()

  const { data: projects = [], isLoading } = useQuery<ProjectRow[]>({
    queryKey: ['community-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `id, title, description, project_order,
           module:modules(id, title, order, course:courses(id, title)),
           submissions:project_submissions(repository_url, submitted_at, user_id)`
        )

      if (error) throw error
      return (data ?? []) as ProjectRow[]
    },
    onError: (error) => {
      console.error('Error loading community projects', error)
      toast.error(t('projects.community.loadError'))
    },
  })

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      {
        module: NonNullable<ProjectRow['module']>
        projects: ProjectRow[]
      }
    >()

    projects.forEach((project) => {
      if (!project.module) return
      const key = project.module.id
      if (!map.has(key)) {
        map.set(key, { module: project.module, projects: [] })
      }
      map.get(key)!.projects.push(project)
    })

    return Array.from(map.values()).sort((a, b) => {
      const courseOrder = (a.module.course?.title ?? '').localeCompare(b.module.course?.title ?? '')
      if (courseOrder !== 0) return courseOrder
      const orderA = a.module.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.module.order ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return a.module.title.localeCompare(b.module.title)
    })
  }, [projects])

  if (isLoading) {
    return (
      <Card className="border border-dashed border-forge-cream/70 bg-white/90">
        <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
          <FolderGit2 className="h-5 w-5 animate-pulse text-forge-orange" />
          {t('projects.community.loading')}
        </CardContent>
      </Card>
    )
  }

  if (grouped.length === 0) {
    return (
      <Card className="border border-dashed border-forge-cream/70 bg-white/90">
        <CardContent className="space-y-2 p-8 text-center text-forge-gray">
          <h2 className="text-xl font-semibold text-forge-dark">{t('projects.community.title')}</h2>
          <p className="text-sm">{t('projects.community.empty')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-forge-dark">{t('projects.community.title')}</h1>
        <p className="text-sm text-forge-gray">{t('projects.community.subtitle')}</p>
      </div>

      <div className="grid gap-5">
        {grouped.map(({ module, projects }) => (
          <Card key={module.id} className="border border-forge-cream/70 bg-white/90">
            <CardHeader className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl text-forge-dark">{module.title}</CardTitle>
                <Badge variant="secondary" className="bg-forge-cream text-forge-dark">
                  {t('projects.community.courseLabel', { course: module.course?.title ?? t('projects.community.unknownCourse') })}
                </Badge>
              </div>
              <p className="text-xs text-forge-gray/80">
                {t('projects.community.projectCount', { count: projects.length })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects
                .slice()
                .sort((a, b) => (a.project_order ?? 0) - (b.project_order ?? 0))
                .map((project) => {
                  const submissions = project.submissions ?? []
                  return (
                    <div
                      key={project.id}
                      className="rounded-lg border border-forge-cream/60 bg-white/80 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-forge-orange text-forge-orange">
                            {t('projects.community.projectOrder', { order: project.project_order })}
                          </Badge>
                          <h3 className="text-lg font-semibold text-forge-dark">{project.title}</h3>
                        </div>
                        {project.description && (
                          <p className="text-sm text-forge-gray/90">{stripHtml(project.description)}</p>
                        )}

                        {submissions.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-forge-cream/70 bg-forge-cream/30 p-4 text-sm text-forge-gray">
                            {t('projects.community.noSubmissions')}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-forge-dark">
                              {t('projects.community.submissions', { count: submissions.length })}
                            </p>
                            <ul className="space-y-2">
                              {submissions.map((submission, index) => (
                                <li
                                  key={`${project.id}-${index}-${submission.repository_url}`}
                                  className="flex flex-col gap-1 rounded-md border border-forge-cream/60 bg-white/70 p-3 text-sm text-forge-gray"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <a
                                      href={submission.repository_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-forge-orange hover:underline"
                                    >
                                      {submission.repository_url}
                                    </a>
                                    <Button variant="ghost" size="sm" asChild>
                                      <a
                                        href={submission.repository_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs"
                                      >
                                        {t('projects.community.visitRepository')}
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                  <div className="text-xs text-forge-gray/70">
                                    {t('projects.community.submittedBy', {
                                      user: submission.user_id ? `${submission.user_id.slice(0, 6)}…${submission.user_id.slice(-4)}` : t('projects.community.anonymous'),
                                      date: submission.submitted_at
                                        ? new Date(submission.submitted_at).toLocaleString()
                                        : t('projects.community.dateUnknown'),
                                    })}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CommunityProjects
