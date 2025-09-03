import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'

// Versão SSR para testar renderização no servidor
const SSRApp = () => {
  const timestamp = new Date().toISOString();
  
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1>SSR App Test</h1>
      <p>Se você vê isto, o React SSR está funcionando.</p>
      <p>Timestamp: {timestamp}</p>
      <p>Esta é uma versão SSR para debug.</p>
      <p>Runtime: Node.js</p>
      <p>Dynamic: force-dynamic</p>
    </div>
  );
};

// Renderização com tratamento de erro
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<SSRApp />);
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Error rendering SSR app:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>SSR Render Error</h1>
        <p>Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
