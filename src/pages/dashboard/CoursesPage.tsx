import { useTranslation } from 'react-i18next';
import { PublishedCourses } from '@/components/dashboard/PublishedCourses';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-forge-dark">Courses</h1>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('dashboard.home.coursesTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground">Browse and explore all available courses</p>
      </div>

      <PublishedCourses />
    </div>
  );
}
