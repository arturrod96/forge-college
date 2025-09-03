import { readFileSync } from 'fs';
import { join } from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';

let template: string | null = null;
let render: ((url: string) => Promise<string>) | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Carrega o template HTML
    if (!template) {
      template = readFileSync(join(process.cwd(), 'public/index.html'), 'utf-8');
    }
    
    // Carrega a função de renderização SSR
    if (!render) {
      const serverModule = await import('../dist/server/entry-server.js');
      render = serverModule.render;
    }
    
    const url = req.url || '/';
    const appHtml = await render!(url);
    
    // Substitui o placeholder pelo HTML renderizado
    const html = template!.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (e: any) {
    console.error('SSR handler error:', e);
    res.status(500).send(`
      <html>
        <body>
          <h1>SSR ERROR</h1>
          <p>${e?.message ?? String(e)}</p>
          <pre>${e?.stack ?? ''}</pre>
        </body>
      </html>
    `);
  }
}
