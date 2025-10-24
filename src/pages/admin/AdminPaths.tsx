import { useEffect, useMemo, useState } from 'react'
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
  CardFooter,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const pathFormSchema = z.object({
  title: z.string().min(3, 'Title must have at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must have at least 3 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().optional().or(z.literal('')),
  is_published: z.boolean().default(false),
})

type PathFormValues = z.infer<typeof pathFormSchema>

type LearningPathRow = Tables<'learning_paths'>

type LearningPathWithMeta = LearningPathRow & {
  courses?: { id: string }[]
  courseCount: number
}

export default function AdminPaths() {
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<LearningPathWithMeta | null>(null)
  const [editingPath, setEditingPath] = useState<LearningPathWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const form = useForm<PathFormValues>({
    resolver: zodResolver(pathFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      is_published: false,
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

  const { data: paths, isLoading } = useQuery<LearningPathWithMeta[]>({
    queryKey: ['admin-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('id, title, slug, description, is_published, published_at, created_at, updated_at, courses:courses(id)')
        .order('created_at', { ascending: false })

      if (error) throw error

      type QueryRow = LearningPathRow & { courses?: { id: string }[] }

      return ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        courseCount: Array.isArray(item.courses) ? item.courses.length : 0,
      }))
    },
  })

  const upsertMutation = useMutation({
    mutationFn: async (values: PathFormValues) => {
      const payload = {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description?.trim() ? values.description.trim() : null,
        is_published: values.is_published,
        published_at: values.is_published
          ? editingPath?.published_at ?? new Date().toISOString()
          : null,
      }

      if (editingPath) {
        const { error } = await supabase
          .from('learning_paths')
          .update(payload)
          .eq('id', editingPath.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('learning_paths').insert({
          ...payload,
          published_at: values.is_published ? new Date().toISOString() : null,
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

  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { error } = await supabase
        .from('learning_paths')
        .update({
          is_published: publish,
          published_at: publish ? new Date().toISOString() : null,
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
    form.reset({ title: '', slug: '', description: '', is_published: false })
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
    })
    setDialogOpen(true)
  }

  const onSubmit = (values: PathFormValues) => {
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
                    <Badge variant={path.is_published ? 'default' : 'outline'} className={path.is_published ? 'bg-forge-orange text-white hover:bg-forge-orange/90' : ''}>
                      {path.is_published ? 'Published' : 'Draft'}
                    </Badge>
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
                    <span className="font-semibold text-forge-dark">Courses:</span> {path.courseCount}
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
                      publishMutation.mutate({ id: path.id, publish: checked })
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPath ? 'Edit learning path' : 'New learning path'}</DialogTitle>
            <DialogDescription>
              {editingPath
                ? 'Update title, slug, or publication state. Changes go live immediately.'
                : 'Define the high-level journey for learners. You can add courses after saving.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
