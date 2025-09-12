import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Role = 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

interface Props {
  courseTitle?: string;
  lessonTitle?: string;
  lessonType?: string;
  lessonContent?: unknown;
}

function normalizeContext({ courseTitle, lessonTitle, lessonType, lessonContent }: Props) {
  let body = '';
  if (typeof lessonContent === 'string') body = lessonContent;
  else if (lessonContent) body = JSON.stringify(lessonContent);
  const header = `Course: ${courseTitle || ''}\nLesson: ${lessonTitle || ''}\nType: ${lessonType || ''}`.trim();
  return `${header}\n\n${body}`.slice(0, 8000);
}

export default function LessonAIChat(props: Props) {
  const contextText = useMemo(() => normalizeContext(props), [props.courseTitle, props.lessonTitle, props.lessonType, props.lessonContent]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'suggest', lessonContext: contextText }),
        });
        const data = await res.json();
        if (Array.isArray(data?.suggestions)) setSuggestions(data.suggestions);
      } catch (e) {
        // noop
      }
    };
    fetchSuggestions();
  }, [contextText]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          lessonContext: contextText,
          messages: [{ role: 'user', content: text.trim() }],
        }),
      });
      const data = await res.json();
      const reply = (data?.reply as string) || 'Sorry, I could not generate an answer.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: 'There was an error contacting the AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">AI Instructor</CardTitle>
        <p className="text-xs text-muted-foreground">Faça perguntas sobre esta lição</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {!!suggestions.length && (
          <div className="grid gap-2">
            {suggestions.map((q, i) => (
              <Button key={i} variant="outline" className="justify-start text-left" onClick={() => send(q)}>
                {q}
              </Button>
            ))}
          </div>
        )}

        <div ref={listRef} className="flex-1 overflow-y-auto rounded-md border p-3 space-y-3 bg-white">
          {messages.length === 0 && (
            <div className="text-xs text-muted-foreground">Dica: clique em uma pergunta sugerida ou digite a sua abaixo.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={
                'inline-block rounded-lg px-3 py-2 text-sm ' +
                (m.role === 'user' ? 'bg-forge-orange text-white' : 'bg-forge-cream text-forge-dark')
              }>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-muted-foreground">Gerando resposta…</div>}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Pergunte algo sobre a lição…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={loading}>Enviar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
