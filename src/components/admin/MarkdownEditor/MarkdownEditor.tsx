import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { cn } from '@/lib/utils';

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
};

export function MarkdownEditor({
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
  onBlur,
}: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={cn('rounded-md border p-4 text-sm text-muted-foreground', className)}>
        Carregando editor…
      </div>
    );
  }

  return (
    <div className={cn('w-full rounded-md border bg-white', className)} data-color-mode="light">
      <MDEditor
        value={value}
        preview="edit"
        height={300}
        onChange={(val) => onChange(val ?? '')}
        textareaProps={{
          placeholder,
          disabled,
          onBlur,
        }}
        aria-label="Markdown editor"
      />
    </div>
  );
}
