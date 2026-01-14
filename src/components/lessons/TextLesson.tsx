import ReactMarkdown from 'react-markdown';
import { looksLikeHtml, sanitizeHtml } from '@/lib/sanitizeHtml';

interface Props {
  content: string;
}

export function TextLesson({ content }: Props) {
  const isHtml = looksLikeHtml(content);
  const contentClasses =
    "prose prose-slate max-w-none break-words overflow-x-hidden [overflow-wrap:anywhere] " +
    "prose-img:max-w-full prose-img:h-auto prose-pre:overflow-x-auto " +
    "prose-pre:max-w-full prose-pre:whitespace-pre-wrap sm:prose-pre:whitespace-pre " +
    "prose-pre:break-words prose-code:break-words prose-table:block prose-table:max-w-full " +
    "prose-table:overflow-x-auto";

  if (isHtml) {
    return (
      <div
        className={contentClasses}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  return (
    <div className={contentClasses}>
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
