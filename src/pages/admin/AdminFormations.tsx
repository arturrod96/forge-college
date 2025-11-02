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
import { Loader2, Plus, Pencil, Trash2, BookOpen, Users } from 'lucide-react'
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
})

type FormationFormData = z.infer<typeof formationSchema>

export function AdminFormations() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingFormation, setEditingFormation] = useState<FormationWithMeta | null>(null)
  const [deletingFormation, setDeletingFormation] = useState<FormationWithMeta | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const queryClient = useQueryClient()
  const supabase = createClientBrowser()

  const form = useForm<FormationFormData>({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      thumbnail_url: '',
      is_published: false,
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: FormationInsert) => {
      const { error } = await supabase.from('formations').insert(data)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      setDialogOpen(false)
      form.reset()
      setSlugManuallyEdited(false)
      toast.success('Formation created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create formation: ' + error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormationInsert }) => {
      const { error } = await supabase.from('formations').update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      setDialogOpen(false)
      setEditingFormation(null)
      form.reset()
      setSlugManuallyEdited(false)
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

  useEffect(() => {
    if (dialogOpen && editingFormation) {
      form.reset({
        title: editingFormation.title,
        description: editingFormation.description || '',
        slug: editingFormation.slug || '',
        thumbnail_url: editingFormation.thumbnail_url || '',
        is_published: editingFormation.is_published,
      })
    } else if (dialogOpen) {
      form.reset({
        title: '',
        description: '',
        slug: '',
        thumbnail_url: '',
        is_published: false,
      })
      setSlugManuallyEdited(false)
    }
  }, [dialogOpen, form, editingFormation])

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
          id, title, slug, description, is_published, published_at, created_at, updated_at,
          formation_paths!inner(
            learning_paths!inner(id, title)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((formation) => ({
        ...formation,
        paths_count: formation.formation_paths?.length || 0,
        paths: formation.formation_paths?.map((fp: any) => ({
          id: fp.learning_paths.id,
          title: fp.learning_paths.title,
          order: fp.order,
        })) || [],
      }))
    },
  })

  const handleSubmit = (data: FormationFormData) => {
    if (editingFormation) {
      updateMutation.mutate({ id: editingFormation.id, data })
    } else {
      createMutation.mutate(data)
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
                    {formation.is_published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{formation.description}</CardDescription>
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
        <DialogContent className="sm:max-w-[425px]">
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
