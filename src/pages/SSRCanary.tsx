import { useTranslation } from 'react-i18next';

const SSRCanary: React.FC = () => {
  const timestamp = new Date().toISOString();
  const { t, i18n } = useTranslation();

  return (
    <html lang={i18n.language}>
      <head>
        <title>{t('diagnostics.ssrCanary.title')}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <pre>{t('diagnostics.ssrCanary.status', { timestamp })}</pre>
        <p>{t('diagnostics.ssrCanary.instructions')}</p>
        <p>{t('diagnostics.ssrCanary.timestamp', { timestamp: new Date().toLocaleString() })}</p>
        <p>{t('diagnostics.ssrCanary.renderMode')}</p>
        <p>{t('diagnostics.ssrCanary.runtime')}</p>
        <p>{t('diagnostics.ssrCanary.dynamicMode')}</p>
      </body>
    </html>
  );
};

export default SSRCanary;
