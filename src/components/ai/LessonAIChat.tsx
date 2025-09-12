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

  // Optional client-side fallback when backend route is unavailable in dev
  const clientKey = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined;
  const clientModel = ((import.meta as any).env?.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini';

  const fetchSuggestionsClient = async () => {
    if (!clientKey) return null;
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientKey}` },
        body: JSON.stringify({
          model: clientModel,
          messages: [
            { role: 'system', content: 'You are an expert course assistant. Generate three concise, distinct, helpful questions based on the provided lesson context. Return ONLY a JSON array of three strings.' },
            { role: 'user', content: `Lesson context (may be truncated):\n\n${contextText}` },
          ],
          temperature: 0.7,
          max_tokens: 256,
        }),
      });
      const raw = await res.text();
      if (!res.ok) {
        console.error('AI suggest client error:', raw);
        return null;
      }
      let text = '';
      try { text = (JSON.parse(raw)?.choices?.[0]?.message?.content as string) || ''; } catch { text = ''; }
      const cleaned = text.replace(/```[a-z]*\n?/gi,'').replace(/```/g,'').trim();
      let list: string[] = [];
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        try { const arr = JSON.parse(match[0]); if (Array.isArray(arr)) list = arr; } catch {}
      }
      if (!list.length) {
        list = cleaned.split('\n').map(s=>s.replace(/^[-*\d.\s]+/, '').replace(/^\"|\",?$/g,'').replace(/,$/,'').trim()).filter(Boolean);
      }
      return list.map(s=>s.replace(/^\"|\"$/g,'').trim()).slice(0, 3);
    } catch (e) {
      console.error('AI suggest client exception:', e);
      return null;
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'suggest', lessonContext: contextText }),
        });
        if (!res.ok) {
          console.error('AI suggest error status:', res.status, res.statusText);
          const fallback = await fetchSuggestionsClient();
          if (fallback) setSuggestions(fallback);
          return;
        }
        let data: any = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error('AI suggest parse error (json)');
          return;
        }
        if (Array.isArray(data?.suggestions)) setSuggestions(data.suggestions);
      } catch (e) {
        console.error('AI suggest exception:', e);
        const fallback = await fetchSuggestionsClient();
        if (fallback) setSuggestions(fallback);
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
        // Client-side fallback to OpenAI if backend route is missing in dev
        if (clientKey) {
          try {
            const cres = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientKey}` },
              body: JSON.stringify({
                model: clientModel,
                messages: [
                  { role: 'system', content: 'You are "AI Instructor", a concise, friendly tutor for software and blockchain courses.' },
                  { role: 'system', content: `Lesson context: ${contextText}` },
                  { role: 'user', content: text.trim() },
                ],
                temperature: 0.5,
                max_tokens: 700,
              }),
            });
            if (cres.ok) {
              const cjson = await cres.json().catch(() => null);
              const reply = cjson?.choices?.[0]?.message?.content || '';
              setMessages((m) => [...m, { role: 'assistant', content: reply || 'No reply' }]);
              return;
            }
          } catch (fe) {
            console.error('AI chat client exception:', fe);
          }
        }
        const msg = `Error: ${res.status} ${res.statusText}`;
        setMessages((m) => [...m, { role: 'assistant', content: msg }]);
        return;
      }
      let data: any = null;
      try { data = await res.json(); } catch { data = null; }
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
        <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto rounded-md border p-3 bg-white flex flex-col gap-3">
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

          <div className="flex-1" />

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
