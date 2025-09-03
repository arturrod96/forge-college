import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>🧪 Página de Teste - Forge College</h1>
      <p>Esta é uma página de teste estática sem dependências externas.</p>
      
      <div style={{ 
        backgroundColor: '#f0f8ff', 
        padding: '1rem', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        <h2>Status do Sistema</h2>
        <p>✅ React funcionando</p>
        <p>✅ TypeScript funcionando</p>
        <p>✅ Build funcionando</p>
        <p>✅ Deploy funcionando</p>
      </div>

      <div style={{ 
        backgroundColor: '#f0fff0', 
        padding: '1rem', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        <h3>Informações do Ambiente</h3>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
      </div>

      <div style={{ 
        backgroundColor: '#fff8f0', 
        padding: '1rem', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        <h3>Teste de JavaScript</h3>
        <button 
          onClick={() => alert('JavaScript está funcionando!')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Testar JavaScript
        </button>
      </div>

      <p style={{ marginTop: '2rem', color: '#666' }}>
        Se você está vendo esta página, o problema não é de infraestrutura básica.
      </p>
    </div>
  );
};

export default TestPage;
