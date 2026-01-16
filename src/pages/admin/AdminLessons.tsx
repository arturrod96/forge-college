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
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { LocalizationTabs } from '@/components/admin/LocalizationTabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { TagInput } from '@/components/profile/TagInput'
import {
  DEFAULT_LOCALE,
  ensureLocaleMap,
  fetchSupportedLocales,
  getDefaultLocale,
  mapLocalizationsByLocale,
  pickPublishedLocalization,
  type LocaleRow,
} from '@/lib/localization'
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
import { Loader2, Pencil, Plus, Trash2, BookOpenText } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const lessonFormSchema = z.object({
  module_id: z.string().uuid('Select a module'),
  slug: z
    .string()
    .min(3, 'Slug must have at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  lesson_type: z.enum(['text', 'video', 'quiz']),
  xp_value: z.coerce.number().int().min(0, 'XP must be zero or greater'),
  order: z.coerce.number().int().min(1, 'Order must be at least 1'),
  duration_minutes: z
    .union([z.coerce.number().int().min(0), z.literal('')])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : Number(value))),
})

type LessonFormValues = z.infer<typeof lessonFormSchema>

type LessonRow = Tables<'lessons'>

type LessonWithMeta = LessonRow & {
  lesson_localizations: Tables<'lesson_localizations'>[] | null
}

type LessonLocalizationFormState = {
  title: string
  tags: string[]
  thumbnailUrl: string
  richText: string
  videoUrl: string
  quizJson: string
  isPublished: boolean
  publishedAt: string | null
}

type ModuleRow = Tables<'modules'>

type CourseRow = Tables<'courses'>

type LearningPathRow = Tables<'learning_paths'>

import { useNavigate } from 'react-router-dom'
import { DASHBOARD_ADMIN_LESSON_EDITOR } from '@/routes/paths'

