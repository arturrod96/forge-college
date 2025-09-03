import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export async function render(url: string): Promise<string> {
  try {
    const html = renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );
    return html;
  } catch (error) {
    console.error('SSR render error:', error);
    return `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>SSR Error</h1>
        <p>Erro ao renderizar: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
