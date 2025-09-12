// Minimal REST call to OpenAI without SDK to avoid extra deps
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

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
      return;
    }

    const {
      mode,
      messages,
      lessonContext,
      model,
      max_tokens,
      temperature,
    }: {
      mode: 'chat' | 'suggest';
      messages?: { role: 'user' | 'assistant' | 'system'; content: string }[];
      lessonContext?: string;
      model?: string;
      max_tokens?: number;
      temperature?: number;
    } = req.body || {};

    const selectedModel = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

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

      // Try to parse JSON array from the response
      const text: string = data.choices?.[0]?.message?.content ?? '[]';
      let suggestions: string[] = [];
      try {
        suggestions = JSON.parse(text);
        if (!Array.isArray(suggestions)) suggestions = [];
      } catch {
        // Fallback: attempt to split lines
        suggestions = text
          .split('\n')
          .map((s) => s.replace(/^[-*\d.\s]+/, '').trim())
          .filter(Boolean)
          .slice(0, 4);
      }

      // Ensure exactly up to 4 items
      suggestions = suggestions.slice(0, 3);
      res.status(200).json({ suggestions });
      return;
    }

    if (mode === 'chat') {
      const sys: { role: 'system'; content: string } = {
        role: 'system',
        content:
          'You are "AI Instructor", a concise, friendly tutor for software and blockchain courses. Use the provided lesson context when answering. If context is missing for a question, answer from general knowledge but keep it short and practical. Prefer step-by-step explanations and simple examples. Keep responses under 200 words unless code is needed.',
      };

      const ctxMsg = lessonContext
        ? ({ role: 'system', content: `Lesson context: ${lessonContext.slice(0, 6000)}` } as const)
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
      res.status(200).json({ reply });
      return;
    }

    res.status(400).json({ error: 'Invalid mode' });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unexpected server error' });
  }
}
