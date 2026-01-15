import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'
import { useAuth } from '@/hooks/useOAuth'
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type FormationRow = Tables<'formations'>['Row']
type FormationInsert = Tables<'formations'>['Insert']

type FormationPathRow = Tables<'formation_paths'>['Row']
type LearningPathRow = Tables<'learning_paths'>['Row']

type FormationQueryRow = FormationRow & {
  formation_paths?: Array<
    Pick<FormationPathRow, 'order'> & {
      learning_paths: Pick<LearningPathRow, 'id' | 'title'> | null
    }
  > | null
}

interface FormationWithMeta extends FormationRow {
  paths_count?: number
  paths?: Array<{
    id: string
    title: string
    order: number
  }>
}

const formationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  is_published: z.boolean(),
  status: z.enum(['draft', 'published', 'coming_soon']),
})

type FormationFormData = z.infer<typeof formationSchema>

export function AdminFormations() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFormation, setEditingFormation] = useState<FormationWithMeta | null>(null)
  const [deletingFormation, setDeletingFormation] = useState<FormationWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [selectedPathsState, setSelectedPathsState] = useState<
    Array<{ id: string; title: string; order: number }>
  >([])

  const queryClient = useQueryClient()
  const supabase = createClientBrowser()
  const { user } = useAuth()

  const form = useForm<FormationFormData>({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      thumbnail_url: '',
      is_published: false,
      status: 'draft',
    },
  })

  const buildFormationPayload = (values: FormationFormData) => {
    const baseStatus = values.status
    const statusFromSelection = baseStatus === 'published' || baseStatus === 'coming_soon'
    const effectiveStatus = statusFromSelection
      ? baseStatus
      : values.is_published
        ? 'published'
        : 'draft'

    const isPublishedFlag = effectiveStatus !== 'draft'

    return {
      title: values.title.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      slug: values.slug.trim(),
      thumbnail_url: values.thumbnail_url?.trim()
        ? values.thumbnail_url.trim()
        : null,
      status: effectiveStatus,
      is_published: isPublishedFlag,
    }
  }

  const resetFormForCreate = useCallback(() => {
    form.reset({
      title: '',
      description: '',
      slug: '',
      thumbnail_url: '',
      is_published: false,
      status: 'draft',
    })
    setSlugManuallyEdited(false)
    setSelectedPathsState([])
  }, [form])

  useEffect(() => {
    if (dialogOpen && editingFormation) {
      form.reset({
        title: editingFormation.title,
        description: editingFormation.description || '',
        slug: editingFormation.slug || '',
        thumbnail_url: editingFormation.thumbnail_url || '',
        is_published: editingFormation.is_published,
        status: editingFormation.status ?? 'draft',
      })

      const orderedPaths =
        editingFormation.paths?.slice().sort((a, b) => a.order - b.order) ?? []
      setSelectedPathsState(orderedPaths)
    } else if (dialogOpen) {
      resetFormForCreate()
    }
  }, [dialogOpen, editingFormation, form, resetFormForCreate])

  useEffect(() => {
    if (!dialogOpen) {
      resetFormForCreate()
      setEditingFormation(null)
      setDeletingFormation(null)
    }
  }, [dialogOpen, resetFormForCreate])

  const createMutation = useMutation({
    mutationFn: async (payload: ReturnType<typeof buildFormationPayload>) => {
      const insertPayload: FormationInsert = {
        ...payload,
        created_by: user?.id ?? undefined,
        updated_by: user?.id ?? undefined,
        published_at: payload.is_published ? new Date().toISOString() : null,
      }
      const { error } = await supabase.from('formations').insert(insertPayload)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      setDialogOpen(false)
      resetFormForCreate()
      toast.success('Formation created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create formation: ' + error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
      previous,
    }: {
      id: string
      payload: ReturnType<typeof buildFormationPayload>
      previous: FormationWithMeta
    }) => {
      const updatePayload: FormationInsert = {
        ...payload,
        updated_by: user?.id ?? undefined,
        published_at: payload.is_published
          ? previous.published_at ?? new Date().toISOString()
          : null,
      }
      const { error } = await supabase.from('formations').update(updatePayload).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      setDialogOpen(false)
      setEditingFormation(null)
      resetFormForCreate()
      toast.success('Formation updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update formation: ' + error.message)
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
      toast.error('Failed to delete formation: ' + error.message)
    },
  })

  const watchedTitle = form.watch('title')
  const watchedSlug = form.watch('slug')

  useEffect(() => {
    if (!slugManuallyEdited && !editingFormation) {
      const generated = slugify(watchedTitle ?? '')
      if (generated && generated !== watchedSlug) {
        form.setValue('slug', generated, { shouldValidate: false })
      }
    }
  }, [watchedTitle, slugManuallyEdited, editingFormation, watchedSlug, form])

  const { data: formations, isLoading } = useQuery<FormationWithMeta[]>({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select(`
          id, title, slug, description, is_published, status, published_at, created_at, updated_at,
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
        } as FormationWithMeta
      })
    },
  })

  const handleSubmit = (data: FormationFormData) => {
    const payload = buildFormationPayload(data)
    if (editingFormation) {
      updateMutation.mutate({
        id: editingFormation.id,
        payload,
        previous: editingFormation,
      })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleEdit = (formation: FormationWithMeta) => {
    setEditingFormation(formation)
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

  const handleAddNew = () => {
    setEditingFormation(null)
    resetFormForCreate()
    setDialogOpen(true)
  }

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
          <p className="text-muted-foreground">Manage learning formations and their paths</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Formation
        </Button>
      </div>

      <div className="grid gap-4">
        {formations?.map((formation) => (
          <Card key={formation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {formation.title}
                    {formation.status === 'published' ? (
                      <Badge variant="default">Available</Badge>
                    ) : formation.status === 'coming_soon' ? (
                      <Badge variant="secondary">Coming Soon</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {formation.description || 'No description provided'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(formation)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(formation)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {formation.paths_count} paths
                </div>
                <div>Created {formatDistanceToNow(new Date(formation.created_at))} ago</div>
                {formation.published_at && (
                  <div>Published {formatDistanceToNow(new Date(formation.published_at))} ago</div>
                )}
              </div>
              {formation.paths && formation.paths.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Learning Paths:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formation.paths.map((path) => (
                      <Badge key={path.id} variant="outline">
                        {path.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFormation ? 'Edit Formation' : 'Create Formation'}
            </DialogTitle>
            <DialogDescription>
              {editingFormation
                ? 'Update the formation details below.'
                : 'Fill in the details to create a new formation.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
              <div className="space-y-4 overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Formation title" {...field} />
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
                          placeholder="formation-slug"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setSlugManuallyEdited(true)
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
                          placeholder="Formation description"
                          className="resize-none"
                          {...field}
                        />
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
                        <Input placeholder="https://example.com/image.jpg" {...field} />
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
                            const value = event.target.value as FormationFormData['status']
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
                        Draft formations stay private. Coming soon keeps it visible but routes users to the waiting list.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Make this formation visible to users
                        </FormDescription>
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
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                    <p className="text-sm text-muted-foreground">
                      Save the formation first to associate learning paths.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingFormation ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the formation
              "{deletingFormation?.title}" and remove all associated path assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
