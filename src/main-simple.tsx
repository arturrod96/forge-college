import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'

// Versão simplificada para testar SSR
const SimpleApp = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1>Simple App Test</h1>
      <p>Se você vê isto, o React básico está funcionando.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
};

// Só renderiza se estivermos no cliente
if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<SimpleApp />);
  }
}
