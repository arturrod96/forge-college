import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

export default function AmbassadorsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">{t('ambassadors.title')}</h1>
        <p className="text-muted-foreground">{t('ambassadors.subtitle')}</p>
      </div>

      <div className="rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-8 text-center">
        <Users className="h-12 w-12 text-forge-orange/40 mx-auto mb-4" />
        <p className="text-muted-foreground">{t('ambassadors.comingSoon')}</p>
      </div>
    </div>
  );
}
