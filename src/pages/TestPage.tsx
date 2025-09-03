import React from 'react';

const TestPage: React.FC = () => {
  const serverTimestamp = new Date().toISOString();
  
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
        <p>✅ SSR funcionando (timestamp: {serverTimestamp})</p>
      </div>

      <div style={{ 
        backgroundColor: '#f0fff0', 
        padding: '1rem', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        <h3>Informações do Ambiente (SSR)</h3>
        <p><strong>Timestamp do Servidor:</strong> {serverTimestamp}</p>
        <p><strong>Se você vê este texto sem JS, o SSR está OK</strong></p>
      </div>

      <div style={{ 
        backgroundColor: '#fff8f0', 
        padding: '1rem', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        <h3>Teste de JavaScript (Client-side)</h3>
        <p>Se o JavaScript estiver funcionando, você verá informações adicionais abaixo:</p>
        <div id="js-test" style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '0.5rem', 
          borderRadius: '4px',
          margin: '0.5rem 0'
        }}>
          <p>Carregando informações do cliente...</p>
        </div>
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

      {/* Script inline para testar JS sem dependências externas */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const jsTest = document.getElementById('js-test');
            if (jsTest) {
              jsTest.innerHTML = \`
                <p><strong>✅ JavaScript funcionando!</strong></p>
                <p><strong>User Agent:</strong> \${navigator.userAgent}</p>
                <p><strong>URL:</strong> \${window.location.href}</p>
                <p><strong>Timestamp do Cliente:</strong> \${new Date().toISOString()}</p>
              \`;
            }
          });
        `
      }} />
    </div>
  );
};

export default TestPage;
