import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'

// Versão de debug para testar renderização básica
const DebugApp = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1>Debug App Test</h1>
      <p>Se você vê isto, o React básico está funcionando.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Esta é uma versão simplificada para debug.</p>
    </div>
  );
};

// Renderização com tratamento de erro
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<DebugApp />);
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Error rendering debug app:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
        <h1>Debug Render Error</h1>
        <p>Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px;">
          ${error instanceof Error ? error.stack : String(error)}
        </pre>
      </div>
    `;
  }
}
