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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const moduleFormSchema = z.object({
  course_id: z.string().uuid('Select a course'),
  slug: z
    .string()
    .min(3, 'Slug must have at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  order: z.coerce.number().int('Order must be an integer').min(1, 'Order must be at least 1'),
})

type ModuleFormValues = z.infer<typeof moduleFormSchema>

type ModuleRow = Tables<'modules'>

type ModuleWithMeta = ModuleRow & {
  lessons?: { id: string }[]
  lessonCount: number
}

type CourseRow = Tables<'courses'>

type LearningPathRow = Tables<'learning_paths'>

export default function AdminModules() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [selectedPathFilter, setSelectedPathFilter] = useState<'all' | string>('all')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<ModuleWithMeta | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ModuleWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      course_id: '',
      title: '',
      slug: '',
      summary: '',
      order: 1,
      is_published: false,
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setEditingModule(null)
      setSlugManuallyEdited(false)
    }
  }, [dialogOpen, form])

  const watchedTitle = form.watch('title')
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingModule) {
      const generated = slugify(watchedTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [watchedTitle, watchedSlug, slugManuallyEdited, editingModule, form])

  const { data: learningPaths = [] } = useQuery<LearningPathRow[]>({
    queryKey: ['admin-modules-paths'],
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
    queryKey: ['admin-modules-courses'],
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

  const pathLookup = useMemo(() => {
    return learningPaths.reduce<Record<string, LearningPathRow>>((acc, path) => {
      acc[path.id] = path
      return acc
    }, {})
  }, [learningPaths])

  const courseLookup = useMemo(() => {
    return courses.reduce<Record<string, CourseRow>>((acc, course) => {
      acc[course.id] = course
      return acc
    }, {})
  }, [courses])

  const filteredCourses = useMemo(() => {
    if (selectedPathFilter === 'all') return courses
    return courses.filter((course) => course.path_id === selectedPathFilter)
  }, [courses, selectedPathFilter])

  const { data: modules, isLoading } = useQuery<ModuleWithMeta[]>({
    queryKey: ['admin-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, slug, summary, order, course_id, is_published, published_at, updated_at, lessons:lessons(id)')
        .order('course_id', { ascending: true })
        .order('order', { ascending: true })

      if (error) throw error

      type QueryRow = ModuleRow & { lessons?: { id: string }[] }

      return ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        lessonCount: Array.isArray(item.lessons) ? item.lessons.length : 0,
      }))
    },
  })

  const filteredModules = useMemo(() => {
    if (!modules) return []
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

  const upsertMutation = useMutation({
    mutationFn: async (values: ModuleFormValues) => {
      const payload = {
        course_id: values.course_id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        summary: values.summary?.trim() ? values.summary.trim() : null,
        order: values.order,
        is_published: values.is_published,
        published_at: values.is_published
          ? editingModule?.published_at ?? new Date().toISOString()
          : null,
      }

      if (editingModule) {
        const { error } = await supabase.from('modules').update(payload).eq('id', editingModule.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('modules')
          .insert({
            ...payload,
            published_at: values.is_published ? new Date().toISOString() : null,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success(editingModule ? 'Module updated' : 'Module created')
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving module', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save module')
    },
  })

  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { error } = await supabase
        .from('modules')
        .update({ is_published: publish, published_at: publish ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success('Publish state updated')
    },
    onError: (error) => {
      console.error('Error toggling publish', error)
      toast.error(error instanceof Error ? error.message : 'Failed to toggle publish state')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('modules').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success('Module deleted')
      setDeleteTarget(null)
    },
    onError: (error) => {
      console.error('Error deleting module', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete module')
    },
  })

  const openForCreate = () => {
    setEditingModule(null)
    setSlugManuallyEdited(false)
    form.reset({
      course_id: selectedCourseFilter !== 'all' ? selectedCourseFilter : '',
      title: '',
      slug: '',
      summary: '',
      order: 1,
      is_published: false,
    })
    setDialogOpen(true)
  }

  const openForEdit = (module: ModuleWithMeta) => {
    setEditingModule(module)
    setSlugManuallyEdited(true)
    form.reset({
      course_id: module.course_id ?? '',
      title: module.title ?? '',
      slug: module.slug ?? '',
      summary: module.summary ?? '',
      order: module.order ?? 1,
      is_published: module.is_published,
    })
    setDialogOpen(true)
  }

  const onSubmit = (values: ModuleFormValues) => {
    upsertMutation.mutate(values)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">Modules</h2>
          <p className="text-sm text-forge-gray">
            Structure lessons within courses. Manage ordering and publish visibility for each module.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Select
            value={selectedPathFilter}
            onValueChange={(value) => {
              setSelectedPathFilter(value as 'all' | string)
              setSelectedCourseFilter('all')
            }}
          >
            <SelectTrigger className="w-[220px]">
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
            onValueChange={(value) => setSelectedCourseFilter(value as 'all' | string)}
          >
            <SelectTrigger className="w-[220px]">
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

          <Button onClick={openForCreate} className="md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Module
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading modules...
          </CardContent>
        </Card>
      ) : filteredModules && filteredModules.length > 0 ? (
        <div className="grid gap-4">
          {filteredModules.map((module) => {
            const course = module.course_id ? courseLookup[module.course_id] : null
            const path = course?.path_id ? pathLookup[course.path_id] : null

            return (
              <Card key={module.id} className="border border-forge-cream/70 bg-white/80">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-forge-dark">
                      #{module.order} · {module.title}
                      <Badge
                        variant={module.is_published ? 'default' : 'outline'}
                        className={module.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}
                      >
                        {module.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm text-forge-gray">
                      {module.summary || 'No summary'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openForEdit(module)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteTarget(module)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-forge-gray">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="font-semibold text-forge-dark">Course:</span>{' '}
                      {course ? course.title : 'Unassigned'}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">Path:</span>{' '}
                      {path ? path.title : 'Unassigned'}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">Slug:</span> {module.slug}
                    </div>
                    <Separator orientation="vertical" className="hidden h-4 sm:block" />
                    <div>
                      <span className="font-semibold text-forge-dark">Lessons:</span> {module.lessonCount}
                    </div>
                  </div>
                  <div className="text-xs text-forge-gray/80">
                    Updated {module.updated_at ? formatDistanceToNow(new Date(module.updated_at), { addSuffix: true }) : 'N/A'}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Switch
                      id={`module-publish-${module.id}`}
                      checked={module.is_published}
                      onCheckedChange={(checked) => publishMutation.mutate({ id: module.id, publish: checked })}
                      disabled={publishMutation.isPending}
                    />
                    <label htmlFor={`module-publish-${module.id}`} className="text-forge-gray">
                      {module.is_published ? 'Unpublish' : 'Publish'}
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
            No modules found for this filter. Create a new module to organize lessons.
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit module' : 'New module'}</DialogTitle>
            <DialogDescription>
              {editingModule
                ? 'Adjust module metadata, ordering, and publish visibility.'
                : 'Create a module within a course to group related lessons.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
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
                        <Input placeholder="e.g. React Fundamentals" {...field} />
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
                          placeholder="react-fundamentals"
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
                      <Input placeholder="Optional highlight for the module" {...field} />
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
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish immediately</FormLabel>
                      <DialogDescription>
                        {field.value
                          ? 'Published modules are available inside the course.'
                          : 'Keep as draft until lessons are ready.'}
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
                  ) : editingModule ? (
                    'Save changes'
                  ) : (
                    'Create module'
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
            <AlertDialogTitle>Delete module</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting a module will remove all its lessons. This action cannot be undone. Continue deleting
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
