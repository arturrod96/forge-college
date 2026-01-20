import { useTranslation } from 'react-i18next';
import { AvailablePaths } from '@/components/dashboard/AvailablePaths';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export default function LearningPathsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-forge-dark">{t('learningPaths.title')}</h1>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('dashboard.home.learningPathTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground">{t('learningPaths.subtitle')}</p>
      </div>

      <AvailablePaths />
    </div>
  );
}
