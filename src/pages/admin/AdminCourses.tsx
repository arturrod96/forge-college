import { useEffect, useMemo, useState } from 'react'
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
  CardFooter,
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const courseFormSchema = z.object({
  path_id: z.string().uuid('Select a learning path'),
  title: z.string().min(3, 'Title must have at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must have at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  summary: z.string().max(200, 'Summary is too long').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  order: z.coerce.number().int('Order must be an integer').min(1, 'Order must be at least 1'),
  duration_minutes: z
    .union([z.coerce.number().int().min(0), z.literal('')])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : Number(value))),
  thumbnail_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_published: z.boolean().default(false),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

type CourseRow = Tables<'courses'>

type CourseWithMeta = CourseRow & {
  modules?: { id: string }[]
  moduleCount: number
}

type LearningPathRow = Tables<'learning_paths'>

export function AdminCourses() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [selectedPathFilter, setSelectedPathFilter] = useState<'all' | string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseWithMeta | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CourseWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      path_id: '',
      title: '',
      slug: '',
      summary: '',
      description: '',
      order: 1,
      duration_minutes: null,
      thumbnail_url: '',
      is_published: false,
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingCourse(null)
      setSlugManuallyEdited(false)
    }
  }, [dialogOpen, form])

  const watchedTitle = form.watch('title')
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingCourse) {
      const generated = slugify(watchedTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingCourse, form])

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
          'id, title, slug, summary, description, path_id, order, duration_minutes, is_published, published_at, thumbnail_url, updated_at, modules:modules(id)'
        )
        .order('order', { ascending: true })

      if (error) throw error

      type QueryRow = CourseRow & { modules?: { id: string }[] }

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
      const payload = {
        path_id: values.path_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        summary: values.summary?.trim() ? values.summary.trim() : null,
        description: values.description?.trim() ? values.description.trim() : null,
        order: values.order,
        duration_minutes: values.duration_minutes ?? null,
        thumbnail_url: values.thumbnail_url?.trim() ? values.thumbnail_url.trim() : null,
        is_published: values.is_published,
        published_at: values.is_published
          ? editingCourse?.published_at ?? new Date().toISOString()
          : null,
      }

      if (editingCourse) {
        const { error } = await supabase.from('courses').update(payload).eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            ...payload,
            published_at: values.is_published ? new Date().toISOString() : null,
          })
        if (error) throw error
      }
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

  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: publish, published_at: publish ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      toast.success('Publish state updated')
    },
    onError: (error) => {
      console.error('Error toggling publish', error)
      toast.error(error instanceof Error ? error.message : 'Failed to toggle publish state')
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
    setEditingCourse(null)
    setSlugManuallyEdited(false)
    form.reset({
      path_id: selectedPathFilter !== 'all' ? selectedPathFilter : '',
      title: '',
      slug: '',
      summary: '',
      description: '',
      order: 1,
      duration_minutes: null,
      thumbnail_url: '',
      is_published: false,
    })
    setDialogOpen(true)
  }

  const openForEdit = (course: CourseWithMeta) => {
    setEditingCourse(course)
    setSlugManuallyEdited(true)
    form.reset({
      path_id: course.path_id ?? '',
      title: course.title ?? '',
      slug: course.slug ?? '',
      summary: course.summary ?? '',
      description: course.description ?? '',
      order: course.order ?? 1,
      duration_minutes: course.duration_minutes ?? null,
      thumbnail_url: course.thumbnail_url ?? '',
      is_published: course.is_published,
    })
    setDialogOpen(true)
  }

  const onSubmit = (values: CourseFormValues) => {
    upsertMutation.mutate(values)
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
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border border-forge-cream/70 bg-white/80">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex flex-wrap items-center gap-2 text-forge-dark">
                    #{course.order} · {course.title}
                    <Badge
                      variant={course.is_published ? 'default' : 'outline'}
                      className={course.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                    >
                      {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm text-forge-gray">
                    {course.summary || 'No summary'}
                  </CardDescription>
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
                {course.description && (
                  <p className="text-xs text-forge-gray/90">{course.description}</p>
                )}
                {course.thumbnail_url && (
                  <a
                    href={course.thumbnail_url}
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
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Switch
                    id={`course-publish-${course.id}`}
                    checked={course.is_published}
                    onCheckedChange={(checked) => publishMutation.mutate({ id: course.id, publish: checked })}
                    disabled={publishMutation.isPending}
                  />
                  <label htmlFor={`course-publish-${course.id}`} className="text-forge-gray">
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </label>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-forge-cream/70 bg-white/70">
          <CardContent className="p-8 text-center text-forge-gray">
            No courses found for this filter. Create a new course to start building structure.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
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

export default AdminCourses
