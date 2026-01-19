import { FormationsList } from '@/components/dashboard/FormationsList';
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FormationsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Formations</h1>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('dashboard.home.formationsTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-gray-600">Comprehensive learning programs designed to advance your career</p>
        </div>
      </div>

      {/* Formations Grid */}
      <FormationsList />
      
      {/* Admin Link */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-gray-500 mb-3">
          Are you an instructor? Create and manage formations.
        </p>
        <Link to="/dashboard/admin/formations">
          <EnhancedButton variant="primary" size="md">
            Admin Panel
          </EnhancedButton>
        </Link>
      </div>
    </div>
  );
}
