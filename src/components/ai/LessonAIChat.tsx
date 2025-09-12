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
        const raw = await res.text();
        if (!res.ok) {
          console.error('AI suggest error:', raw);
          return;
        }
        let data: any = null;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error('AI suggest parse error:', raw);
          return;
        }
        if (Array.isArray(data?.suggestions)) setSuggestions(data.suggestions);
      } catch (e) {
        console.error('AI suggest exception:', e);
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
      if (!res.ok) {
        let details = '';
        try { details = (await res.json())?.error || ''; } catch { details = await res.text(); }
        const msg = details ? `Error: ${details}` : 'There was an error contacting the AI service.';
        setMessages((m) => [...m, { role: 'assistant', content: msg }]);
        return;
      }
      const data = await res.json();
      const reply = (data?.reply as string) || 'Sorry, I could not generate an answer.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      console.error('AI chat exception:', e);
      setMessages((m) => [...m, { role: 'assistant', content: 'There was an error contacting the AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full max-h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">AI Instructor</CardTitle>
        <p className="text-xs text-muted-foreground">Faça perguntas sobre esta lição</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col gap-3">
        <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto rounded-md border p-3 space-y-3 bg-white">
          {messages.length === 0 && (
            <div className="text-xs text-muted-foreground">Dica: clique em uma pergunta sugerida ou digite a sua abaixo.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className="text-[10px] uppercase tracking-wide mb-1 text-muted-foreground">
                {m.role === 'user' ? 'Me:' : 'Instructor:'}
              </div>
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

        {!!suggestions.length && (
          <div className="grid gap-2">
            {suggestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => send(q)}
                className="w-full text-left border rounded-lg p-3 bg-white hover:bg-forge-cream transition-colors shadow-sm"
              >
                <div className="text-xs text-muted-foreground mb-1">Sugestão</div>
                <div className="text-sm">{q}</div>
              </button>
            ))}
          </div>
        )}

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
