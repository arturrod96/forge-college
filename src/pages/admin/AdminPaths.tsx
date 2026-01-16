import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Switch } from '@/components/ui/switch'
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
    .slice(0, 80)

const pathSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must include at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  status: z.enum(['draft', 'published', 'coming_soon']),
  formation_id: z.union([z.string().uuid(), z.literal('')]).optional(),
  order: z.union([z.coerce.number().int().min(1), z.undefined()]).optional(),
})

type PathFormValues = z.infer<typeof pathSchema>

type LearningPathRow = Tables<'learning_paths'>['Row']
type LearningPathInsert = Tables<'learning_paths'>['Insert']
type FormationRow = Tables<'formations'>['Row']

interface LearningPathWithMeta extends LearningPathRow {
  courses_count?: number
  courses?: { id: string }[]
  formation_id?: string | null
  order?: number | null
  learning_path_localizations: Tables<'learning_path_localizations'>[] | null
}

type LearningPathLocalizationFormState = {
  title: string
  description: string
  thumbnailUrl: string
  tags: string[]
  isPublished: boolean
  publishedAt: string | null
}

export default function AdminPaths() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const { data: locales = [], isLoading: localesLoading } = useQuery<LocaleRow[]>({
    queryKey: ['content-locales'],
    queryFn: async () => fetchSupportedLocales(supabase),
  })

  const defaultLocaleCode = useMemo(() => getDefaultLocale(locales), [locales])
  const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE)
  const [localizationDrafts, setLocalizationDrafts] = useState<Record<string, LearningPathLocalizationFormState>>({})

  useEffect(() => {
    if (locales.length > 0) {
      setActiveLocale((current) => (locales.some((locale) => locale.code === current) ? current : defaultLocaleCode))
    }
  }, [locales, defaultLocaleCode])

  const createEmptyLocalizationDraft = useCallback(
    (): LearningPathLocalizationFormState => ({
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
    (record?: Tables<'learning_path_localizations'>): LearningPathLocalizationFormState => ({
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
    (locale: string, updater: (draft: LearningPathLocalizationFormState) => LearningPathLocalizationFormState) => {
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
    (path?: LearningPathWithMeta) => {
      if (locales.length === 0) return
      const existingRecords = path ? mapLocalizationsByLocale(path.learning_path_localizations ?? []) : {}
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
  const [deleteTarget, setDeleteTarget] = useState<LearningPathWithMeta | null>(null)
  const [editingPath, setEditingPath] = useState<LearningPathWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<PathFormValues>({
    resolver: zodResolver(pathSchema),
    defaultValues: {
      slug: '',
      status: 'draft',
      formation_id: '',
      order: 1,
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset({ slug: '', status: 'draft', formation_id: '', order: 1 })
      setEditingPath(null)
      setSlugManuallyEdited(false)
      setLocalizationDrafts({})
      setActiveLocale(defaultLocaleCode)
    }
  }, [dialogOpen, form, defaultLocaleCode])

  const defaultLocaleTitle = localizationDrafts[defaultLocaleCode]?.title ?? ''
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingPath) {
      const generated = slugify(defaultLocaleTitle)
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [defaultLocaleTitle, slugManuallyEdited, editingPath, watchedSlug, form])

  const { data: formations = [] } = useQuery<FormationRow[]>({
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

  const formationLookup = useMemo(
    () =>
      formations.reduce<Record<string, FormationRow>>((acc, formation) => {
        acc[formation.id] = formation
        return acc
      }, {}),
    [formations]
  )

  const { data: paths, isLoading } = useQuery<LearningPathWithMeta[]>({
    queryKey: ['admin-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(
          `
            id,
            title,
            slug,
            description,
            is_published,
            published_at,
            created_at,
            updated_at,
            status,
            learning_path_localizations(*),
            courses:courses(id)
          `
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      type QueryRow = LearningPathRow & {
        courses?: { id: string }[]
        learning_path_localizations: Tables<'learning_path_localizations'>[] | null
      }

      const pathsData = ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        courses_count: Array.isArray(item.courses) ? item.courses.length : 0,
      }))

      const { data: formationPaths, error: formationError } = await supabase
        .from('formation_paths')
        .select('learning_path_id, formation_id, order')

      if (formationError) throw formationError

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
    mutationFn: async (values: PathFormValues) => {
      if (!locales.length) {
        throw new Error('Configure locales before saving learning paths')
      }

      if (Object.keys(localizationDrafts).length === 0) {
        throw new Error('Add localized content before saving the path')
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
      const payload: LearningPathInsert = {
        slug: values.slug.trim(),
        status: values.status,
        title: defaultDraft.title.trim(),
        description: defaultDraft.description.trim() ? defaultDraft.description.trim() : null,
        is_published: anyPublished,
        published_at: anyPublished ? editingPath?.published_at ?? new Date().toISOString() : null,
      }

      let pathId = editingPath?.id ?? null

      if (editingPath) {
        const { error } = await supabase.from('learning_paths').update(payload).eq('id', editingPath.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('learning_paths')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        pathId = data?.id ?? null
      }

      if (!pathId) {
        throw new Error('Unable to determine learning path identifier after saving')
      }

      const existingLocalizations = mapLocalizationsByLocale(editingPath?.learning_path_localizations ?? [])
      const localizationRows = Object.entries(localizationDrafts).map(([locale, draft]) => ({
        learning_path_id: pathId!,
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
        .from('learning_path_localizations')
        .upsert(localizationRows, { onConflict: 'learning_path_id,locale' })
      if (localizationError) throw localizationError

      const formationId = values.formation_id && values.formation_id.trim() ? values.formation_id.trim() : null
      const orderValue = values.order ?? 1

      if (editingPath?.formation_id) {
        const { error } = await supabase.from('formation_paths').delete().eq('learning_path_id', pathId)
        if (error) throw error
      }

      if (formationId) {
        const { error } = await supabase.from('formation_paths').insert({
          learning_path_id: pathId,
          formation_id: formationId,
          order: orderValue,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paths'] })
      toast.success(editingPath ? 'Learning path updated' : 'Learning path created')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving learning path', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save learning path')
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
    if (!locales.length) {
      toast.error('Configure locales before creating learning paths')
      return
    }
    setEditingPath(null)
    setSlugManuallyEdited(false)
    form.reset({ slug: '', status: 'draft', formation_id: '', order: 1 })
    initializeLocalizationDrafts(undefined)
    setDialogOpen(true)
  }

  const openForEdit = (path: LearningPathWithMeta) => {
    if (!locales.length) {
      toast.error('Configure locales before editing learning paths')
      return
    }
    setEditingPath(path)
    setSlugManuallyEdited(true)
    form.reset({
      slug: path.slug ?? '',
      status: path.status ?? 'draft',
      formation_id: path.formation_id ?? '',
      order: path.order ?? 1,
    })
    initializeLocalizationDrafts(path)
    setDialogOpen(true)
  }

  const onSubmit = (values: PathFormValues) => {
    try {
      upsertMutation.mutate(values)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const renderLocalizationFields = (locale: string) => {
    const draft = localizationDrafts[locale] ?? createEmptyLocalizationDraft()
    const friendlyLabel = localeLabels[locale] ?? locale

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
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
    if (!deleteTarget) return ''
    const localizationMap = mapLocalizationsByLocale(deleteTarget.learning_path_localizations ?? [])
    const localization =
      localizationMap[defaultLocaleCode] ??
      localizationMap[DEFAULT_LOCALE] ??
      Object.values(localizationMap)[0]
    return localization?.title ?? deleteTarget.title ?? 'this learning path'
  }, [deleteTarget, defaultLocaleCode])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">Learning Paths</h2>
          <p className="text-sm text-forge-gray">
            Group courses into curated journeys and control localized content per language.
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
          {paths.map((path) => {
            const localizationMap = mapLocalizationsByLocale(path.learning_path_localizations ?? [])
            const localization =
              localizationMap[defaultLocaleCode] ??
              localizationMap[DEFAULT_LOCALE] ??
              Object.values(localizationMap)[0]
            const displayTitle = localization?.title ?? path.title ?? 'Untitled path'
            const displayDescription = localization?.description ?? path.description ?? 'No description'

            return (
              <Card key={path.id} className="border border-forge-cream/70 bg-white/80">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-forge-dark">
                      {displayTitle}
                      <Badge
                        variant={
                          path.status === 'published'
                            ? 'default'
                            : path.status === 'coming_soon'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={path.status === 'published' ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {path.status === 'published'
                          ? 'Published'
                          : path.status === 'coming_soon'
                            ? 'Coming Soon'
                            : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-forge-gray">{displayDescription}</CardDescription>
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
                      <span className="font-semibold text-forge-dark">Courses:</span> {path.courses_count ?? 0}
                    </div>
                    {path.formation_id && (
                      <>
                        <Separator orientation="vertical" className="hidden h-4 sm:block" />
                        <div>
                          <span className="font-semibold text-forge-dark">Formation:</span>{' '}
                          {formationLookup[path.formation_id]?.title ?? 'Linked formation'}
                          {path.order ? ` · Order ${path.order}` : ''}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {Object.values(localizationMap).length === 0 && <Badge variant="outline">No locales</Badge>}
                    {Object.values(localizationMap).map((record) => (
                      <Badge
                        key={`${path.id}-${record.locale}`}
                        variant={record.is_published ? 'default' : 'outline'}
                        className={record.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {record.locale} · {record.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-forge-gray/80">
                    Updated {path.updated_at ? formatDistanceToNow(new Date(path.updated_at), { addSuffix: true }) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed border-forge-cream/70 bg-white/70">
          <CardContent className="p-8 text-center text-forge-gray">
            No learning paths yet. Create your first path to start structuring content.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPath ? 'Edit learning path' : 'New learning path'}</DialogTitle>
            <DialogDescription>
              {editingPath
                ? 'Update slug, status, formation links, and localized content for this path.'
                : 'Define the high-level journey for learners. You can add courses after saving.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormDescription>We auto-generate this from the default locale title.</FormDescription>
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
                        onChange={(event) => field.onChange(event.target.value as PathFormValues['status'])}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </FormControl>
                    <FormDescription>Coming soon keeps the path visible while routes point to waitlists.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="formation_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formation</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        >
                          <option value="">Not attached</option>
                          {formations.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                              {formation.title}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>Attach this path to a formation to control marketplace ordering.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order within formation</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value ?? ''}
                          onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                          disabled={!form.watch('formation_id')}
                          placeholder="Auto"
                        />
                      </FormControl>
                      <FormDescription>Only used when the path belongs to a formation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      Add locales in Supabase before editing localized path content.
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || upsertMutation.isPending}>
                  {form.formState.isSubmitting || upsertMutation.isPending ? (
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
              This action cannot be undone. Deleting a path will remove localized content and detach it from formations.
              Continue deleting “{deleteTargetTitle}”? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
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
