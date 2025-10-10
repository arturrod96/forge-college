import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowUpRight, ExternalLink, FolderGit2 } from 'lucide-react'

export interface ModuleProject {
  id: string
  title: string
  description: string | null
  project_order: number
}

export interface ProjectSubmissionSummary {
  repository_url: string
  submitted_at: string | null
}

interface ModuleProjectsPanelProps {
  moduleTitle: string
  projects: ModuleProject[]
  submissions: Record<string, ProjectSubmissionSummary | undefined>
  submittingProjectId: string | null
  onSubmit: (projectId: string, repositoryUrl: string) => Promise<void>
  communityLink: string
}

const sanitizeHtml = (value: string) => value.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

export function ModuleProjectsPanel({
  moduleTitle,
  projects,
  submissions,
  submittingProjectId,
  onSubmit,
  communityLink,
}: ModuleProjectsPanelProps) {
  const { t } = useTranslation()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const activeProject = useMemo(() => projects.find((project) => project.id === activeProjectId) ?? null, [
    activeProjectId,
    projects,
  ])

  useEffect(() => {
    if (!activeProject) {
      setRepositoryUrl('')
      setError(null)
      return
    }
    const submission = submissions[activeProject.id]
    setRepositoryUrl(submission?.repository_url ?? '')
    setError(null)
  }, [activeProject, submissions])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeProject) return

    if (!repositoryUrl.trim()) {
      setError(t('projects.errors.required'))
      return
    }

    try {
      const parsed = new URL(repositoryUrl.trim())
      if (!parsed.hostname.includes('github.com')) {
        setError(t('projects.errors.githubOnly'))
        return
      }
    } catch (error) {
      console.error('Invalid repository url', error)
      setError(t('projects.errors.invalidUrl'))
      return
    }

    setError(null)
    try {
      await onSubmit(activeProject.id, repositoryUrl.trim())
      setActiveProjectId(null)
    } catch (error) {
      console.error('Project submission failed', error)
      setError(t('projects.errors.submitFailed'))
    }
  }

  if (projects.length === 0) {
    return (
      <Card className="border border-dashed border-forge-cream/70 bg-white/80">
        <CardContent className="flex items-center justify-between gap-3 p-5 text-sm text-forge-gray">
          <span>{t('projects.module.noProjects')}</span>
          <Button asChild variant="outline" size="sm">
            <Link to={communityLink}>
              {t('projects.module.communityLink')}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-forge-cream/70 bg-white/90">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-forge-dark">
            <FolderGit2 className="h-5 w-5 text-forge-orange" />
            {t('projects.module.title', { module: moduleTitle })}
          </CardTitle>
          <p className="text-sm text-forge-gray">{t('projects.module.subtitle')}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={communityLink}>
            {t('projects.module.communityLink')}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => {
          const submission = submissions[project.id]
          return (
            <div
              key={project.id}
              className="rounded-lg border border-forge-cream/60 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-forge-orange/10 px-2 py-0.5 text-xs font-medium text-forge-orange">
                      {t('projects.module.projectOrder', { order: project.project_order })}
                    </span>
                    <h3 className="text-lg font-semibold text-forge-dark">{project.title}</h3>
                  </div>
                  {project.description && (
                    <div
                      className="prose prose-sm max-w-none text-forge-gray"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                    />
                  )}
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <Button onClick={() => setActiveProjectId(project.id)}>
                    {submission
                      ? t('projects.module.updateSubmission')
                      : t('projects.module.startProject')}
                  </Button>
                  {submission && (
                    <div className="text-xs text-forge-gray/80">
                      {t('projects.module.yourSubmission')}{' '}
                      <a
                        href={submission.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-forge-orange hover:underline"
                      >
                        {submission.repository_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>

      <Dialog open={Boolean(activeProject)} onOpenChange={(open) => !open && setActiveProjectId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeProject ? t('projects.module.dialog.title', { project: activeProject.title }) : ''}
            </DialogTitle>
            <DialogDescription>{t('projects.module.dialog.subtitle')}</DialogDescription>
          </DialogHeader>

          {activeProject && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {activeProject.description && (
                <Textarea
                  className="h-48 resize-none"
                  value={sanitizeHtml(activeProject.description)}
                  readOnly
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-forge-dark" htmlFor="repository-url">
                  {t('projects.module.dialog.repositoryLabel')}
                </label>
                <Input
                  id="repository-url"
                  value={repositoryUrl}
                  onChange={(event) => setRepositoryUrl(event.target.value)}
                  placeholder={t('projects.module.dialog.repositoryPlaceholder')}
                />
                <p className="text-xs text-forge-gray/80">
                  {t('projects.module.dialog.repositoryHelp')}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setActiveProjectId(null)}>
                  {t('common.buttons.cancel')}
                </Button>
                <Button type="submit" disabled={submittingProjectId === activeProject.id}>
                  {submittingProjectId === activeProject.id
                    ? t('projects.module.dialog.submitting')
                    : t('projects.module.dialog.submit')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ModuleProjectsPanel
