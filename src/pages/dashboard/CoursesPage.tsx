import { useTranslation } from 'react-i18next';
import { PublishedCourses } from '@/components/dashboard/PublishedCourses';

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Courses</h1>
        <p className="text-muted-foreground">Browse and explore all available courses</p>
      </div>

      <PublishedCourses />
    </div>
  );
}
