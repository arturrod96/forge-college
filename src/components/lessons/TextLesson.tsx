import ReactMarkdown from 'react-markdown';
import { looksLikeHtml, sanitizeHtml } from '@/lib/sanitizeHtml';

interface Props {
  content: string;
}

export function TextLesson({ content }: Props) {
  const isHtml = looksLikeHtml(content);

  if (isHtml) {
    return (
      <div
        className="prose prose-slate max-w-none overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