export default function AdminLessons() {
  const navigate = useNavigate()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const { data: locales = [], isLoading: localesLoading } = useQuery<LocaleRow[]>({
    queryKey: ['content-locales'],
    queryFn: async () => fetchSupportedLocales(supabase),
  })

  const defaultLocaleCode = useMemo(() => getDefaultLocale(locales), [locales])
  const [activeLocale, setActiveLocale] = useState(DEFAULT_LOCALE)
  const [localizationDrafts, setLocalizationDrafts] = useState<Record<string, LessonLocalizationFormState>>({})

  useEffect(() => {
    if (locales.length > 0) {
      setActiveLocale((current) => (locales.some((locale) => locale.code === current) ? current : defaultLocaleCode))
    }
  }, [locales, defaultLocaleCode])

  const createEmptyLocalizationDraft = useCallback(
    (): LessonLocalizationFormState => ({
      title: '',
      tags: [],
      thumbnailUrl: '',
      richText: '',
      videoUrl: '',
      quizJson: '[]',
      isPublished: false,
      publishedAt: null,
    }),
    []
  )

  const deserializeLocalization = useCallback(
    (record: Tables<'lesson_localizations'> | undefined, lessonType: LessonRow['lesson_type']): LessonLocalizationFormState => {
      let richText = ''
      let videoUrl = ''
      let quizJson = '[]'

      if (lessonType === 'text' && typeof record?.content === 'string') {
        richText = record.content
      } else if (lessonType === 'video' && typeof record?.content === 'string') {
        videoUrl = record.content
      } else if (lessonType === 'quiz' && record?.content) {
        try {
          quizJson = JSON.stringify(record.content, null, 2)
        } catch {
          quizJson = '[]'
        }
      }

      return {
        title: record?.title ?? '',
        tags: record?.tags ?? [],
        thumbnailUrl: record?.thumbnail_url ?? '',
        richText,
        videoUrl,
        quizJson,
        isPublished: record?.is_published ?? false,
        publishedAt: record?.published_at ?? null,
      }
    },
    []
  )

  const updateLocalizationDraft = useCallback(
    (locale: string, updater: (draft: LessonLocalizationFormState) => LessonLocalizationFormState) => {
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

  const [selectedPathFilter, setSelectedPathFilter] = useState<'all' | string>('all')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | string>('all')
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<'all' | string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      module_id: '',
      slug: '',
      lesson_type: 'text',
      xp_value: 10,
      order: 1,
      duration_minutes: '',
    },
  })

  const initializeLocalizationDrafts = useCallback(
    (lesson?: LessonWithMeta, lessonType?: LessonFormValues['lesson_type']) => {
      if (locales.length === 0) return
      const baseType = lesson?.lesson_type ?? lessonType ?? form.getValues('lesson_type')
      const existingRecords = lesson
        ? Object.fromEntries(
            Object.entries(mapLocalizationsByLocale(lesson.lesson_localizations ?? [])).map(([localeCode, record]) => [
              localeCode,
              deserializeLocalization(record, baseType),
            ])
          )
        : {}
      const drafts = ensureLocaleMap(locales, existingRecords, () => createEmptyLocalizationDraft())
      setLocalizationDrafts(drafts)
      setActiveLocale(getDefaultLocale(locales))
    },
    [locales, deserializeLocalization, createEmptyLocalizationDraft, form]
  )

  const localeLabels = useMemo(
    () =>
      locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale.code] = locale.label
        return acc
      }, {}),
    [locales]
  )

  const [editingLesson, setEditingLesson] = useState<LessonWithMeta | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LessonWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const currentLessonType = form.watch('lesson_type')

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
          <FormDescription>Tags help organize content for {friendlyLabel}.</FormDescription>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-forge-cream/80 bg-forge-cream/40 p-3">
          <Switch
            id={`lesson-publish-${locale}`}
            checked={draft.isPublished}
            onCheckedChange={(checked) =>
              updateLocalizationDraft(locale, (previous) => ({
                ...previous,
                isPublished: checked,
                publishedAt: checked ? previous.publishedAt ?? new Date().toISOString() : null,
              }))
            }
          />
          <label htmlFor={`lesson-publish-${locale}`} className="text-sm text-forge-gray">
            {draft.isPublished ? `Published in ${friendlyLabel}` : `Draft in ${friendlyLabel}`}
          </label>
        </div>
        {currentLessonType === 'text' && (
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-forge-dark">Rich text content</FormLabel>
            <RichTextEditor
              value={draft.richText}
              onChange={(value) =>
                updateLocalizationDraft(locale, (previous) => ({
                  ...previous,
                  richText: value,
                }))
              }
              placeholder={`Write ${friendlyLabel} lesson content...`}
              onExpand={() => {
                if (!editingLesson) {
                  toast.error('Please save the lesson before opening the full editor')
                  return
                }
                navigate(DASHBOARD_ADMIN_LESSON_EDITOR(editingLesson.id))
              }}
            />
          </div>
        )}
        {currentLessonType === 'video' && (
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-forge-dark">Video URL</FormLabel>
            <Input
              value={draft.videoUrl}
              onChange={(event) =>
                updateLocalizationDraft(locale, (previous) => ({
                  ...previous,
                  videoUrl: event.target.value,
                }))
              }
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        )}
        {currentLessonType === 'quiz' && (
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-forge-dark">Quiz JSON</FormLabel>
            <Textarea
              rows={8}
              value={draft.quizJson}
              onChange={(event) =>
                updateLocalizationDraft(locale, (previous) => ({
                  ...previous,
                  quizJson: event.target.value,
                }))
              }
              placeholder='[
  {
    "question": "What is React?",
    "options": ["Library", "Framework"],
    "correctAnswer": "Library"
  }
]'
            />
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingLesson(null)
      setSlugManuallyEdited(false)
      setLocalizationDrafts({})
      setActiveLocale(defaultLocaleCode)
    }
  }, [dialogOpen, form, defaultLocaleCode])

  const watchedSlug = form.watch('slug')
  const defaultLocaleTitle = localizationDrafts[defaultLocaleCode]?.title ?? ''

  useEffect(() => {
    if (!slugManuallyEdited && !editingLesson) {
      const generated = slugify(defaultLocaleTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [defaultLocaleTitle, watchedSlug, slugManuallyEdited, editingLesson, form])

  const { data: learningPaths = [] } = useQuery<LearningPathRow[]>({
    queryKey: ['admin-lessons-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('id, title')
        .order('title', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })

  const { data: courses = [] } = useQuery<CourseRow[]>({
    queryKey: ['admin-lessons-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, path_id, order')
        .order('path_id', { ascending: true })
        .order('order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })

  const { data: modules = [] } = useQuery<ModuleRow[]>({
    queryKey: ['admin-lessons-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, course_id, order')
        .order('course_id', { ascending: true })
        .order('order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })

  const moduleLookup = useMemo(() => {
    return modules.reduce<Record<string, ModuleRow>>((acc, module) => {
      acc[module.id] = module
      return acc
    }, {})
  }, [modules])

  const courseLookup = useMemo(() => {
    return courses.reduce<Record<string, CourseRow>>((acc, course) => {
      acc[course.id] = course
      return acc
    }, {})
  }, [courses])

  const pathLookup = useMemo(() => {
    return learningPaths.reduce<Record<string, LearningPathRow>>((acc, path) => {
      acc[path.id] = path
      return acc
    }, {})
  }, [learningPaths])

  const filteredCourses = useMemo(() => {
    if (selectedPathFilter === 'all') return courses
    return courses.filter((course) => course.path_id === selectedPathFilter)
  }, [courses, selectedPathFilter])

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      if (selectedPathFilter !== 'all') {
        const course = module.course_id ? courseLookup[module.course_id] : null
        if (!course || course.path_id !== selectedPathFilter) return false
      }
      if (selectedCourseFilter !== 'all' && module.course_id !== selectedCourseFilter) {
        return false
      }
      return true
    })
  }, [modules, selectedPathFilter, selectedCourseFilter, courseLookup])

  const { data: lessons, isLoading } = useQuery<LessonWithMeta[]>({
    queryKey: ['admin-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select(
          `
            id,
            title,
            slug,
            lesson_type,
            module_id,
            order,
            content,
            xp_value,
            duration_minutes,
            thumbnail_url,
            is_published,
            published_at,
            updated_at,
            lesson_localizations(*)
          `
        )
        .order('module_id', { ascending: true })
        .order('order', { ascending: true })

      if (error) throw error
      return (data ?? []) as LessonWithMeta[]
    },
  })

  const filteredLessons = useMemo(() => {
    if (!lessons) return []
    return lessons.filter((lesson) => {
      const module = lesson.module_id ? moduleLookup[lesson.module_id] : null
      const course = module?.course_id ? courseLookup[module.course_id] : null
      const pathId = course?.path_id ?? null

      if (selectedPathFilter !== 'all' && pathId !== selectedPathFilter) return false
      if (selectedCourseFilter !== 'all' && module?.course_id !== selectedCourseFilter) return false
      if (selectedModuleFilter !== 'all' && lesson.module_id !== selectedModuleFilter) return false

      return true
    })
  }, [lessons, selectedPathFilter, selectedCourseFilter, selectedModuleFilter, moduleLookup, courseLookup])

  const upsertMutation = useMutation({
    mutationFn: async (values: LessonFormValues) => {
      if (locales.length === 0) {
        throw new Error('Configure at least one locale before saving lessons')
      }

      if (Object.keys(localizationDrafts).length === 0) {
        throw new Error('Add localized content before saving the lesson')
      }

      const localeLabels = locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale.code] = locale.label
        return acc
      }, {})

      const parsedContentByLocale: Record<string, unknown> = {}

      for (const [locale, draft] of Object.entries(localizationDrafts)) {
        if (!draft.title.trim()) {
          throw new Error(`Provide a title for ${localeLabels[locale] ?? locale}`)
        }

        if (values.lesson_type === 'text') {
          if (draft.isPublished && !draft.richText.trim()) {
            throw new Error(`Provide content for ${localeLabels[locale] ?? locale}`)
          }
          parsedContentByLocale[locale] = draft.richText
        } else if (values.lesson_type === 'video') {
          if (draft.isPublished && !draft.videoUrl.trim()) {
            throw new Error(`Provide a video URL for ${localeLabels[locale] ?? locale}`)
          }
          parsedContentByLocale[locale] = draft.videoUrl.trim()
        } else {
          if (draft.isPublished && !draft.quizJson.trim()) {
            throw new Error(`Provide quiz JSON for ${localeLabels[locale] ?? locale}`)
          }
          try {
            const parsed = draft.quizJson.trim() ? JSON.parse(draft.quizJson) : []
            if (!Array.isArray(parsed)) {
              throw new Error()
            }
            parsedContentByLocale[locale] = parsed
          } catch {
            throw new Error(`Quiz JSON is invalid for ${localeLabels[locale] ?? locale}`)
          }
        }
      }

      const defaultDraft = localizationDrafts[defaultLocaleCode]
      if (!defaultDraft) {
        throw new Error('Default locale content is missing')
      }

      const anyPublished = Object.values(localizationDrafts).some((draft) => draft.isPublished)

      const basePayload = {
        module_id: values.module_id,
        slug: values.slug.trim(),
        lesson_type: values.lesson_type,
        content: parsedContentByLocale[defaultLocaleCode],
        title: defaultDraft.title.trim(),
        xp_value: values.xp_value,
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        thumbnail_url: defaultDraft.thumbnailUrl.trim() ? defaultDraft.thumbnailUrl.trim() : null,
        is_published: anyPublished,
        published_at: anyPublished ? editingLesson?.published_at ?? new Date().toISOString() : null,
      }

      let lessonId = editingLesson?.id ?? null

      if (editingLesson) {
        const { error } = await supabase.from('lessons').update(basePayload).eq('id', editingLesson.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .insert(basePayload)
          .select('id')
          .single()
        if (error) throw error
        lessonId = data?.id ?? null
      }

      if (!lessonId) {
        throw new Error('Could not determine lesson identifier after saving')
      }

      const localizationRows = Object.entries(localizationDrafts).map(([locale, draft]) => {
        const existingPublishedAt = editingLesson?.lesson_localizations?.find((record) => record.locale === locale)?.published_at ?? null
        return {
          lesson_id: lessonId!,
          locale,
          title: draft.title.trim(),
          tags: draft.tags,
          thumbnail_url: draft.thumbnailUrl.trim() ? draft.thumbnailUrl.trim() : null,
          is_published: draft.isPublished,
          published_at: draft.isPublished ? draft.publishedAt ?? existingPublishedAt ?? new Date().toISOString() : null,
          content: parsedContentByLocale[locale],
        }
      })

      const { error: localizationError } = await supabase
        .from('lesson_localizations')
        .upsert(localizationRows, { onConflict: 'lesson_id,locale' })
      if (localizationError) throw localizationError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] })
      toast.success(editingLesson ? 'Lesson updated' : 'Lesson created')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving lesson', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save lesson')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] })
      toast.success('Lesson deleted')
      setDeleteTarget(null)
    },
    onError: (error) => {
      console.error('Error deleting lesson', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete lesson')
    },
  })

  const openForCreate = () => {
    if (!locales.length) {
      toast.error('Configure locales before creating lessons')
      return
    }
    setEditingLesson(null)
    setSlugManuallyEdited(false)
    form.reset({
      module_id: selectedModuleFilter !== 'all' ? selectedModuleFilter : '',
      slug: '',
      lesson_type: 'text',
      xp_value: 10,
      order: 1,
      duration_minutes: '',
    })
    initializeLocalizationDrafts(undefined, 'text')
    setDialogOpen(true)
  }

  const openForEdit = (lesson: LessonWithMeta) => {
    if (!locales.length) {
      toast.error('Configure locales before editing lessons')
      return
    }
    setEditingLesson(lesson)
    setSlugManuallyEdited(true)

    form.reset({
      module_id: lesson.module_id ?? '',
      slug: lesson.slug ?? '',
      lesson_type: lesson.lesson_type,
      xp_value: lesson.xp_value ?? 0,
      order: lesson.order ?? 1,
      duration_minutes: lesson.duration_minutes?.toString() ?? '',
    })

    initializeLocalizationDrafts(lesson)
    setDialogOpen(true)
  }

  const onSubmit = (values: LessonFormValues) => {
    try {
      upsertMutation.mutate(values)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const getLessonPreview = (lesson: LessonWithMeta) => {
    const localizationMap = mapLocalizationsByLocale(lesson.lesson_localizations ?? [])
    const localization =
      localizationMap[defaultLocaleCode] ??
      localizationMap[DEFAULT_LOCALE] ??
      Object.values(localizationMap)[0]
    const localizedContent = localization?.content ?? lesson.content

    if (lesson.lesson_type === 'text') {
      const content = typeof localizedContent === 'string' ? localizedContent : ''
      const plainText = content.replace(/<[^>]*>?/gm, '')
      return plainText.slice(0, 160)
    }
    if (lesson.lesson_type === 'video') {
      return typeof localizedContent === 'string' ? localizedContent : ''
    }
    return 'Quiz lesson contents'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">Lessons</h2>
          <p className="text-sm text-forge-gray">
            Create and manage lesson content across modules. Support for text, video, and quiz formats.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Select
            value={selectedPathFilter}
            onValueChange={(value) => {
              setSelectedPathFilter(value as 'all' | string)
              setSelectedCourseFilter('all')
              setSelectedModuleFilter('all')
            }}
          >
            <SelectTrigger>
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

          <Select
            value={selectedCourseFilter}
            onValueChange={(value) => {
              setSelectedCourseFilter(value as 'all' | string)
              setSelectedModuleFilter('all')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {filteredCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedModuleFilter}
            onValueChange={(value) => setSelectedModuleFilter(value as 'all' | string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {filteredModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  #{module.order} · {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={openForCreate} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Lesson
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading lessons...
          </CardContent>
        </Card>
      ) : filteredLessons && filteredLessons.length > 0 ? (
        <div className="grid gap-4">
          {filteredLessons.map((lesson) => {
            const module = lesson.module_id ? moduleLookup[lesson.module_id] : null
            const course = module?.course_id ? courseLookup[module.course_id] : null
            const path = course?.path_id ? pathLookup[course.path_id] : null

            return (
              <Card key={lesson.id} className="border border-forge-cream/70 bg-white/80">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-forge-dark">
                      #{lesson.order} · {lesson.title}
                      <Badge
                        variant={lesson.is_published ? 'default' : 'outline'}
                        className={lesson.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <BookOpenText className="h-3.5 w-3.5" /> {lesson.lesson_type.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-forge-gray">
                      {module ? `${module.title} · ` : ''}
                      {course ? `${course.title} · ` : ''}
                      {path ? path.title : ''}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openForEdit(lesson)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(lesson)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-forge-gray">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="font-semibold text-forge-dark">Slug:</span> {lesson.slug}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">XP:</span> {lesson.xp_value}
                    </div>
                    {lesson.duration_minutes != null && (
                      <>
                        <Separator orientation="vertical" className="hidden h-4 sm:block" />
                        <div>
                          <span className="font-semibold text-forge-dark">Duration:</span>{' '}
                          {lesson.duration_minutes} min
                        </div>
                      </>
                    )}
                    {lesson.thumbnail_url && (
                      <>
                        <Separator orientation="vertical" className="hidden h-4 sm:block" />
                        <a
                          href={lesson.thumbnail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-forge-orange hover:underline"
                        >
                          Thumbnail
                        </a>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-forge-gray/90 line-clamp-3">
                    {getLessonPreview(lesson)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-forge-gray">
                    {(lesson.lesson_localizations ?? []).map((localization) => (
                      <Badge
                        key={`${lesson.id}-${localization.locale}`}
                        variant={localization.is_published ? 'default' : 'outline'}
                        className={localization.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {localization.locale} · {localization.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-forge-gray/80">
                    Updated {lesson.updated_at ? formatDistanceToNow(new Date(lesson.updated_at), { addSuffix: true }) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed border-forge-cream/70 bg-white/70">
          <CardContent className="p-8 text-center text-forge-gray">
            No lessons found for this filter. Create a lesson to deliver content to learners.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit lesson' : 'New lesson'}</DialogTitle>
            <DialogDescription>
              {editingLesson
                ? 'Update lesson metadata, content, and publication state.'
                : 'Compose new content and attach it to a module. Choose the appropriate lesson format.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="module_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a module" />
                        </SelectTrigger>
                        <SelectContent>
                          {(filteredModules.length > 0 ? filteredModules : modules).map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              #{module.order} · {module.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        placeholder="understanding-components"
                        {...field}
                        onChange={(event) => {
                          setSlugManuallyEdited(true)
                          field.onChange(event)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Used in URLs. We auto-generate it from the default locale title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="lesson_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
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
                  name="xp_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>XP value</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-forge-dark">Localized content</h4>
                  <p className="text-sm text-forge-gray">
                    Manage per-locale titles, tags, thumbnails, publish state, and lesson content.
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
                      Add locales in Supabase before managing localized content.
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingLesson ? (
                    'Save changes'
                  ) : (
                    'Create lesson'
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
            <AlertDialogTitle>Delete lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting a lesson cannot be undone. Learner progress for this lesson will be lost. Continue deleting
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
