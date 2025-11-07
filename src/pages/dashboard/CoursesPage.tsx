import { useTranslation } from 'react-i18next';

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Courses</h1>
        <p className="text-muted-foreground">Browse and explore all available courses</p>
      </div>

      <div className="rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-8 text-center">
        <p className="text-muted-foreground">Courses content coming soon</p>
      </div>
    </div>
  );
}
