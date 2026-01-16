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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { LocalizationTabs } from '@/components/admin/LocalizationTabs'
import { TagInput } from '@/components/profile/TagInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
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

const courseFormSchema = z.object({
  path_id: z.string().uuid('Select a learning path'),
  slug: z
    .string()
    .min(3, 'Slug must have at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  order: z.coerce.number().int('Order must be an integer').min(1, 'Order must be at least 1'),
  duration_minutes: z
    .union([z.coerce.number().int().min(0), z.literal('')])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : Number(value))),
  status: z.enum(['draft', 'published', 'coming_soon']),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

type CourseRow = Tables<'courses'>

type CourseWithMeta = CourseRow & {
  modules?: { id: string }[]
  moduleCount: number
  course_localizations: Tables<'course_localizations'>[] | null
}

type CourseLocalizationFormState = {
  title: string
  summary: string
  description: string
  tags: string[]
  thumbnailUrl: string
  isPublished: boolean
  publishedAt: string | null
}

type LearningPathRow = Tables<'learning_paths'>

export default function AdminCourses() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const { data: locales = [], isLoading: localesLoading } = useQuery<LocaleRow[]>({
    queryKey: ['content-locales'],
    queryFn: async () => fetchSupportedLocales(supabase),
  })

  const defaultLocaleCode = useMemo(() => getDefaultLocale(locales), [locales])
  const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE)
  const [localizationDrafts, setLocalizationDrafts] = useState<Record<string, CourseLocalizationFormState>>({})

  useEffect(() => {
    if (locales.length > 0) {
      setActiveLocale((current) => (locales.some((locale) => locale.code === current) ? current : defaultLocaleCode))
    }
  }, [locales, defaultLocaleCode])

  const createEmptyLocalizationDraft = useCallback((): CourseLocalizationFormState => ({
    title: '',
    summary: '',
    description: '',
    tags: [],
    thumbnailUrl: '',
    isPublished: false,
    publishedAt: null,
  }), [])

  const deserializeLocalization = useCallback(
    (record?: Tables<'course_localizations'>): CourseLocalizationFormState => ({
      title: record?.title ?? '',
      summary: record?.summary ?? '',
      description: record?.description ?? '',
      tags: record?.tags ?? [],
      thumbnailUrl: record?.thumbnail_url ?? '',
      isPublished: record?.is_published ?? false,
      publishedAt: record?.published_at ?? null,
    }),
    []
  )

  const updateLocalizationDraft = useCallback(
    (locale: string, updater: (draft: CourseLocalizationFormState) => CourseLocalizationFormState) => {
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
    (course?: CourseWithMeta) => {
      if (locales.length === 0) return
      const existingRecords = course
        ? mapLocalizationsByLocale(course.course_localizations ?? [])
        : {}
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

  const [selectedPathFilter, setSelectedPathFilter] = useState<'all' | string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseWithMeta | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CourseWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      path_id: '',
      slug: '',
      order: 1,
      duration_minutes: '',
      status: 'draft',
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingCourse(null)
      setSlugManuallyEdited(false)
      setLocalizationDrafts({})
      setActiveLocale(defaultLocaleCode)
    }
  }, [dialogOpen, form, defaultLocaleCode])

  const watchedSlug = form.watch('slug')
  const defaultLocaleTitle = localizationDrafts[defaultLocaleCode]?.title ?? ''

  useEffect(() => {
    if (!slugManuallyEdited && !editingCourse) {
      const generated = slugify(defaultLocaleTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [defaultLocaleTitle, watchedSlug, slugManuallyEdited, editingCourse, form])

  const { data: learningPaths = [] } = useQuery<LearningPathRow[]>({
    queryKey: ['admin-courses-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('id, title, slug')
        .order('title', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })

  const pathLookup = useMemo(() => {
    return learningPaths.reduce<Record<string, LearningPathRow>>((acc, path) => {
      acc[path.id] = path
      return acc
    }, {})
  }, [learningPaths])

  const { data: courses, isLoading } = useQuery<CourseWithMeta[]>({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(
          `
            id,
            title,
            slug,
            summary,
            description,
            path_id,
            order,
            duration_minutes,
            status,
            is_published,
            published_at,
            thumbnail_url,
            updated_at,
            course_localizations(*),
            modules:modules(id)
          `
        )
        .order('order', { ascending: true })

      if (error) throw error

      type QueryRow = CourseRow & {
        modules?: { id: string }[]
        course_localizations: Tables<'course_localizations'>[] | null
      }

      return ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        moduleCount: Array.isArray(item.modules) ? item.modules.length : 0,
      }))
    },
  })

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    if (selectedPathFilter === 'all') return courses
    return courses.filter((course) => course.path_id === selectedPathFilter)
  }, [courses, selectedPathFilter])

  const upsertMutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      if (!locales.length) {
        throw new Error('No locales configured for courses')
      }

      if (Object.keys(localizationDrafts).length === 0) {
        throw new Error('Add localized content before saving the course')
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

      const basePayload = {
        path_id: values.path_id,
        slug: values.slug.trim(),
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        status: values.status,
        title: defaultDraft.title.trim(),
        summary: defaultDraft.summary.trim() ? defaultDraft.summary.trim() : null,
        description: defaultDraft.description.trim() ? defaultDraft.description.trim() : null,
        thumbnail_url: defaultDraft.thumbnailUrl.trim() ? defaultDraft.thumbnailUrl.trim() : null,
        is_published: anyPublished,
        published_at: anyPublished ? editingCourse?.published_at ?? new Date().toISOString() : null,
      }

      let courseId = editingCourse?.id ?? null

      if (editingCourse) {
        const { error } = await supabase.from('courses').update(basePayload).eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert(basePayload)
          .select('id')
          .single()
        if (error) throw error
        courseId = data?.id ?? null
      }

      if (!courseId) {
        throw new Error('Unable to determine course identifier after saving')
      }

      const existingLocalizations = mapLocalizationsByLocale(editingCourse?.course_localizations ?? [])

      const localizationRows = Object.entries(localizationDrafts).map(([locale, draft]) => ({
        course_id: courseId!,
        locale,
        title: draft.title.trim(),
        summary: draft.summary.trim() ? draft.summary.trim() : null,
        description: draft.description.trim() ? draft.description.trim() : null,
        tags: draft.tags,
        thumbnail_url: draft.thumbnailUrl.trim() ? draft.thumbnailUrl.trim() : null,
        is_published: draft.isPublished,
        published_at: draft.isPublished
          ? draft.publishedAt ?? existingLocalizations[locale]?.published_at ?? new Date().toISOString()
          : null,
      }))

      const { error: localizationError } = await supabase
        .from('course_localizations')
        .upsert(localizationRows, { onConflict: 'course_id,locale' })
      if (localizationError) throw localizationError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      toast.success(editingCourse ? 'Course updated' : 'Course created')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving course', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save course')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      toast.success('Course deleted')
      setDeleteTarget(null)
    },
    onError: (error) => {
      console.error('Error deleting course', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete course')
    },
  })

  const openForCreate = () => {
    if (!locales.length) {
      toast.error('Configure locales before creating courses')
      return
    }
    setEditingCourse(null)
    setSlugManuallyEdited(false)
    form.reset({
      path_id: selectedPathFilter !== 'all' ? selectedPathFilter : '',
      slug: '',
      order: 1,
      duration_minutes: '',
      status: 'draft',
    })
    initializeLocalizationDrafts(undefined)
    setDialogOpen(true)
  }

  const openForEdit = (course: CourseWithMeta) => {
    if (!locales.length) {
      toast.error('Configure locales before editing courses')
      return
    }
    setEditingCourse(course)
    setSlugManuallyEdited(true)
    form.reset({
      path_id: course.path_id ?? '',
      slug: course.slug ?? '',
      order: course.order ?? 1,
      duration_minutes: course.duration_minutes?.toString() ?? '',
      status: course.status ?? 'draft',
    })
    initializeLocalizationDrafts(course)
    setDialogOpen(true)
  }

  const onSubmit = (values: CourseFormValues) => {
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
          <FormLabel className="text-sm font-medium text-forge-dark">Summary</FormLabel>
          <Textarea
            rows={3}
            value={draft.summary}
            onChange={(event) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                summary: event.target.value,
              }))
            }
            placeholder={`Short summary in ${friendlyLabel}`}
          />
        </div>
        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-forge-dark">Description</FormLabel>
          <Textarea
            rows={5}
            value={draft.description}
            onChange={(event) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            placeholder={`Full description in ${friendlyLabel}`}
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
          <FormDescription>Use locale-specific thumbnails when needed.</FormDescription>
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
            placeholder="Type a tag and press Enter"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-forge-cream/80 bg-forge-cream/40 p-3">
          <Switch
            id={`course-publish-${locale}`}
            checked={draft.isPublished}
            onCheckedChange={(checked) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                isPublished: checked,
                publishedAt: checked ? previous.publishedAt ?? new Date().toISOString() : null,
              }))
            }
          />
          <label htmlFor={`course-publish-${locale}`} className="text-sm text-forge-gray">
            {draft.isPublished ? `Published in ${friendlyLabel}` : `Draft in ${friendlyLabel}`}
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">Courses</h2>
          <p className="text-sm text-forge-gray">
            Manage courses inside each learning path. Adjust order, metadata, and publish state.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={selectedPathFilter}
            onValueChange={(value) => setSelectedPathFilter(value as 'all' | string)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filter by path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All paths</SelectItem>
              {learningPaths.map((path) => (
                <SelectItem key={path.id} value={path.id}>
                  {path.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openForCreate} className="sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading courses...
          </CardContent>
        </Card>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid gap-4">
          {filteredCourses.map((course) => {
            const localizationMap = mapLocalizationsByLocale(course.course_localizations ?? [])
            const localization =
              localizationMap[defaultLocaleCode] ??
              localizationMap[DEFAULT_LOCALE] ??
              Object.values(localizationMap)[0]
            const displayTitle = localization?.title ?? course.title
            const displaySummary = localization?.summary ?? course.summary ?? 'No summary'

            return (
              <Card key={course.id} className="border border-forge-cream/70 bg-white/80">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-forge-dark">
                      #{course.order} · {displayTitle}
                      <Badge
                        variant={course.status === 'published' ? 'default' : course.status === 'coming_soon' ? 'secondary' : 'outline'}
                        className={course.status === 'published' ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {course.status === 'published' ? 'Published' : course.status === 'coming_soon' ? 'Coming Soon' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-forge-gray">{displaySummary}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openForEdit(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(course)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-forge-gray">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="font-semibold text-forge-dark">Path:</span>{' '}
                      {course.path_id ? pathLookup[course.path_id]?.title ?? 'Unknown path' : 'Unassigned'}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">Slug:</span> {course.slug}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">Modules:</span> {course.moduleCount}
                    </div>
                    {course.duration_minutes != null && (
                      <>
                        <Separator orientation="vertical" className="hidden h-4 sm:block" />
                        <div>
                          <span className="font-semibold text-forge-dark">Duration:</span>{' '}
                          {course.duration_minutes} min
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {Object.values(localizationMap).length === 0 && <Badge variant="outline">No locales</Badge>}
                    {Object.values(localizationMap).map((record) => (
                      <Badge
                        key={`${course.id}-${record.locale}`}
                        variant={record.is_published ? 'default' : 'outline'}
                        className={record.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {record.locale} · {record.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    ))}
                  </div>
                  {localization?.description && (
                    <p className="text-xs text-forge-gray/90">{localization.description}</p>
                  )}
                  {localization?.thumbnail_url && (
                    <a
                      href={localization.thumbnail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-forge-orange hover:underline"
                    >
                      View thumbnail
                    </a>
                  )}
                  <div className="text-xs text-forge-gray/80">
                    Updated {course.updated_at ? formatDistanceToNow(new Date(course.updated_at), { addSuffix: true }) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed border-forge-cream/70 bg-white/70">
          <CardContent className="p-8 text-center text-forge-gray">
            No courses found for this filter. Create a new course to start building structure.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit course' : 'New course'}</DialogTitle>
            <DialogDescription>
              {editingCourse
                ? 'Update metadata, ordering, and visibility for this course.'
                : 'Create a course inside a learning path. You can attach modules after saving.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="path_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning path</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a learning path" />
                        </SelectTrigger>
                        <SelectContent>
                          {learningPaths.map((path) => (
                            <SelectItem key={path.id} value={path.id}>
                              {path.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React & TypeScript Foundations" {...field} />
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
                          placeholder="react-typescript-foundations"
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
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input placeholder="Short one-liner for dashboards" {...field} />
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
                      <Textarea rows={4} placeholder="Detailed course description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Use a Supabase Storage public URL or any accessible image. Media uploads will be integrated
                        soon.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          const value = event.target.value as CourseFormValues['status']
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
                    <FormDescription>
                      Coming soon keeps the course visible while you collect early interest.
                    </FormDescription>
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
                          ? 'Published courses are visible to learners enrolled in the path.'
                          : 'Keep as draft until modules and lessons are ready.'}
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingCourse ? (
                    'Save changes'
                  ) : (
                    'Create course'
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
            <AlertDialogTitle>Delete course</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting a course will also remove its modules and lessons. This cannot be undone. Continue deleting
              “{deleteTarget?.title}”?
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
