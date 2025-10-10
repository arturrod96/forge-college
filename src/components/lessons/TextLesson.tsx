import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export function TextLesson({ content }: Props) {
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
