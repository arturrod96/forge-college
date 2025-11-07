import { useTranslation } from 'react-i18next';
import { PublishedLessons } from '@/components/dashboard/PublishedLessons';

export default function LessonsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Lessons</h1>
        <p className="text-muted-foreground">Access all available lessons and learning materials</p>
      </div>

      <PublishedLessons />
    </div>
  );
}
