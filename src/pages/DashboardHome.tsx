import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard';
import { UserStats } from '@/components/dashboard/UserStats';
import { AvailablePaths } from '@/components/dashboard/AvailablePaths';
import { LearningHabits } from '@/components/dashboard/LearningHabits';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useOAuth';
import * as R from '@/routes/paths';
import { DASHBOARD_STRINGS } from '@/strings/dashboard';
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
    return 'User';
  };

  return (
    <div className="space-y-8">
      {/* Welcome message with user name */}
      <div className="space-y-2">
        <div className="text-gray-500">
          <span className="inline-flex items-center gap-2 text-sm rounded-full bg-forge-cream text-forge-dark px-2 py-0.5 mr-2">
            {DASHBOARD_STRINGS.dashboardHome.badge}
          </span>
          <span className="font-medium text-forge-dark">{getUserDisplayName()}</span>
          {DASHBOARD_STRINGS.dashboardHome.headlineSuffix}
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">{t(R.ROUTE_LABELS[R.DASHBOARD_EXPLORE])}</h2>
          <Link to={R.DASHBOARD_EXPLORE} className="text-forge-orange hover:underline">
            {DASHBOARD_STRINGS.dashboardHome.exploreCta}
          </Link>
        </div>
        <AvailablePaths className="mt-2" />
      </div>
    </div>
  );
}
