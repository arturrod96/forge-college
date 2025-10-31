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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const stripHtml = (value: string | null | undefined) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, '').trim()
}

type ModuleRow = Tables<'modules'>

type ModuleOption = ModuleRow & {
  course?: { id: string; title: string } | null
}

type ModuleProjectRow = Tables<'module_projects'>

type ModuleProjectWithModule = ModuleProjectRow & {
  module: (ModuleRow & { course?: { id: string; title: string } | null }) | null
}

type ProjectFormValues = {
  module_id: string
  title: string
  description: string
  xp_value: number | null
  is_active: boolean
}

export function AdminProjects() {
  const { t } = useTranslation()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ModuleProjectWithModule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ModuleProjectWithModule | null>(null)
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<'all' | string>('all')

  const formSchema = useMemo(
    () =>
      z.object({
        module_id: z.string().uuid(t('admin.projects.validation.moduleRequired')),
        title: z.string().min(3, t('admin.projects.validation.titleMin')),
        description: z.string().optional().or(z.literal('')),
        xp_value: z
          .union([z.literal(''), z.coerce.number().int().min(0, t('admin.projects.validation.xpMin'))])
          .transform((value) => (value === '' ? null : value)),
        is_active: z.boolean(),
      }),
    [t]
  )

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      module_id: '',
      title: '',
      description: '',
      xp_value: null,
      is_active: true,
    },
  })

  useEffect(() => {
    if (!dialogOpen) {
      setEditingProject(null)
      form.reset({
        module_id: '',
        title: '',
        description: '',
        xp_value: null,
        is_active: true,
      })
    }
  }, [dialogOpen, form])

  const { data: modules = [], isLoading: loadingModules } = useQuery<ModuleOption[]>({
    queryKey: ['admin-module-projects-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, order, course:courses(id, title)')
        .order('order', { ascending: true })

      if (error) throw error

      type QueryRow = ModuleRow & { course?: { id: string; title: string } | null }

      return ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        course: item.course ?? null,
      }))
    },
  })

  const { data: projects = [], isLoading } = useQuery<ModuleProjectWithModule[]>({
    queryKey: ['admin-module-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_projects')
        .select(
          'id, module_id, title, description, xp_value, is_active, module:modules(id, title, order, course:courses(id, title))'
        )
        .order('module_id', { ascending: true })
        .order('created_at', { ascending: true })
        .order('title', { ascending: true })

      if (error) throw error

      type QueryRow = ModuleProjectRow & {
        module: (ModuleRow & { course?: { id: string; title: string } | null }) | null
      }

      return ((data ?? []) as QueryRow[]).map((item) => ({
        ...item,
        module: item.module ?? null,
      }))
    },
    onError: (error) => {
      console.error('Error loading projects', error)
      toast.error(t('admin.projects.notifications.loadError'))
    },
  })

  const filteredProjects = useMemo(() => {
    if (selectedModuleFilter === 'all') return projects
    return projects.filter((project) => project.module_id === selectedModuleFilter)
  }, [projects, selectedModuleFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, { module: ModuleProjectWithModule['module']; items: ModuleProjectWithModule[] }>()
    filteredProjects.forEach((project) => {
      const key = project.module_id || 'unassigned'
      if (!map.has(key)) {
        map.set(key, { module: project.module ?? null, items: [] })
      }
      map.get(key)!.items.push(project)
    })

    return Array.from(map.entries())
      .sort((a, b) => {
        const moduleAOrder = a[1].module?.order ?? Number.MAX_SAFE_INTEGER
        const moduleBOrder = b[1].module?.order ?? Number.MAX_SAFE_INTEGER
        if (moduleAOrder !== moduleBOrder) return moduleAOrder - moduleBOrder
        const titleA = a[1].module?.title ?? ''
        const titleB = b[1].module?.title ?? ''
        return titleA.localeCompare(titleB)
      })
      .map(([key, value]) => ({ key, ...value }))
  }, [filteredProjects])

  const upsertMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const payload = {
        module_id: values.module_id,
        title: values.title.trim(),
        description: values.description?.trim() ? values.description.trim() : null,
        xp_value: values.xp_value,
        is_active: values.is_active,
      }

      if (editingProject) {
        const { error } = await supabase.from('module_projects').update(payload).eq('id', editingProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('module_projects').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-module-projects'] })
      toast.success(
        editingProject
          ? t('admin.projects.notifications.updated')
          : t('admin.projects.notifications.created')
      )
      setDialogOpen(false)
    },
    onError: (error) => {
      console.error('Error saving project', error)
      toast.error(t('admin.projects.notifications.saveError'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('module_projects').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-module-projects'] })
      toast.success(t('admin.projects.notifications.deleted'))
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    },
    onError: (error) => {
      console.error('Error deleting project', error)
      toast.error(t('admin.projects.notifications.deleteError'))
    },
  })

  const openForCreate = useCallback(() => {
    setEditingProject(null)
    form.reset({
      module_id: '',
      title: '',
      description: '',
      xp_value: null,
      is_active: true,
    })
    setDialogOpen(true)
  }, [form, setDialogOpen])

  const openForEdit = useCallback(
    (project: ModuleProjectWithModule) => {
      setEditingProject(project)
      form.reset({
        module_id: project.module_id,
        title: project.title,
        description: project.description ?? '',
        xp_value: project.xp_value ?? null,
        is_active: project.is_active ?? true,
      })
      setDialogOpen(true)
    },
    [form, setDialogOpen]
  )

  const handleDeleteClick = useCallback(
    (project: ModuleProjectWithModule) => {
      setDeleteTarget(project)
      setDeleteDialogOpen(true)
    },
    []
  )

  const onSubmit = (values: ProjectFormValues) => {
    upsertMutation.mutate(values)
  }

  const moduleOptions = useMemo(() => {
    return modules.slice().sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.title.localeCompare(b.title)
    })
  }, [modules])

  const renderedGroups = useMemo(
    () =>
      grouped.map(({ key, module, items }) => (
        <Card key={key} className="border border-forge-cream/70 bg-white/80">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-forge-dark">
                {module ? `${module.title}` : t('admin.projects.unassignedModule')}
              </CardTitle>
              {module?.course && (
                <CardDescription className="text-sm text-forge-gray">
                  {t('admin.projects.labels.course', { course: module.course.title })}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((project, index) => {
              const sequence = index + 1
              return (
                <div
                  key={project.id}
                  className="rounded-lg border border-forge-cream/60 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-forge-orange/10 px-2 py-0.5 text-xs font-medium text-forge-orange">
                          {t('admin.projects.labels.projectNumber', { number: sequence })}
                        </span>
                        <h3 className="text-lg font-semibold text-forge-dark">{project.title}</h3>
                        {!project.is_active && (
                          <Badge variant="outline" className="border-red-200 text-red-600">
                            {t('admin.projects.labels.inactive')}
                          </Badge>
                        )}
                        {typeof project.xp_value === 'number' && (
                          <Badge variant="secondary" className="bg-forge-cream text-forge-dark">
                            {t('admin.projects.labels.xpValue', { xp: project.xp_value })}
                          </Badge>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-forge-gray/90 line-clamp-2">{stripHtml(project.description)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openForEdit(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )),
    [grouped, handleDeleteClick, openForEdit, t]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-forge-dark">{t('admin.projects.title')}</h2>
          <p className="text-sm text-forge-gray">{t('admin.projects.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Select
            value={selectedModuleFilter}
            onValueChange={(value) => setSelectedModuleFilter(value as 'all' | string)}
            disabled={loadingModules}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder={t('admin.projects.filters.modulePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.projects.filters.allModules')}</SelectItem>
              {moduleOptions.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.course ? `${module.course.title} · ${module.title}` : module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openForCreate} disabled={loadingModules || moduleOptions.length === 0} className="md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.projects.actions.newProject')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="flex items-center gap-3 p-8 text-forge-gray">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('admin.projects.loading')}
          </CardContent>
        </Card>
      ) : grouped.length === 0 ? (
        <Card className="border border-dashed border-forge-cream/70 bg-white/80">
          <CardContent className="p-8 text-center text-sm text-forge-gray">
            {t('admin.projects.emptyState')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">{renderedGroups}</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject
                ? t('admin.projects.dialog.editTitle')
                : t('admin.projects.dialog.createTitle')}
            </DialogTitle>
            <DialogDescription>{t('admin.projects.dialog.description')}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="module_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.projects.form.module')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.projects.form.modulePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moduleOptions.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.course ? `${module.course.title} · ${module.title}` : module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.projects.form.title')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('admin.projects.form.titlePlaceholder')} />
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
                    <FormLabel>{t('admin.projects.form.description')}</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} placeholder={t('admin.projects.form.descriptionPlaceholder')} />
                    </FormControl>
                    <FormDescription>{t('admin.projects.form.descriptionHelp')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="xp_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.projects.form.xpValue')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value
                          field.onChange(value === '' ? null : Number(value))
                        }}
                        placeholder={t('admin.projects.form.xpValuePlaceholder')}
                      />
                    </FormControl>
                    <FormDescription>{t('admin.projects.form.xpValueHelp')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-forge-cream/70 bg-forge-cream/10 p-3">
                    <div className="space-y-1">
                      <FormLabel className="text-base">{t('admin.projects.form.activeLabel')}</FormLabel>
                      <FormDescription>{t('admin.projects.form.activeDescription')}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('common.buttons.cancel')}
                </Button>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending
                    ? t('common.buttons.saving')
                    : editingProject
                    ? t('common.buttons.update')
                    : t('common.buttons.create')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.projects.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.projects.delete.description', { title: deleteTarget?.title ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              {t('common.buttons.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id)
                }
              }}
            >
              {deleteMutation.isPending
                ? t('common.buttons.loading')
                : t('admin.projects.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminProjects
