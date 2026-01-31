import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  FileCode,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { toDirectGoogleDriveImageUrl } from '@/lib/sanitizeHtml'

type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

type ObjectPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'

type AspectRatio = '1/1' | '16/9' | '4/3' | '3/4'

type ImageAttributes = {
  src: string
  alt?: string | null
  width?: string | null
  height?: string | null
  objectFit?: ObjectFit | null
  objectPosition?: ObjectPosition | null
  aspectRatio?: AspectRatio | null
}

const getImgFromElement = (element: HTMLElement): HTMLImageElement | null => {
  if (element instanceof HTMLImageElement) return element
  return element.querySelector('img')
}

const ForgeImage = Image.extend({
  parseHTML() {
    return [
      {
        tag: 'span[data-forge-image]',
        getAttrs: (node) => {
          const wrapper = node as HTMLElement
          const img = getImgFromElement(wrapper)
          if (!img) return false

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: img.style.width || null,
            height: img.style.height || null,
            objectFit: (img.style.objectFit as ObjectFit) || null,
            objectPosition: (img.style.objectPosition as ObjectPosition) || null,
            aspectRatio: (img.style.aspectRatio as AspectRatio) || null,
          }
        },
      },
      { tag: 'img[src]' },
    ]
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => getImgFromElement(element as HTMLElement)?.style.width || null,
      },
      height: {
        default: null,
        parseHTML: (element) => getImgFromElement(element as HTMLElement)?.style.height || null,
      },
      objectFit: {
        default: null,
        parseHTML: (element) => (getImgFromElement(element as HTMLElement)?.style.objectFit as ObjectFit) || null,
      },
      objectPosition: {
        default: null,
        parseHTML: (element) =>
          (getImgFromElement(element as HTMLElement)?.style.objectPosition as ObjectPosition) || null,
      },
      aspectRatio: {
        default: null,
        parseHTML: (element) => (getImgFromElement(element as HTMLElement)?.style.aspectRatio as AspectRatio) || null,
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { width, height, objectFit, objectPosition, aspectRatio, style, class: cls, ...rest } =
      HTMLAttributes as Record<string, any>

    const styleParts: string[] = []
    if (width) styleParts.push(`width: ${width};`)
    if (height) styleParts.push(`height: ${height};`)
    if (objectFit) styleParts.push(`object-fit: ${objectFit};`)
    if (objectPosition) styleParts.push(`object-position: ${objectPosition};`)
    if (aspectRatio) styleParts.push(`aspect-ratio: ${aspectRatio};`)

    const nextStyle = [style, styleParts.join(' ')].filter(Boolean).join(' ')
    const nextClass = [this.options.HTMLAttributes?.class, cls].filter(Boolean).join(' ') || undefined

    return [
      'span',
      {
        'data-forge-image': 'true',
        class: 'forge-rte-image-wrapper',
      },
      [
        'img',
        {
          ...this.options.HTMLAttributes,
          ...rest,
          class: nextClass,
          style: nextStyle || undefined,
        },
      ],
    ]
  },
}).configure({
  HTMLAttributes: {
    class: 'rounded-lg max-w-full h-auto',
  },
})

const pxFromString = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed.endsWith('px')) return ''
  const asNumber = Number.parseInt(trimmed.slice(0, -2), 10)
  return Number.isFinite(asNumber) ? String(asNumber) : ''
}

const toPx = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const asNumber = Number.parseInt(trimmed, 10)
  if (!Number.isFinite(asNumber) || asNumber <= 0) return null
  return `${asNumber}px`
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hideFullScreen?: boolean
  onExpand?: () => void
}

export function RichTextEditor({ value, onChange, placeholder, hideFullScreen, onExpand }: RichTextEditorProps) {
  const { t, i18n } = useTranslation()

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isSourceView, setIsSourceView] = useState(false)

  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')
  const [imageObjectFit, setImageObjectFit] = useState<ObjectFit>('contain')
  const [imageObjectPosition, setImageObjectPosition] = useState<ObjectPosition>('center')
  const [imageAspectRatio, setImageAspectRatio] = useState<AspectRatio | 'auto'>('auto')

  const [editImageDialogOpen, setEditImageDialogOpen] = useState(false)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editImageAlt, setEditImageAlt] = useState('')
  const [editImageWidth, setEditImageWidth] = useState('')
  const [editImageHeight, setEditImageHeight] = useState('')
  const [editImageObjectFit, setEditImageObjectFit] = useState<ObjectFit>('contain')
  const [editImageObjectPosition, setEditImageObjectPosition] = useState<ObjectPosition>('center')
  const [editImageAspectRatio, setEditImageAspectRatio] = useState<AspectRatio | 'auto'>('auto')

  const uiGuardsRef = useRef({ isSourceView: false, imageDialogOpen: false })

  const [sourceCode, setSourceCode] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-forge-orange hover:underline cursor-pointer',
        },
      }),
      ForgeImage,
      Youtube.configure({
        controls: false,
        width: 640,
        height: 480,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4',
      },
      handleClickOn: (_view, _pos, node) => {
        if (node.type.name !== 'image') return false

        const { isSourceView, imageDialogOpen } = uiGuardsRef.current
        if (isSourceView || imageDialogOpen) return false

        const attrs = node.attrs as ImageAttributes

        setEditImageUrl(attrs.src || '')
        setEditImageAlt((attrs.alt as string) || '')
        setEditImageWidth(pxFromString(attrs.width))
        setEditImageHeight(pxFromString(attrs.height))
        setEditImageObjectFit((attrs.objectFit || 'contain') as ObjectFit)
        setEditImageObjectPosition((attrs.objectPosition || 'center') as ObjectPosition)
        setEditImageAspectRatio((attrs.aspectRatio || 'auto') as AspectRatio | 'auto')
        setEditImageDialogOpen(true)

        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      if (isSourceView) {
        setSourceCode(editor.getHTML())
      }
    },
  })
  const [selectedImageSettings, setSelectedImageSettings] = useState({
    width: '',
    height: '',
    objectFit: 'contain' as ObjectFit,
    objectPosition: 'center' as ObjectPosition,
    aspectRatio: 'auto' as AspectRatio | 'auto',
    alt: '',
    src: '',
  })

  const imagePositionOptions = useMemo(
    () =>
      [
        { value: 'center' as const, label: t('admin.richTextEditor.image.position.center') },
        { value: 'top' as const, label: t('admin.richTextEditor.image.position.top') },
        { value: 'bottom' as const, label: t('admin.richTextEditor.image.position.bottom') },
        { value: 'left' as const, label: t('admin.richTextEditor.image.position.left') },
        { value: 'right' as const, label: t('admin.richTextEditor.image.position.right') },
        { value: 'top left' as const, label: t('admin.richTextEditor.image.position.topLeft') },
        { value: 'top right' as const, label: t('admin.richTextEditor.image.position.topRight') },
        { value: 'bottom left' as const, label: t('admin.richTextEditor.image.position.bottomLeft') },
        { value: 'bottom right' as const, label: t('admin.richTextEditor.image.position.bottomRight') },
      ] satisfies { value: ObjectPosition; label: string }[],
    [i18n.language, t]
  )

  const imageFitOptions = useMemo(
    () =>
      [
        { value: 'contain' as const, label: t('admin.richTextEditor.image.fit.contain') },
        { value: 'cover' as const, label: t('admin.richTextEditor.image.fit.cover') },
        { value: 'fill' as const, label: t('admin.richTextEditor.image.fit.fill') },
        { value: 'none' as const, label: t('admin.richTextEditor.image.fit.none') },
        { value: 'scale-down' as const, label: t('admin.richTextEditor.image.fit.scaleDown') },
      ] satisfies { value: ObjectFit; label: string }[],
    [i18n.language, t]
  )

  const aspectRatioOptions = useMemo(
    () =>
      [
        { value: 'auto' as const, label: t('admin.richTextEditor.image.aspectRatio.auto') },
        { value: '1/1' as const, label: t('admin.richTextEditor.image.aspectRatio.square') },
        { value: '16/9' as const, label: t('admin.richTextEditor.image.aspectRatio.wide') },
        { value: '4/3' as const, label: t('admin.richTextEditor.image.aspectRatio.classic') },
        { value: '3/4' as const, label: t('admin.richTextEditor.image.aspectRatio.portrait') },
      ] satisfies { value: AspectRatio | 'auto'; label: string }[],
    [i18n.language, t]
  )

  // Update editor content if external value changes significantly
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Avoid circular updates when typing in source mode
      if (!isSourceView) {
        if (editor.getText() === '' && value === '') return
        // Ideally we would update content here if we trust 'value' more than editor state
      }
    }
  }, [value, editor, isSourceView])

  // Sync source code state when toggling view
  useEffect(() => {
    if (isSourceView && editor) {
      setSourceCode(editor.getHTML())
    }
  }, [isSourceView, editor])

  useEffect(() => {
    uiGuardsRef.current = { isSourceView, imageDialogOpen }
  }, [isSourceView, imageDialogOpen])

  // Track selected image attributes (used when saving the edit modal)
  useEffect(() => {
    if (!editor) return

    const sync = () => {
      if (!editor.isActive('image')) return

      const attrs = editor.getAttributes('image') as ImageAttributes
      setSelectedImageSettings({
        src: attrs.src || '',
        alt: attrs.alt || '',
        width: pxFromString(attrs.width),
        height: pxFromString(attrs.height),
        objectFit: (attrs.objectFit || 'contain') as ObjectFit,
        objectPosition: (attrs.objectPosition || 'center') as ObjectPosition,
        aspectRatio: (attrs.aspectRatio || 'auto') as AspectRatio | 'auto',
      })
    }

    sync()
    editor.on('selectionUpdate', sync)
    editor.on('transaction', sync)

    return () => {
      editor.off('selectionUpdate', sync)
      editor.off('transaction', sync)
    }
  }, [editor])

  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setSourceCode(newContent)
    onChange(newContent)
    if (editor) {
      editor.commands.setContent(newContent, false)
    }
  }

  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({ src: youtubeUrl })
      setYoutubeUrl('')
      setYoutubeDialogOpen(false)
    }
  }

  const resetImageDialog = () => {
    setImageUrl('')
    setImageAlt('')
    setImageWidth('')
    setImageHeight('')
    setImageObjectFit('contain')
    setImageObjectPosition('center')
    setImageAspectRatio('auto')
  }

  const resetEditImageDialog = () => {
    setEditImageUrl('')
    setEditImageAlt('')
    setEditImageWidth('')
    setEditImageHeight('')
    setEditImageObjectFit('contain')
    setEditImageObjectPosition('center')
    setEditImageAspectRatio('auto')
  }

  const insertImageByUrl = () => {
    if (!imageUrl.trim()) return

    const resolvedSrc = toDirectGoogleDriveImageUrl(imageUrl.trim()) || imageUrl.trim()

    editor
      .chain()
      .focus()
      .setImage({
        src: resolvedSrc,
        alt: imageAlt.trim() || null,
        width: toPx(imageWidth),
        height: toPx(imageHeight),
        objectFit: imageObjectFit,
        objectPosition: imageObjectPosition,
        aspectRatio: imageAspectRatio === 'auto' ? null : imageAspectRatio,
      })
      .run()

    setImageDialogOpen(false)
    resetImageDialog()
  }

  const updateSelectedImage = (partial: Partial<typeof selectedImageSettings>) => {
    if (!editor || !editor.isActive('image')) return

    const merged = { ...selectedImageSettings, ...partial }
    setSelectedImageSettings(merged)

    const attrs: Record<string, any> = {
      alt: merged.alt.trim() || null,
      width: toPx(merged.width),
      height: toPx(merged.height),
      objectFit: merged.objectFit,
      objectPosition: merged.objectPosition,
      aspectRatio: merged.aspectRatio === 'auto' ? null : merged.aspectRatio,
    }

    if ('src' in partial) {
      const nextSrc = merged.src.trim()
      if (nextSrc) attrs.src = nextSrc
    }

    editor.chain().focus().updateAttributes('image', attrs).run()
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  if (!editor) {
    return null
  }

  return (
    <div
      className={`forge-rte flex flex-col border rounded-md bg-white ${
        isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none h-screen w-screen' : 'w-full'
      }`}
      style={{
        ['--rte-image-edit-label' as any]: JSON.stringify(t('admin.richTextEditor.image.overlayEditHint')),
      }}
    >
      <style>{`
        .forge-rte .ProseMirror .forge-rte-image-wrapper {
          position: relative;
          display: inline-block;
        }

        .forge-rte .ProseMirror .forge-rte-image-wrapper > img {
          display: block;
        }

        .forge-rte .ProseMirror .forge-rte-image-wrapper:hover {
          cursor: pointer;
        }

        .forge-rte .ProseMirror .forge-rte-image-wrapper::after {
          content: var(--rte-image-edit-label);
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: rgba(0, 0, 0, 0.35);
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          opacity: 0;
          transition: opacity 120ms ease-in-out;
          pointer-events: none;
          user-select: none;
        }

        .forge-rte .ProseMirror .forge-rte-image-wrapper:hover::after,
        .forge-rte .ProseMirror .ProseMirror-selectednode.forge-rte-image-wrapper::after {
          opacity: 1;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.bold')}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.italic')}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.underline')}
          type="button"
        >
          <div className="underline font-bold text-xs">U</div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.strikethrough')}
          type="button"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.heading1')}
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.heading2')}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.heading3')}
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.alignLeft')}
          type="button"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.alignCenter')}
          type="button"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.alignRight')}
          type="button"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.bulletList')}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.orderedList')}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.quote')}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.codeBlock')}
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt(t('admin.richTextEditor.link.prompt'), previousUrl)
            if (url === null) return
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.link')}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setImageDialogOpen(true)}
          className={editor.isActive('image') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.image')}
          type="button"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setYoutubeDialogOpen(true)}
          className={editor.isActive('youtube') ? 'bg-gray-200' : ''}
          title={t('admin.richTextEditor.toolbar.youtube')}
          type="button"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title={t('admin.richTextEditor.toolbar.undo')}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title={t('admin.richTextEditor.toolbar.redo')}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>

        {!hideFullScreen && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onExpand || toggleFullScreen}
              title={
                isFullScreen
                  ? t('admin.richTextEditor.toolbar.exitFullScreen')
                  : t('admin.richTextEditor.toolbar.fullScreen')
              }
              type="button"
              className={isFullScreen ? 'bg-forge-orange/10 text-forge-orange' : ''}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSourceView(!isSourceView)}
          title={t('admin.richTextEditor.toolbar.viewHtml')}
          type="button"
          className={isSourceView ? 'bg-forge-orange/10 text-forge-orange' : ''}
        >
          <FileCode className="h-4 w-4" />
        </Button>
      </div>


      {/* Editor Content */}
      <div
        className={`flex-1 overflow-auto bg-white ${
          isFullScreen ? 'p-8 max-w-5xl mx-auto w-full shadow-lg my-4 rounded' : ''
        }`}
      >
        {isSourceView ? (
          <textarea
            value={sourceCode}
            onChange={handleSourceCodeChange}
            className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-gray-50 text-gray-800 resize-none focus:outline-none"
            spellCheck={false}
            placeholder={placeholder}
          />
        ) : (
          <EditorContent editor={editor} className="min-h-full" />
        )}
      </div>

      {isFullScreen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={toggleFullScreen} variant="secondary" className="shadow-lg">
            {t('admin.richTextEditor.toolbar.doneEditing')}
          </Button>
        </div>
      )}

      <Dialog open={youtubeDialogOpen} onOpenChange={setYoutubeDialogOpen}>
        <DialogContent className="z-[110]">
          <DialogHeader>
            <DialogTitle>{t('admin.richTextEditor.youtube.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">{t('admin.richTextEditor.youtube.urlLabel')}</Label>
              <Input
                id="youtube-url"
                placeholder={t('admin.richTextEditor.youtube.urlPlaceholder')}
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYoutubeDialogOpen(false)}>
              {t('common.buttons.cancel')}
            </Button>
            <Button onClick={addYoutubeVideo}>{t('admin.richTextEditor.youtube.addButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editImageDialogOpen}
        onOpenChange={(open) => {
          setEditImageDialogOpen(open)
          if (!open) resetEditImageDialog()
        }}
      >
        <DialogContent className="z-[110]">
          <DialogHeader>
            <DialogTitle>{t('admin.richTextEditor.image.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-image-url">{t('admin.richTextEditor.image.urlLabel')}</Label>
              <Input
                id="edit-image-url"
                placeholder={t('admin.richTextEditor.image.urlPlaceholder')}
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image-alt">{t('admin.richTextEditor.image.altLabel')}</Label>
              <Input
                id="edit-image-alt"
                placeholder={t('admin.richTextEditor.image.altPlaceholder')}
                value={editImageAlt}
                onChange={(e) => setEditImageAlt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-image-width">{t('admin.richTextEditor.image.widthLabel')}</Label>
                <Input
                  id="edit-image-width"
                  inputMode="numeric"
                  placeholder={t('admin.richTextEditor.image.widthPlaceholder')}
                  value={editImageWidth}
                  onChange={(e) => setEditImageWidth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image-height">{t('admin.richTextEditor.image.heightLabel')}</Label>
                <Input
                  id="edit-image-height"
                  inputMode="numeric"
                  placeholder={t('admin.richTextEditor.image.heightPlaceholder')}
                  value={editImageHeight}
                  onChange={(e) => setEditImageHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.fitLabel')}</Label>
                <Select value={editImageObjectFit} onValueChange={(value) => setEditImageObjectFit(value as ObjectFit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imageFitOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.positionLabel')}</Label>
                <Select
                  value={editImageObjectPosition}
                  onValueChange={(value) => setEditImageObjectPosition(value as ObjectPosition)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imagePositionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.aspectRatioLabel')}</Label>
                <Select
                  value={editImageAspectRatio}
                  onValueChange={(value) => setEditImageAspectRatio(value as AspectRatio | 'auto')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditImageDialogOpen(false)}>
              {t('common.buttons.cancel')}
            </Button>
            <Button
              onClick={() => {
                updateSelectedImage({
                  src: editImageUrl,
                  alt: editImageAlt,
                  width: editImageWidth,
                  height: editImageHeight,
                  objectFit: editImageObjectFit,
                  objectPosition: editImageObjectPosition,
                  aspectRatio: editImageAspectRatio,
                })
                setEditImageDialogOpen(false)
                resetEditImageDialog()
              }}
              disabled={!editImageUrl.trim()}
            >
              {t('admin.richTextEditor.image.saveButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          setImageDialogOpen(open)
          if (!open) resetImageDialog()
        }}
      >
        <DialogContent className="z-[110]">
          <DialogHeader>
            <DialogTitle>{t('admin.richTextEditor.image.insertTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">{t('admin.richTextEditor.image.urlLabel')}</Label>
              <Input
                id="image-url"
                placeholder={t('admin.richTextEditor.image.urlPlaceholder')}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-alt">{t('admin.richTextEditor.image.altLabel')}</Label>
              <Input
                id="image-alt"
                placeholder={t('admin.richTextEditor.image.altPlaceholder')}
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="image-width">{t('admin.richTextEditor.image.widthLabel')}</Label>
                <Input
                  id="image-width"
                  inputMode="numeric"
                  placeholder={t('admin.richTextEditor.image.widthPlaceholder')}
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-height">{t('admin.richTextEditor.image.heightLabel')}</Label>
                <Input
                  id="image-height"
                  inputMode="numeric"
                  placeholder={t('admin.richTextEditor.image.heightPlaceholder')}
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.fitLabel')}</Label>
                <Select value={imageObjectFit} onValueChange={(value) => setImageObjectFit(value as ObjectFit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imageFitOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.positionLabel')}</Label>
                <Select
                  value={imageObjectPosition}
                  onValueChange={(value) => setImageObjectPosition(value as ObjectPosition)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imagePositionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.richTextEditor.image.aspectRatioLabel')}</Label>
                <Select
                  value={imageAspectRatio}
                  onValueChange={(value) => setImageAspectRatio(value as AspectRatio | 'auto')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              {t('common.buttons.cancel')}
            </Button>
            <Button onClick={insertImageByUrl} disabled={!imageUrl.trim()}>
              {t('admin.richTextEditor.image.insertButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
