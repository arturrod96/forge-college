import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard';
import { UserStats } from '@/components/dashboard/UserStats';
import { MyLearningPaths } from '@/components/dashboard/MyLearningPaths';
import { AvailablePaths } from '@/components/dashboard/AvailablePaths';
import { LearningHabits } from '@/components/dashboard/LearningHabits';
import { Link } from 'react-router-dom';
import * as R from '@/routes/paths';
import { DASHBOARD_STRINGS } from '@/strings/dashboard';

export function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{R.ROUTE_LABELS[R.DASHBOARD]}</h1>
        <div className="text-gray-500">
          <span className="inline-flex items-center gap-2 text-sm rounded-full bg-forge-cream text-forge-dark px-2 py-0.5 mr-2">
            {DASHBOARD_STRINGS.dashboardHome.badge}
          </span>
          {DASHBOARD_STRINGS.dashboardHome.headlineSuffix}
        </div>
      </div>

      {/* 12-col grid layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8">
              <ContinueLearningCard className="mb-0" />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <LearningHabits className="mb-0" />
            </div>
          </div>
          <UserStats />
          <MyLearningPaths />
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="space-y-3 sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">{R.ROUTE_LABELS[R.DASHBOARD_EXPLORE]}</h2>
              <Link to={R.DASHBOARD_EXPLORE} className="text-forge-orange hover:underline">
                {DASHBOARD_STRINGS.dashboardHome.exploreCta}
              </Link>
            </div>
            <AvailablePaths limit={3} className="mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;


