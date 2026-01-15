import { useTranslation } from 'react-i18next';
import { AvailablePaths } from '@/components/dashboard/AvailablePaths';

export default function LearningPathsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Learning Paths</h1>
        <p className="text-muted-foreground">Browse and explore all available learning paths</p>
      </div>

      <AvailablePaths />
    </div>
  );
}
