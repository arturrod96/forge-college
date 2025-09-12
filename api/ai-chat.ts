export const config = { runtime: 'edge' };

async function openAiChat(payload: any, apiKey: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  return res.json();
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json' },
      });
    }

    const apiKey = (process.env as any)?.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({} as any));
    const { mode, messages, lessonContext, model, max_tokens, temperature } = body as {
      mode: 'chat' | 'suggest';
      messages?: { role: 'user' | 'assistant' | 'system'; content: string }[];
      lessonContext?: string;
      model?: string;
      max_tokens?: number;
      temperature?: number;
    };

    const selectedModel = model || (process.env as any)?.OPENAI_MODEL || 'gpt-4o-mini';

    if (mode === 'suggest') {
      const system = {
        role: 'system' as const,
        content:
          'You are an expert course assistant. Read the provided lesson context and generate three concise, distinct, helpful questions a student might ask. Return ONLY a JSON array of three strings with no additional text.',
      };
      const user = {
        role: 'user' as const,
        content: `Lesson context (may be truncated):\n\n${(lessonContext || '').slice(0, 6000)}`,
      };
      const data = await openAiChat(
        {
          model: selectedModel,
          messages: [system, user],
          temperature: temperature ?? 0.7,
          max_tokens: max_tokens ?? 256,
        },
        apiKey
      );

      const text: string = data.choices?.[0]?.message?.content ?? '[]';
      let suggestions: string[] = [];
      try {
        suggestions = JSON.parse(text);
        if (!Array.isArray(suggestions)) suggestions = [];
      } catch {
        suggestions = text
          .split('\n')
          .map((s: string) => s.replace(/^[-*\d.\s]+/, '').trim())
          .filter(Boolean)
          .slice(0, 3);
      }
      suggestions = suggestions.slice(0, 3);
      return new Response(JSON.stringify({ suggestions }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (mode === 'chat') {
      const sys: { role: 'system'; content: string } = {
        role: 'system',
        content:
          'You are "AI Instructor", a concise, friendly tutor for software and blockchain courses. Use the provided lesson context when answering. If context is missing for a question, answer from general knowledge but keep it short and practical. Prefer step-by-step explanations and simple examples. Keep responses under 200 words unless code is needed.',
      };
      const ctxMsg = lessonContext
        ? ({ role: 'system', content: `Lesson context: ${String(lessonContext).slice(0, 6000)}` } as const)
        : undefined;
      const chain = [sys, ...(ctxMsg ? [ctxMsg] : []), ...(messages || [])];

      const data = await openAiChat(
        {
          model: selectedModel,
          messages: chain,
          temperature: temperature ?? 0.5,
          max_tokens: max_tokens ?? 700,
        },
        apiKey
      );

      const reply: string = data.choices?.[0]?.message?.content ?? '';
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid mode' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    const message = err?.message || 'Unexpected server error';
    console.error('AI API error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
