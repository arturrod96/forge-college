import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, Award, Sparkles } from 'lucide-react';
import { AchievementStats as StatsType } from '../types/achievement.types';

interface AchievementStatsProps {
  stats: StatsType;
}

export function AchievementStats({ stats }: AchievementStatsProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      label: t('achievements.completed'),
      value: `${stats.completed}/${stats.total}`,
    },
    {
      icon: Clock,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      label: t('achievements.inProgress'),
      value: stats.inProgress,
    },
    {
      icon: Award,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      label: t('achievements.xpEarned'),
      value: stats.totalXP,
      valueColor: 'text-forge-orange'
    },
    {
      icon: Sparkles,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      label: t('achievements.xpAvailable'),
      value: stats.availableXP,
      valueColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-2 rounded-md`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.valueColor || ''}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
