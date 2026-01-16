import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createClientBrowser } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { LocalizationTabs } from '@/components/admin/LocalizationTabs'
import { TagInput } from '@/components/profile/TagInput'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'
import {
  DEFAULT_LOCALE,
  ensureLocaleMap,
  fetchSupportedLocales,
  getDefaultLocale,
  mapLocalizationsByLocale,
  type LocaleRow,
} from '@/lib/localization'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type LearningPathRow = Tables<'learning_paths'>['Row']
type LearningPathInsert = Tables<'learning_paths'>['Insert']
type FormationRow = Tables<'formations'>['Row']
type FormationPathRow = Tables<'formation_paths'>['Row']

interface LearningPathWithMeta extends LearningPathRow {
  courses_count?: number
  courses?: { id: string }[]
  formation_id?: string | null
  order?: number | null
}

const pathSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  is_published: z.boolean(),
  status: z.enum(['draft', 'published', 'coming_soon']),
  formation_id: z.string().optional().or(z.literal('')),
  order: z.number().int().min(1).optional(),
})

type PathFormData = z.infer<typeof pathSchema>

export default function AdminPaths() {
  const { t } = useTranslation()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<LearningPathWithMeta | null>(null)
  const [editingPath, setEditingPath] = useState<LearningPathWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<PathFormData>({
    resolver: zodResolver(pathSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      is_published: false,
      status: 'draft',
      formation_id: '',
      order: 1,
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingPath(null)
      setSlugManuallyEdited(false)
    }
  }, [dialogOpen, form])

  const watchedTitle = form.watch('title')
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingPath) {
      const generated = slugify(watchedTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [watchedTitle, slugManuallyEdited, editingPath, watchedSlug, form])

  const { data: formations } = useQuery<FormationRow[]>({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('id, title, slug')
        .order('title')

      if (error) throw error
      return data ?? []
    },
  })

  const { data: paths, isLoading } = useQuery<LearningPathWithMeta[]>({
    queryKey: ['admin-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('id, title, slug, description, is_published, published_at, created_at, updated_at, status, courses:courses(id)')
        .order('created_at', { ascending: false })

      if (error) throw error

      type QueryRow = LearningPathRow & { courses?: { id: string }[] }

      const pathsData = ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        courses_count: Array.isArray(item.courses) ? item.courses.length : 0,
      }))

      // Fetch formation relationships for each path
      const { data: formationPaths, error: formationError } = await supabase
        .from('formation_paths')
        .select('learning_path_id, formation_id, order')

      if (formationError) throw formationError

      // Map formation data to paths
      const formationMap = new Map<string, { formation_id: string; order: number }>()
      formationPaths?.forEach((fp) => {
        formationMap.set(fp.learning_path_id, {
          formation_id: fp.formation_id,
          order: fp.order,
        })
      })

      return pathsData.map((path) => {
        const formation = formationMap.get(path.id)
        return {
          ...path,
          formation_id: formation?.formation_id ?? undefined,
          order: formation?.order ?? undefined,
        }
      })
    },
  })

  const upsertMutation = useMutation({
    mutationFn: async (values: PathFormData) => {
      const trimmedTitle = values.title.trim()
      const trimmedSlug = values.slug.trim()
      const trimmedDescription = values.description?.trim()
        ? values.description.trim()
        : null

      const baseStatus = values.status
      const statusFromSelection = baseStatus === 'published' || baseStatus === 'coming_soon'
      const effectiveStatus = statusFromSelection
        ? baseStatus
        : values.is_published
          ? 'published'
          : 'draft'

      const shouldPublish = effectiveStatus !== 'draft'

      const payload: LearningPathInsert = {
        title: trimmedTitle,
        slug: trimmedSlug,
        description: trimmedDescription,
        is_published: shouldPublish,
        status: effectiveStatus,
        published_at: shouldPublish
          ? editingPath?.published_at ?? new Date().toISOString()
          : null,
      }

      let pathId: string

      if (editingPath) {
        const { error } = await supabase
          .from('learning_paths')
          .update(payload)
          .eq('id', editingPath.id)
        if (error) throw error
        pathId = editingPath.id
      } else {
        const { data, error } = await supabase.from('learning_paths').insert({
          ...payload,
          published_at: shouldPublish ? new Date().toISOString() : null,
        }).select('id')
        if (error) throw error
        pathId = data?.[0]?.id ?? ''
      }

      // Handle formation_paths relationship
      const formationId = values.formation_id && values.formation_id.trim() ? values.formation_id.trim() : null
      const order = values.order ?? 1

      if (editingPath?.formation_id || formationId) {
        // Delete existing formation_path if any
        if (editingPath?.formation_id) {
          const { error } = await supabase
            .from('formation_paths')
            .delete()
            .eq('learning_path_id', pathId)
          if (error) throw error
        }

        // Insert new formation_path if a formation is selected
        if (formationId) {
          const { error } = await supabase.from('formation_paths').insert({
            learning_path_id: pathId,
            formation_id: formationId,
            order,
          })
          if (error) throw error
        }
      } else if (formationId) {
        // Insert new formation_path if none existed before
        const { error } = await supabase.from('formation_paths').insert({
          learning_path_id: pathId,
          formation_id: formationId,
          order,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paths'] })
      toast.success(editingPath ? t('admin.paths.updated') : t('admin.paths.created'))
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving learning path:', error)
      let errorMessage = t('common.errors.unexpectedError')

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        const err = error as any
        if (err.message) {
          errorMessage = String(err.message)
        } else if (err.error) {
          errorMessage = String(err.error)
        } else if (err.details) {
          errorMessage = String(err.details)
        } else {
          errorMessage = JSON.stringify(err)
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      console.error('Formatted error message:', errorMessage)
      toast.error(errorMessage)
    },
  })

  const publishMutation = useMutation({
    mutationFn: async ({
      id,
      publish,
      previousStatus,
      previousPublishedAt,
    }: {
      id: string
      publish: boolean
      previousStatus: PathFormData['status']
      previousPublishedAt: string | null
    }) => {
      const nextStatus = publish
        ? previousStatus === 'coming_soon'
          ? 'coming_soon'
          : 'published'
        : 'draft'

      const nextIsPublished = nextStatus !== 'draft'

      const { error } = await supabase
        .from('learning_paths')
        .update({
          is_published: nextIsPublished,
          status: nextStatus,
          published_at: nextIsPublished
            ? previousPublishedAt ?? new Date().toISOString()
            : null,
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paths'] })
      toast.success('Publish state updated')
    },
    onError: (error) => {
      console.error('Error toggling publish', error)
      toast.error(error instanceof Error ? error.message : 'Failed to toggle publish state')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('learning_paths').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paths'] })
      toast.success('Learning path deleted')
      setDeleteTarget(null)
    },
    onError: (error) => {
      console.error('Error deleting learning path', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete learning path')
    },
  })

  const openForCreate = () => {
    setEditingPath(null)
    setSlugManuallyEdited(false)
    form.reset({
      title: '',
      slug: '',
      description: '',
      is_published: false,
      status: 'draft',
      formation_id: '',
      order: 1,
    })
    setDialogOpen(true)
  }

  const openForEdit = (path: LearningPathWithMeta) => {
    setEditingPath(path)
    setSlugManuallyEdited(true)
    form.reset({
      title: path.title ?? '',
      slug: path.slug ?? '',
      description: path.description ?? '',
      is_published: path.is_published,
      status: path.status ?? 'draft',
      formation_id: path.formation_id ?? '',
      order: path.order ?? 1,
    })
    setDialogOpen(true)
  }

  const onSubmit = (values: PathFormData) => {
    upsertMutation.mutate(values)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">Learning Paths</h2>
          <p className="text-sm text-forge-gray">
            Group courses into curated journeys. Control slug, visibility, and descriptions from here.
          </p>
        </div>
        <Button onClick={openForCreate} className="self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Path
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading learning paths...
          </CardContent>
        </Card>
      ) : paths && paths.length > 0 ? (
        <div className="grid gap-4">
          {paths.map((path) => (
            <Card key={path.id} className="border border-forge-cream/70 bg-white/80">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-forge-dark">
                    {path.title}
                    {path.status === 'published' ? (
                      <Badge variant="default" className="bg-forge-orange text-white hover:bg-forge-orange/90">
                        Published
                      </Badge>
                    ) : path.status === 'coming_soon' ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm text-forge-gray">
                    {path.description || 'No description'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openForEdit(path)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setDeleteTarget(path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-forge-gray">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="font-semibold text-forge-dark">Slug:</span> {path.slug}
                  </div>
                  <Separator orientation="vertical" className="hidden h-4 sm:block" />
                  <div>
                    <span className="font-semibold text-forge-dark">Courses:</span> {path.courses_count}
                  </div>
                </div>
                <div className="text-xs text-forge-gray/80">
                  Updated {path.updated_at ? formatDistanceToNow(new Date(path.updated_at), { addSuffix: true }) : 'N/A'}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Switch
                    id={`publish-${path.id}`}
                    checked={path.is_published}
                    onCheckedChange={(checked) =>
                      publishMutation.mutate({
                        id: path.id,
                        publish: checked,
                        previousStatus: path.status,
                        previousPublishedAt: path.published_at ?? null,
                      })
                    }
                    disabled={publishMutation.isPending}
                  />
                  <label htmlFor={`publish-${path.id}`} className="text-forge-gray">
                    {path.is_published ? 'Unpublish' : 'Publish'}
                  </label>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-forge-cream/70 bg-white/70">
          <CardContent className="p-8 text-center text-forge-gray">
            No learning paths yet. Create your first path to start structuring content.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPath ? 'Edit learning path' : 'New learning path'}</DialogTitle>
            <DialogDescription>
              {editingPath
                ? 'Update title, slug, or publication state. Changes go live immediately.'
                : 'Define the high-level journey for learners. You can add courses after saving.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
              <div className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development Accelerator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="web-development-accelerator"
                          {...field}
                          onChange={(event) => {
                            setSlugManuallyEdited(true)
                            field.onChange(event)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Summarize the journey learners will experience."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={(event) => {
                            const value = event.target.value as PathFormData['status']
                            field.onChange(value)
                            form.setValue('is_published', value !== 'draft', {
                              shouldDirty: true,
                            })
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="coming_soon">Coming Soon</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="formation_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formation</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        >
                          <option value="">Select a formation (optional)</option>
                          {formations?.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                              {formation.title}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order within Formation</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish immediately</FormLabel>
                        <DialogDescription>
                          {field.value
                            ? 'The path is visible to all enrolled learners.'
                            : 'Keep as draft until you are ready to publish.'}
                        </DialogDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            const currentStatus = form.getValues('status')
                            if (checked && currentStatus === 'draft') {
                              form.setValue('status', 'published', { shouldDirty: true })
                            }
                            if (!checked && currentStatus !== 'draft') {
                              form.setValue('status', 'draft', { shouldDirty: true })
                            }
                          }}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingPath ? (
                    'Save changes'
                  ) : (
                    'Create path'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete learning path</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting a path will remove all associated courses, modules, and lessons.
              Make sure you really want to remove “{deleteTarget?.title}”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
