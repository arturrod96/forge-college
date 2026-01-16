import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Loader2, Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { LearningPathSelector } from '@/components/admin/LearningPathSelector'
import { LocalizationTabs } from '@/components/admin/LocalizationTabs'
import { TagInput } from '@/components/profile/TagInput'
import {
  DEFAULT_LOCALE,
  ensureLocaleMap,
  fetchSupportedLocales,
  getDefaultLocale,
  mapLocalizationsByLocale,
  type LocaleRow,
} from '@/lib/localization'

type FormationRow = Tables<'formations'>['Row']
type FormationInsert = Tables<'formations'>['Insert']
type FormationPathRow = Tables<'formation_paths'>['Row']
type LearningPathRow = Tables<'learning_paths'>['Row']

type FormationWithMeta = FormationRow & {
  paths_count?: number
  paths?: Array<{
    id: string
    title: string
    order: number
  }>
  formation_localizations: Tables<'formation_localizations'>[] | null
}

type FormationLocalizationFormState = {
  title: string
  description: string
  thumbnailUrl: string
  tags: string[]
  isPublished: boolean
  publishedAt: string | null
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const formationSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must include at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  status: z.enum(['draft', 'published', 'coming_soon']),
})

type FormationFormValues = z.infer<typeof formationSchema>

