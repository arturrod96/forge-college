import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientBrowser } from '@/lib/supabase'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { DASHBOARD_ADMIN_LESSONS } from '@/routes/paths'

export default function AdminLessonEditorPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const supabase = useMemo(() => createClientBrowser(), [])
  const queryClient = useQueryClient()

  const [content, setContent] = useState('')
  const [initialContent, setInitialContent] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Load lesson data
  useEffect(() => {
    async function loadLesson() {
      if (!lessonId) return

      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('title, content, lesson_type')
          .eq('id', lessonId)
          .single()

        if (error) throw error

        if (data.lesson_type !== 'text') {
          toast.error('Only text lessons can be edited in this editor')
          navigate(DASHBOARD_ADMIN_LESSONS)
          return
        }

        const loadedContent = typeof data.content === 'string' ? data.content : ''
        setContent(loadedContent)
        setInitialContent(loadedContent)
        setTitle(data.title)
      } catch (error) {
        console.error('Error loading lesson:', error)
        toast.error('Failed to load lesson content')
        navigate(DASHBOARD_ADMIN_LESSONS)
      } finally {
        setIsLoading(false)
      }
    }

    loadLesson()
  }, [lessonId, supabase, navigate])

  const saveMutation = useMutation({
    mutationFn: async (newContent: string) => {
      if (!lessonId) throw new Error('No lesson ID')

      const { error } = await supabase
        .from('lessons')
        .update({ content: newContent })
        .eq('id', lessonId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] })
      setInitialContent(content)
      toast.success('Lesson content saved')
    },
    onError: (error) => {
      console.error('Error saving lesson:', error)
      toast.error('Failed to save changes')
    },
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveMutation.mutateAsync(content)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExit = () => {
    if (content !== initialContent) {
      setShowExitDialog(true)
    } else {
      navigate(DASHBOARD_ADMIN_LESSONS)
    }
  }

  const handleConfirmExit = () => {
    navigate(DASHBOARD_ADMIN_LESSONS)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forge-orange" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Lesson Content</h1>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || content === initialContent}
            className={content !== initialContent ? "bg-forge-orange hover:bg-forge-orange/90" : ""}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto bg-white shadow-sm my-4 rounded-lg overflow-hidden border">
           <RichTextEditor
             value={content}
             onChange={setContent}
             placeholder="Start writing your lesson content..."
             hideFullScreen // Hide fullscreen button since we are already in a full page
           />
        </div>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit} className="bg-red-500 hover:bg-red-600">
              Leave without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
