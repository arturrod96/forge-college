import { useTranslation } from 'react-i18next';

export default function ModulesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Modules</h1>
        <p className="text-muted-foreground">View and manage all course modules</p>
      </div>

      <div className="rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-8 text-center">
        <p className="text-muted-foreground">Modules content coming soon</p>
      </div>
    </div>
  );
}
