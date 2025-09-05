import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

// Função para renderizar com tratamento de erro
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    createRoot(rootElement).render(
      <ErrorBoundary>
        <BrowserRouter>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </WagmiProvider>
        </BrowserRouter>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
          <h1>Render Error</h1>
          <p>Erro ao renderizar a aplica��ão: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; text-align: left;">
            ${error instanceof Error ? error.stack : String(error)}
          </pre>
        </div>
      `;
    }
  }
};

// Só renderiza no cliente
if (typeof window !== 'undefined') {
  renderApp();
}
