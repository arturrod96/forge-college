import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const TestPage: React.FC = () => {
  const serverTimestamp = new Date().toISOString();
  const { t } = useTranslation();

  const clientScript = useMemo(() => {
    return `
      document.addEventListener('DOMContentLoaded', function() {
        const jsTest = document.getElementById('js-test');
        if (jsTest) {
          jsTest.innerHTML = \`
            <p><strong>${t('diagnostics.testPage.js.clientReady')}</strong></p>
            <p><strong>${t('diagnostics.testPage.js.userAgent')}</strong> \${navigator.userAgent}</p>
            <p><strong>${t('diagnostics.testPage.js.url')}</strong> \${window.location.href}</p>
            <p><strong>${t('diagnostics.testPage.js.clientTimestamp')}</strong> \${new Date().toISOString()}</p>
          \`;
        }
      });
    `;
  }, [t]);

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <h1>{t('diagnostics.testPage.title')}</h1>
      <p>{t('diagnostics.testPage.description')}</p>

      <div
        style={{
          backgroundColor: '#f0f8ff',
          padding: '1rem',
          borderRadius: '8px',
          margin: '1rem 0'
        }}
      >
        <h2>{t('diagnostics.testPage.systemStatus.title')}</h2>
        <p>{t('diagnostics.testPage.systemStatus.react')}</p>
        <p>{t('diagnostics.testPage.systemStatus.typescript')}</p>
        <p>{t('diagnostics.testPage.systemStatus.build')}</p>
        <p>{t('diagnostics.testPage.systemStatus.deploy')}</p>
        <p>{t('diagnostics.testPage.systemStatus.ssr', { timestamp: serverTimestamp })}</p>
      </div>

      <div
        style={{
          backgroundColor: '#f0fff0',
          padding: '1rem',
          borderRadius: '8px',
          margin: '1rem 0'
        }}
      >
        <h3>{t('diagnostics.testPage.environment.title')}</h3>
        <p>
          <strong>{t('diagnostics.testPage.environment.serverTimestamp')}</strong>{' '}
          {serverTimestamp}
        </p>
        <p>{t('diagnostics.testPage.environment.noJsMessage')}</p>
      </div>

      <div
        style={{
          backgroundColor: '#fff8f0',
          padding: '1rem',
          borderRadius: '8px',
          margin: '1rem 0'
        }}
      >
        <h3>{t('diagnostics.testPage.clientTest.title')}</h3>
        <p>{t('diagnostics.testPage.clientTest.instructions')}</p>
        <div
          id="js-test"
          style={{
            backgroundColor: '#e8f5e8',
            padding: '0.5rem',
            borderRadius: '4px',
            margin: '0.5rem 0'
          }}
        >
          <p>{t('diagnostics.testPage.clientTest.loading')}</p>
        </div>
        <button
          onClick={() => alert(t('diagnostics.testPage.alerts.jsWorking'))}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {t('diagnostics.testPage.clientTest.button')}
        </button>
      </div>

      <p style={{ marginTop: '2rem', color: '#666' }}>{t('diagnostics.testPage.footer')}</p>

      <script dangerouslySetInnerHTML={{ __html: clientScript }} />
    </div>
  );
};

export default TestPage;
