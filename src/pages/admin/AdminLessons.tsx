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

  const [selectedPathFilter, setSelectedPathFilter] = useState<'all' | string>('all')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | string>('all')
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<'all' | string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonWithMeta | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LessonWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

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

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingLesson(null)
      setSlugManuallyEdited(false)
    }
  }, [dialogOpen, form])

  const watchedTitle = form.watch('title')
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingLesson) {
      const generated = slugify(watchedTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingLesson, form])

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
          'id, title, slug, lesson_type, module_id, order, content, xp_value, duration_minutes, thumbnail_url, is_published, published_at, updated_at'
        )
        .order('module_id', { ascending: true })
        .order('order', { ascending: true })

      if (error) throw error
      return data ?? []
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
      let content: unknown = null
      if (values.lesson_type === 'text') {
        content = values.text_content?.trim() ?? ''
      } else if (values.lesson_type === 'video') {
        content = values.video_url?.trim() ?? ''
      } else {
        content = JSON.parse(values.quiz_json ?? '[]')
      }

      const payload = {
        module_id: values.module_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        lesson_type: values.lesson_type,
        content,
        xp_value: values.xp_value,
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        thumbnail_url: values.thumbnail_url?.trim() ? values.thumbnail_url.trim() : null,
        is_published: values.is_published,
        published_at: values.is_published
          ? editingLesson?.published_at ?? new Date().toISOString()
          : null,
      }

      if (editingLesson) {
        const { error } = await supabase.from('lessons').update(payload).eq('id', editingLesson.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            ...payload,
            published_at: values.is_published ? new Date().toISOString() : null,
          })
        if (error) throw error
      }
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

  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { error } = await supabase
        .from('lessons')
        .update({ is_published: publish, published_at: publish ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] })
      toast.success('Publish state updated')
    },
    onError: (error) => {
      console.error('Error toggling publish', error)
      toast.error(error instanceof Error ? error.message : 'Failed to toggle publish state')
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
    setEditingLesson(null)
    setSlugManuallyEdited(false)
    form.reset({
      module_id: selectedModuleFilter !== 'all' ? selectedModuleFilter : '',
      title: '',
      slug: '',
      lesson_type: 'text',
      text_content: '',
      video_url: '',
      quiz_json: '',
      xp_value: 10,
      order: 1,
      duration_minutes: '',
      thumbnail_url: '',
      is_published: false,
    })
    setDialogOpen(true)
  }

  const openForEdit = (lesson: LessonWithMeta) => {
    setEditingLesson(lesson)
    setSlugManuallyEdited(true)

    const moduleId = lesson.module_id ?? ''
    const content = lesson.content

    let textContent = ''
    let videoUrl = ''
    let quizJson = ''

    if (lesson.lesson_type === 'text') {
      textContent = typeof content === 'string' ? content : ''
    } else if (lesson.lesson_type === 'video') {
      videoUrl = typeof content === 'string' ? content : ''
    } else if (content) {
      try {
        quizJson = JSON.stringify(content, null, 2)
      } catch {
        quizJson = ''
      }
    }

    form.reset({
      module_id: moduleId,
      title: lesson.title ?? '',
      slug: lesson.slug ?? '',
      lesson_type: lesson.lesson_type,
      text_content: textContent,
      video_url: videoUrl,
      quiz_json: quizJson,
      xp_value: lesson.xp_value ?? 0,
      order: lesson.order ?? 1,
      duration_minutes: lesson.duration_minutes?.toString() ?? '',
      thumbnail_url: lesson.thumbnail_url ?? '',
      is_published: lesson.is_published,
    })
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
    if (lesson.lesson_type === 'text') {
      const content = typeof lesson.content === 'string' ? lesson.content : ''
      // Strip HTML tags for preview
      const plainText = content.replace(/<[^>]*>?/gm, '')
      return plainText.slice(0, 160)
    }
    if (lesson.lesson_type === 'video') {
      return typeof lesson.content === 'string' ? lesson.content : ''
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
                  <div className="text-xs text-forge-gray/80">
                    Updated {lesson.updated_at ? formatDistanceToNow(new Date(lesson.updated_at), { addSuffix: true }) : 'N/A'}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Switch
                      id={`lesson-publish-${lesson.id}`}
                      checked={lesson.is_published}
                      onCheckedChange={(checked) => publishMutation.mutate({ id: lesson.id, publish: checked })}
                      disabled={publishMutation.isPending}
                    />
                    <label htmlFor={`lesson-publish-${lesson.id}`} className="text-forge-gray">
                      {lesson.is_published ? 'Unpublish' : 'Publish'}
                    </label>
                  </div>
                </CardFooter>
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

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Understanding Components" {...field} />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {form.watch('lesson_type') === 'text' && (
                <FormField
                  control={form.control}
                  name="text_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Content (HTML)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder="Write lesson content..."
                          onExpand={() => {
                            if (!editingLesson) {
                              toast.error('Please save the lesson first before opening full screen editor')
                              return
                            }
                            navigate(DASHBOARD_ADMIN_LESSON_EDITOR(editingLesson.id))
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Rich text editor with support for formatting, links, images, and embedded videos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('lesson_type') === 'video' && (
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('lesson_type') === 'quiz' && (
                <FormField
                  control={form.control}
                  name="quiz_json"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz JSON</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={8}
                          placeholder='[
  {
    "question": "What is React?",
    "options": ["Library", "Framework"],
    "correctAnswer": "Library"
  }
]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid gap-6 md:grid-cols-2">
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
                        Store media in Supabase Storage and paste the public URL here. Upload widgets are planned for
                        a next iteration.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish immediately</FormLabel>
                      <DialogDescription>
                        {field.value
                          ? 'Published lessons appear instantly in the learner experience.'
                          : 'Keep as draft until you are ready to release.'}
                      </DialogDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
