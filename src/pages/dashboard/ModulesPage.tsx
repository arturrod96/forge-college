import { useTranslation } from 'react-i18next';
import { PublishedModules } from '@/components/dashboard/PublishedModules';

export default function ModulesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Modules</h1>
        <p className="text-muted-foreground">View and manage all course modules</p>
      </div>

      <PublishedModules />
    </div>
  );
}
