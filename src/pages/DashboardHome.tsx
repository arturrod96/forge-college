import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard';
import { UserStats } from '@/components/dashboard/UserStats';
import { AvailablePaths } from '@/components/dashboard/AvailablePaths';
import { ComingSoonPaths } from '@/components/dashboard/ComingSoonPaths';
import { FormationsList } from '@/components/dashboard/FormationsList';
import { LearningHabits } from '@/components/dashboard/LearningHabits';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import * as R from '@/routes/paths';
import { useTranslation } from 'react-i18next';

export default function DashboardHome() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const getUserDisplayName = () => {
    // Debug: log user data
    console.log('User data:', user);
    console.log('User metadata:', user?.user_metadata);
    
    // Prioridade: full_name > name > email > User
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Primeira parte do email
    }
    return t('common.labels.user');
  };

  return (
    <div className="space-y-8">
      {/* Welcome message with user name */}
      <div className="space-y-2">
        <div className="inline-flex items-center text-sm rounded-full bg-forge-cream text-forge-dark px-2 py-0.5">
          <span>{t('dashboard.home.badge')}&nbsp;</span>
          <span className="font-medium">{getUserDisplayName()}</span>
          <span>{t('dashboard.home.headlineSuffix')}</span>
        </div>
      </div>

      {/* 12-col grid layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main column - full width */}
        <div className="col-span-12 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8">
              <ContinueLearningCard className="mb-0" />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <LearningHabits className="mb-0" />
            </div>
          </div>
          <UserStats />
        </div>
      </div>

      {/* Paths section below */}
      <div className="space-y-6">
        {/* Formations Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Formations</h2>
            <Link to={R.DASHBOARD_FORMATIONS} className="text-forge-orange hover:underline">
              View all formations
            </Link>
          </div>
          <FormationsList limit={3} className="mt-2" />
        </div>

        {/* Available Paths Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{t(R.ROUTE_LABELS[R.DASHBOARD_EXPLORE])}</h2>
            <Link to={R.DASHBOARD_EXPLORE} className="text-forge-orange hover:underline">
              {t('dashboard.home.exploreCta')}
            </Link>
          </div>
          <AvailablePaths limit={6} className="mt-2" />
        </div>

        {/* Coming Soon Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Coming Soon</h2>
            <Link to={R.DASHBOARD_COMING_SOON} className="text-forge-orange hover:underline">
              View all upcoming paths
            </Link>
          </div>
          <ComingSoonPaths limit={3} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