export function AdminFormations() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const { data: locales = [], isLoading: localesLoading } = useQuery<LocaleRow[]>({
    queryKey: ['content-locales'],
    queryFn: async () => fetchSupportedLocales(supabase),
  })

  const defaultLocaleCode = useMemo(() => getDefaultLocale(locales), [locales])
  const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE)
  const [localizationDrafts, setLocalizationDrafts] = useState<Record<string, FormationLocalizationFormState>>({})

  useEffect(() => {
    if (locales.length > 0) {
      setActiveLocale((current) => (locales.some((locale) => locale.code === current) ? current : defaultLocaleCode))
    }
  }, [locales, defaultLocaleCode])

  const createEmptyLocalizationDraft = useCallback(
    (): FormationLocalizationFormState => ({
      title: '',
      description: '',
      thumbnailUrl: '',
      tags: [],
      isPublished: false,
      publishedAt: null,
    }),
    []
  )

  const deserializeLocalization = useCallback(
    (record?: Tables<'formation_localizations'>): FormationLocalizationFormState => ({
      title: record?.title ?? '',
      description: record?.description ?? '',
      thumbnailUrl: record?.thumbnail_url ?? '',
      tags: record?.tags ?? [],
      isPublished: record?.is_published ?? false,
      publishedAt: record?.published_at ?? null,
    }),
    []
  )

  const updateLocalizationDraft = useCallback(
    (locale: string, updater: (draft: FormationLocalizationFormState) => FormationLocalizationFormState) => {
      setLocalizationDrafts((previous) => {
        const current = previous[locale] ?? createEmptyLocalizationDraft()
        return {
          ...previous,
          [locale]: updater(current),
        }
      })
    },
    [createEmptyLocalizationDraft]
  )

  const initializeLocalizationDrafts = useCallback(
    (formation?: FormationWithMeta) => {
      if (locales.length === 0) return
      const existingRecords = formation ? mapLocalizationsByLocale(formation.formation_localizations ?? []) : {}
      const mapped = Object.fromEntries(
        Object.entries(existingRecords).map(([localeCode, record]) => [localeCode, deserializeLocalization(record)])
      )
      const drafts = ensureLocaleMap(locales, mapped, () => createEmptyLocalizationDraft())
      setLocalizationDrafts(drafts)
      setActiveLocale(getDefaultLocale(locales))
    },
    [locales, deserializeLocalization, createEmptyLocalizationDraft]
  )

  const localeLabels = useMemo(
    () =>
      locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale.code] = locale.label
        return acc
      }, {}),
    [locales]
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFormation, setEditingFormation] = useState<FormationWithMeta | null>(null)
  const [deletingFormation, setDeletingFormation] = useState<FormationWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [selectedPathsState, setSelectedPathsState] = useState<Array<{ id: string; title: string; order: number }>>([])

  const form = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      slug: '',
      status: 'draft',
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset({ slug: '', status: 'draft' })
      setEditingFormation(null)
      setSlugManuallyEdited(false)
      setLocalizationDrafts({})
      setActiveLocale(defaultLocaleCode)
      setSelectedPathsState([])
    }
  }, [dialogOpen, form, defaultLocaleCode])

  useEffect(() => {
    if (dialogOpen && editingFormation) {
      const orderedPaths = editingFormation.paths?.slice().sort((a, b) => a.order - b.order) ?? []
      setSelectedPathsState(orderedPaths)
    }
  }, [dialogOpen, editingFormation])

  useEffect(() => {
    if (!deleteDialogOpen) {
      setDeletingFormation(null)
    }
  }, [deleteDialogOpen])

  const defaultLocaleTitle = localizationDrafts[defaultLocaleCode]?.title ?? ''
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingFormation) {
      const generated = slugify(defaultLocaleTitle)
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [defaultLocaleTitle, slugManuallyEdited, editingFormation, watchedSlug, form])

  type FormationQueryRow = FormationRow & {
    formation_paths?: Array<
      Pick<FormationPathRow, 'order'> & {
        learning_paths: Pick<LearningPathRow, 'id' | 'title'> | null
      }
    > | null
    formation_localizations: Tables<'formation_localizations'>[] | null
  }

  const { data: formations, isLoading } = useQuery<FormationWithMeta[]>({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select(`
          id,
          title,
          slug,
          description,
          is_published,
          status,
          published_at,
          created_at,
          updated_at,
          formation_localizations(*),
          formation_paths(
            order,
            learning_paths(id, title)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = (data ?? []) as FormationQueryRow[]

      return rows.map((formation) => {
        const { formation_paths: rawPaths = [], ...rest } = formation

        const paths = rawPaths
          .map((fp) => {
            if (!fp.learning_paths) return null
            return {
              id: fp.learning_paths.id,
              title: fp.learning_paths.title,
              order: fp.order ?? 0,
            }
          })
          .filter((path): path is { id: string; title: string; order: number } => Boolean(path))
          .sort((a, b) => a.order - b.order)

        return {
          ...rest,
          paths_count: paths.length,
          paths,
        }
      })
    },
  })

  const upsertMutation = useMutation({
    mutationFn: async (values: FormationFormValues) => {
      if (!locales.length) {
        throw new Error('Configure locales before saving formations')
      }

      if (Object.keys(localizationDrafts).length === 0) {
        throw new Error('Add localized content before saving the formation')
      }

      const localeNameLookup = locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale.code] = locale.label
        return acc
      }, {})

      const defaultDraft = localizationDrafts[defaultLocaleCode]
      if (!defaultDraft || !defaultDraft.title.trim()) {
        throw new Error(`Provide a title for ${localeNameLookup[defaultLocaleCode] ?? defaultLocaleCode}`)
      }

      const anyPublished = Object.values(localizationDrafts).some((draft) => draft.isPublished)
      const payload: FormationInsert = {
        slug: values.slug.trim(),
        status: values.status,
        title: defaultDraft.title.trim(),
        description: defaultDraft.description.trim() ? defaultDraft.description.trim() : null,
        thumbnail_url: defaultDraft.thumbnailUrl.trim() ? defaultDraft.thumbnailUrl.trim() : null,
        is_published: anyPublished,
        published_at: anyPublished ? editingFormation?.published_at ?? new Date().toISOString() : null,
      }

      let formationId = editingFormation?.id ?? null

      if (editingFormation) {
        const { error } = await supabase.from('formations').update(payload).eq('id', editingFormation.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('formations')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        formationId = data?.id ?? null
      }

      if (!formationId) {
        throw new Error('Unable to determine formation identifier after saving')
      }

      const existingLocalizations = mapLocalizationsByLocale(editingFormation?.formation_localizations ?? [])
      const localizationRows = Object.entries(localizationDrafts).map(([locale, draft]) => ({
        formation_id: formationId!,
        locale,
        title: draft.title.trim(),
        description: draft.description.trim() ? draft.description.trim() : null,
        tags: draft.tags,
        thumbnail_url: draft.thumbnailUrl.trim() ? draft.thumbnailUrl.trim() : null,
        is_published: draft.isPublished,
        published_at: draft.isPublished
          ? draft.publishedAt ?? existingLocalizations[locale]?.published_at ?? new Date().toISOString()
          : null,
      }))

      const { error: localizationError } = await supabase
        .from('formation_localizations')
        .upsert(localizationRows, { onConflict: 'formation_id,locale' })
      if (localizationError) throw localizationError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      toast.success(editingFormation ? 'Formation updated' : 'Formation created')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving formation', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save formation')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('formations').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      setDeleteDialogOpen(false)
      setDeletingFormation(null)
      toast.success('Formation deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete formation: ' + (error instanceof Error ? error.message : 'Unknown error'))
    },
  })

  const handleSubmit = (data: FormationFormValues) => {
    try {
      upsertMutation.mutate(data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleEdit = (formation: FormationWithMeta) => {
    if (!locales.length) {
      toast.error('Configure locales before editing formations')
      return
    }
    setEditingFormation(formation)
    setSlugManuallyEdited(true)
    form.reset({
      slug: formation.slug ?? '',
      status: formation.status ?? 'draft',
    })
    initializeLocalizationDrafts(formation)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    if (!locales.length) {
      toast.error('Configure locales before creating formations')
      return
    }
    setEditingFormation(null)
    setSlugManuallyEdited(false)
    form.reset({ slug: '', status: 'draft' })
    initializeLocalizationDrafts(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (formation: FormationWithMeta) => {
    setDeletingFormation(formation)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingFormation) {
      deleteMutation.mutate(deletingFormation.id)
    }
  }

  const renderLocalizationFields = (locale: string) => {
    const draft = localizationDrafts[locale] ?? createEmptyLocalizationDraft()
    const friendlyLabel = localeLabels[locale] ?? locale

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-forge-dark">Title · {friendlyLabel}</FormLabel>
          <Input
            value={draft.title}
            onChange={(event) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                title: event.target.value,
              }))
            }
            placeholder={`Title in ${friendlyLabel}`}
          />
        </div>
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-forge-dark">Description</FormLabel>
          <Textarea
            rows={4}
            value={draft.description}
            onChange={(event) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            placeholder={`Description in ${friendlyLabel}`}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-forge-dark">Thumbnail URL</FormLabel>
            <Input
              value={draft.thumbnailUrl}
              onChange={(event) =>
                updateLocalizationDraft(locale, (previous) => ({
                  ...previous,
                  thumbnailUrl: event.target.value,
                }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-forge-dark">Tags</FormLabel>
            <TagInput
              value={draft.tags}
              onChange={(tags) =>
                updateLocalizationDraft(locale, (previous) => ({
                  ...previous,
                  tags,
                }))
              }
              placeholder={`Add tags for ${friendlyLabel}`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-forge-cream/60 bg-forge-cream/30 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-forge-dark">Published</p>
            <p className="text-xs text-forge-gray">
              {draft.isPublished ? 'Visible to learners in this locale' : 'Hidden until you publish this locale'}
            </p>
          </div>
          <Switch
            checked={draft.isPublished}
            onCheckedChange={(checked) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                isPublished: checked,
              }))
            }
          />
        </div>
      </div>
    )
  }

  const deleteTargetTitle = useMemo(() => {
    if (!deletingFormation) return ''
    const localizationMap = mapLocalizationsByLocale(deletingFormation.formation_localizations ?? [])
    const localization =
      localizationMap[defaultLocaleCode] ??
      localizationMap[DEFAULT_LOCALE] ??
      Object.values(localizationMap)[0]
    return localization?.title ?? deletingFormation.title ?? 'this formation'
  }, [deletingFormation, defaultLocaleCode])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Formations</h1>
          <p className="text-muted-foreground">Manage formations, their localized content, and linked learning paths.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Formation
        </Button>
      </div>

      <div className="grid gap-4">
        {formations?.map((formation) => {
          const localizationMap = mapLocalizationsByLocale(formation.formation_localizations ?? [])
          const localization =
            localizationMap[defaultLocaleCode] ??
            localizationMap[DEFAULT_LOCALE] ??
            Object.values(localizationMap)[0]
          const displayTitle = localization?.title ?? formation.title
          const displayDescription = localization?.description ?? formation.description ?? 'No description provided'

          return (
            <Card key={formation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {displayTitle}
                      <Badge
                        variant={
                          formation.status === 'published'
                            ? 'default'
                            : formation.status === 'coming_soon'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={formation.status === 'published' ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {formation.status === 'published'
                          ? 'Available'
                          : formation.status === 'coming_soon'
                            ? 'Coming Soon'
                            : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{displayDescription}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(formation)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(formation)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {formation.paths_count} paths
                  </div>
                  <div>Created {formation.created_at ? formatDistanceToNow(new Date(formation.created_at)) : 'N/A'} ago</div>
                  {formation.published_at && (
                    <div>Published {formatDistanceToNow(new Date(formation.published_at))} ago</div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {Object.values(localizationMap).length === 0 && <Badge variant="outline">No locales</Badge>}
                  {Object.values(localizationMap).map((record) => (
                    <Badge
                      key={`${formation.id}-${record.locale}`}
                      variant={record.is_published ? 'default' : 'outline'}
                      className={record.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                    >
                      {record.locale} · {record.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  ))}
                </div>
                {formation.paths && formation.paths.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Learning Paths:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formation.paths.map((path) => (
                        <Badge key={path.id} variant="outline">
                          #{path.order} · {path.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        {formations && formations.length === 0 && (
          <Card className="border-dashed border-forge-cream/70 bg-white/70">
            <CardContent className="p-8 text-center text-forge-gray">
              No formations yet. Create one to group paths into longer journeys.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFormation ? 'Edit Formation' : 'Create Formation'}</DialogTitle>
            <DialogDescription>
              {editingFormation
                ? 'Update slug, status, localized content, and manage associated learning paths.'
                : 'Fill in the details to create a new formation. Add learning paths after saving.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="formation-slug"
                        {...field}
                        onChange={(event) => {
                          setSlugManuallyEdited(true)
                          field.onChange(event)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Auto-generated from the default locale title.</FormDescription>
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value as FormationFormValues['status'])}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </FormControl>
                    <FormDescription>Coming soon keeps the formation visible while collecting interest.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-forge-dark">Localized content</h4>
                  <p className="text-sm text-forge-gray">
                    Manage per-locale titles, descriptions, thumbnails, tags, and publish states.
                  </p>
                </div>
                {localesLoading ? (
                  <Card className="border-dashed border-forge-cream/70 bg-white/70">
                    <CardContent className="flex items-center gap-2 p-6 text-sm text-forge-gray">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading locales...
                    </CardContent>
                  </Card>
                ) : locales.length === 0 ? (
                  <Card className="border border-red-200 bg-red-50/80">
                    <CardContent className="p-4 text-sm text-red-700">
                      Add locales in Supabase before editing localized formation content.
                    </CardContent>
                  </Card>
                ) : (
                  <LocalizationTabs
                    locales={locales}
                    activeLocale={activeLocale}
                    onLocaleChange={setActiveLocale}
                    renderFields={renderLocalizationFields}
                  />
                )}
              </div>

              {editingFormation ? (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-forge-dark">Learning paths</h3>
                    <p className="text-sm text-muted-foreground">
                      Add or reorder learning paths for this formation. Changes are saved immediately.
                    </p>
                    <LearningPathSelector
                      formationId={editingFormation.id}
                      selectedPaths={selectedPathsState}
                      onPathsChange={setSelectedPathsState}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Separator />
                  <p className="text-sm text-muted-foreground">Save the formation to start attaching learning paths.</p>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={upsertMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertMutation.isPending || form.formState.isSubmitting}>
                  {upsertMutation.isPending || form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingFormation ? (
                    'Update'
                  ) : (
                    'Create'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete formation</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the formation “{deleteTargetTitle}” and remove all
              associated path assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending} className="bg-red-500 hover:bg-red-600">
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
