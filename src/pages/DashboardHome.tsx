import { UserStats } from '@/components/dashboard/UserStats';
import { MyLearningPaths } from '@/components/dashboard/MyLearningPaths';
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard';

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <UserStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MyLearningPaths />
        </div>
        <div>
          <ContinueLearningCard />
        </div>
      </div>
    </div>
  );
}
