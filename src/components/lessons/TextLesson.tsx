import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export function TextLesson({ content }: Props) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
