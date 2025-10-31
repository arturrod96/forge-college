import { useTranslation } from 'react-i18next';

const StaticBare: React.FC = () => {
  const timestamp = new Date().toISOString();
  const { t, i18n } = useTranslation();

  return (
    <html lang={i18n.language}>
      <head>
        <title>{t('diagnostics.staticBare.title')}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <pre>{t('diagnostics.staticBare.status', { timestamp })}</pre>
        <p>{t('diagnostics.staticBare.instructions')}</p>
        <p>{t('diagnostics.staticBare.timestamp', { timestamp: new Date().toLocaleString() })}</p>
        <p>{t('diagnostics.staticBare.renderMode')}</p>
      </body>
    </html>
  );
};

export default StaticBare;
