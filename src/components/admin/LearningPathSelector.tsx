import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, X, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'

type LearningPath = Tables<'learning_paths'>['Row']
interface LearningPathSelectorProps {
  formationId: string
  selectedPaths: Array<{ id: string; title: string; order: number }>
  onPathsChange: Dispatch<SetStateAction<Array<{ id: string; title: string; order: number }>>>
}

export function LearningPathSelector({ formationId, selectedPaths, onPathsChange }: LearningPathSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const supabase = createClientBrowser()

  const { data: availablePaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ['available-learning-paths', formationId],
    queryFn: async () => {
      // Get all published paths
      const { data: allPaths, error: allPathsError } = await supabase
        .from('learning_paths')
        .select('id, title, slug, status')
        .eq('status', 'published')
        .order('title')

      if (allPathsError) throw allPathsError

      // Get already selected paths for this formation
      const { data: existingPaths, error: existingError } = await supabase
        .from('formation_paths')
        .select('learning_path_id')
        .eq('formation_id', formationId)

      if (existingError) throw existingError

      const selectedIds = new Set(existingPaths?.map(p => p.learning_path_id) || [])
      
      return allPaths?.filter(path => !selectedIds.has(path.id)) || []
    },
  })

  const addPathMutation = useMutation({
    mutationFn: async ({ path, order }: { path: LearningPath; order: number }) => {
      const { error } = await supabase.from('formation_paths').insert({
        formation_id: formationId,
        learning_path_id: path.id,
        order,
      })
      if (error) throw error
      return path
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-learning-paths', formationId] })
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      toast.success('Path added to formation')
    },
    onError: (error) => {
      toast.error('Failed to add path: ' + error.message)
    },
  })

  const removePathMutation = useMutation({
    mutationFn: async (pathId: string) => {
      const { error } = await supabase
        .from('formation_paths')
        .delete()
        .eq('formation_id', formationId)
        .eq('learning_path_id', pathId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-learning-paths', formationId] })
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      toast.success('Path removed from formation')
    },
    onError: (error) => {
      toast.error('Failed to remove path: ' + error.message)
    },
  })

  const reorderPathMutation = useMutation({
    mutationFn: async ({ pathId, newOrder }: { pathId: string; newOrder: number }) => {
      const { error } = await supabase
        .from('formation_paths')
        .update({ order: newOrder })
        .eq('formation_id', formationId)
        .eq('learning_path_id', pathId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-formations'] })
      toast.success('Path order updated')
    },
    onError: (error) => {
      toast.error('Failed to reorder path: ' + error.message)
    },
  })

  const handleAddPath = async (path: LearningPath) => {
    const nextOrder = selectedPaths.length + 1
    try {
      await addPathMutation.mutateAsync({ path, order: nextOrder })
      onPathsChange((current) => [
        ...current,
        { id: path.id, title: path.title, order: nextOrder },
      ])
    } catch {
      // toast already handled in mutation onError
    }
  }

  const handleRemovePath = async (pathId: string) => {
    try {
      await removePathMutation.mutateAsync(pathId)
      onPathsChange((current) => {
        const remaining = current.filter((path) => path.id !== pathId)
        return remaining
          .map((path, index) => ({
            ...path,
            order: index + 1,
          }))
      })
    } catch {
      // toast handled
    }
  }

  const handleMovePath = (pathId: string, direction: 'up' | 'down') => {
    const currentIndex = selectedPaths.findIndex(p => p.id === pathId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= selectedPaths.length) return

    const reorderedPaths = [...selectedPaths]
    const [movedPath] = reorderedPaths.splice(currentIndex, 1)
    reorderedPaths.splice(newIndex, 0, movedPath)

    // Update the order for all paths
    const updatedPaths = reorderedPaths.map((path, index) => ({
      ...path,
      order: index + 1,
    }))

    onPathsChange(updatedPaths)

    // Update database
    reorderPathMutation.mutate({ pathId, newOrder: newIndex + 1 })
  }

  const filteredPaths = availablePaths?.filter(path =>
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const sortedSelectedPaths = useMemo(
    () => [...selectedPaths].sort((a, b) => a.order - b.order),
    [selectedPaths]
  )

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-paths">Add Learning Paths</Label>
        <Input
          id="search-paths"
          placeholder="Search paths..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="h-48 border rounded-md p-2">
          <div className="space-y-2">
            {filteredPaths.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchTerm ? 'No paths found' : 'All available paths are already added'}
              </p>
            ) : (
              filteredPaths.map((path) => (
                <div
                  key={path.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded"
                >
                  <div>
                    <div className="font-medium">{path.title}</div>
                    <div className="text-sm text-muted-foreground">{path.slug}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddPath(path)}
                    disabled={addPathMutation.isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}

      {selectedPaths.length > 0 && (
        <>
          <Separator />
          <div>
            <Label>Selected Paths ({selectedPaths.length})</Label>
            <div className="mt-2 space-y-2">
              {sortedSelectedPaths.map((path, index) => (
                  <div
                    key={path.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMovePath(path.id, 'up')}
                          disabled={index === 0 || reorderPathMutation.isPending}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMovePath(path.id, 'down')}
                          disabled={index === selectedPaths.length - 1 || reorderPathMutation.isPending}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div>
                        <div className="font-medium">{path.title}</div>
                        <Badge variant="secondary" className="text-xs">
                          Order: {path.order}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemovePath(path.id)}
                      disabled={removePathMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
