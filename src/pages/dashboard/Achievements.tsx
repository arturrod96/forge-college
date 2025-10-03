import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Mail, 
  MessageCircle, 
  Users, 
  Github, 
  Linkedin,
  Twitter,
  BookOpen,
  Clock,
  Target,
  Star,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AchievementStatus = 'completed' | 'in_progress' | 'locked';
type AchievementCategory = 'community' | 'profile' | 'learning' | 'social';

interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: AchievementStatus;
  category: AchievementCategory;
  progress?: number;
  maxProgress?: number;
  icon: any;
  action?: {
    label: string;
    url?: string;
  };
}

const getAchievements = (t: any): Achievement[] => [
  // Community Achievements
  {
    id: 'telegram-join',
    title: t('achievements.tasks.telegramJoin.title'),
    description: t('achievements.tasks.telegramJoin.description'),
    xpReward: 100,
    status: 'in_progress',
    category: 'community',
    icon: MessageCircle,
    action: {
      label: t('achievements.tasks.telegramJoin.action'),
      url: 'https://t.me/forgecollege'
    }
  },
  {
    id: 'discord-join',
    title: t('achievements.tasks.discordJoin.title'),
    description: t('achievements.tasks.discordJoin.description'),
    xpReward: 100,
    status: 'in_progress',
    category: 'community',
    icon: Users,
    action: {
      label: t('achievements.tasks.discordJoin.action'),
      url: 'https://discord.gg/forgecollege'
    }
  },
  {
    id: 'first-message',
    title: t('achievements.tasks.firstMessage.title'),
    description: t('achievements.tasks.firstMessage.description'),
    xpReward: 50,
    status: 'locked',
    category: 'community',
    icon: MessageCircle,
  },

  // Profile Achievements
  {
    id: 'email-verify',
    title: t('achievements.tasks.emailVerify.title'),
    description: t('achievements.tasks.emailVerify.description'),
    xpReward: 150,
    status: 'completed',
    category: 'profile',
    icon: Mail,
    action: {
      label: t('achievements.tasks.emailVerify.action')
    }
  },
  {
    id: 'complete-profile',
    title: t('achievements.tasks.completeProfile.title'),
    description: t('achievements.tasks.completeProfile.description'),
    xpReward: 200,
    status: 'in_progress',
    category: 'profile',
    progress: 7,
    maxProgress: 10,
    icon: Target,
    action: {
      label: t('achievements.tasks.completeProfile.action'),
      url: '/dashboard/profile'
    }
  },
  {
    id: 'github-connect',
    title: t('achievements.tasks.githubConnect.title'),
    description: t('achievements.tasks.githubConnect.description'),
    xpReward: 100,
    status: 'in_progress',
    category: 'profile',
    icon: Github,
    action: {
      label: t('achievements.tasks.githubConnect.action')
    }
  },
  {
    id: 'linkedin-connect',
    title: t('achievements.tasks.linkedinConnect.title'),
    description: t('achievements.tasks.linkedinConnect.description'),
    xpReward: 100,
    status: 'in_progress',
    category: 'profile',
    icon: Linkedin,
    action: {
      label: t('achievements.tasks.linkedinConnect.action')
    }
  },

  // Social Achievements
  {
    id: 'twitter-follow',
    title: t('achievements.tasks.twitterFollow.title'),
    description: t('achievements.tasks.twitterFollow.description'),
    xpReward: 75,
    status: 'in_progress',
    category: 'social',
    icon: Twitter,
    action: {
      label: t('achievements.tasks.twitterFollow.action'),
      url: 'https://twitter.com/forgecollege'
    }
  },
  {
    id: 'share-progress',
    title: t('achievements.tasks.shareProgress.title'),
    description: t('achievements.tasks.shareProgress.description'),
    xpReward: 150,
    status: 'locked',
    category: 'social',
    icon: Sparkles,
  },

  // Learning Achievements
  {
    id: 'first-lesson',
    title: t('achievements.tasks.firstLesson.title'),
    description: t('achievements.tasks.firstLesson.description'),
    xpReward: 50,
    status: 'completed',
    category: 'learning',
    icon: BookOpen,
  },
  {
    id: 'week-streak',
    title: t('achievements.tasks.weekStreak.title'),
    description: t('achievements.tasks.weekStreak.description'),
    xpReward: 300,
    status: 'in_progress',
    category: 'learning',
    progress: 4,
    maxProgress: 7,
    icon: Clock,
  },
  {
    id: 'complete-path',
    title: t('achievements.tasks.completePath.title'),
    description: t('achievements.tasks.completePath.description'),
    xpReward: 500,
    status: 'in_progress',
    category: 'learning',
    progress: 12,
    maxProgress: 28,
    icon: Star,
  },
  {
    id: 'perfect-quiz',
    title: t('achievements.tasks.perfectQuiz.title'),
    description: t('achievements.tasks.perfectQuiz.description'),
    xpReward: 200,
    status: 'locked',
    category: 'learning',
    icon: Target,
  },
];

const getCategoryConfig = (t: any) => ({
  community: {
    label: t('achievements.categories.community'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  profile: {
    label: t('achievements.categories.profile'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  learning: {
    label: t('achievements.categories.learning'),
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  social: {
    label: t('achievements.categories.social'),
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  }
});

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { t } = useTranslation();
  const Icon = achievement.icon;
  const config = getCategoryConfig(t)[achievement.category];
  const isCompleted = achievement.status === 'completed';
  const isLocked = achievement.status === 'locked';

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${
      isCompleted ? 'border-green-300 bg-green-50/30' : 
      isLocked ? 'opacity-60 border-gray-200' : 
      'border-forge-cream'
    }`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
      )}
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`${config.bgColor} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{achievement.title}</CardTitle>
            <CardDescription className="mt-1">{achievement.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${config.borderColor} ${config.color}`}>
            {config.label}
          </Badge>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-forge-orange" />
            <span className="font-bold text-forge-orange">{achievement.xpReward} XP</span>
          </div>
        </div>

        {achievement.progress !== undefined && achievement.maxProgress && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('achievements.progress')}</span>
              <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
          </div>
        )}

        {achievement.action && !isCompleted && !isLocked && (
          <Button
            className="w-full bg-forge-orange hover:bg-forge-orange/90"
            onClick={() => {
              if (achievement.action?.url) {
                if (achievement.action.url.startsWith('http')) {
                  window.open(achievement.action.url, '_blank');
                } else {
                  window.location.href = achievement.action.url;
                }
              }
            }}
          >
            {achievement.action.label}
          </Button>
        )}

        {isCompleted && (
          <div className="text-center text-sm font-medium text-green-700 bg-green-100 py-2 rounded-md">
            {t('achievements.completedBadge')}
          </div>
        )}

        {isLocked && (
          <div className="text-center text-sm text-gray-500 bg-gray-100 py-2 rounded-md">
            {t('achievements.locked')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Achievements() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all');
  const MOCK_ACHIEVEMENTS = getAchievements(t);

  const filteredAchievements = selectedCategory === 'all'
    ? MOCK_ACHIEVEMENTS
    : MOCK_ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const stats = {
    total: MOCK_ACHIEVEMENTS.length,
    completed: MOCK_ACHIEVEMENTS.filter(a => a.status === 'completed').length,
    inProgress: MOCK_ACHIEVEMENTS.filter(a => a.status === 'in_progress').length,
    totalXP: MOCK_ACHIEVEMENTS.filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.xpReward, 0),
    availableXP: MOCK_ACHIEVEMENTS.filter(a => a.status !== 'completed')
      .reduce((sum, a) => sum + a.xpReward, 0)
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('achievements.title')}</h1>
        <p className="text-gray-600">{t('achievements.subtitle')}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-md">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{t('achievements.completed')}</p>
                <p className="text-2xl font-bold">{stats.completed}/{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-md">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{t('achievements.inProgress')}</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 p-2 rounded-md">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{t('achievements.xpEarned')}</p>
                <p className="text-2xl font-bold text-forge-orange">{stats.totalXP}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-md">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{t('achievements.xpAvailable')}</p>
                <p className="text-2xl font-bold text-purple-600">{stats.availableXP}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Tabs defaultValue="all" className="space-y-6" onValueChange={(v) => setSelectedCategory(v as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">{t('achievements.all')}</TabsTrigger>
          <TabsTrigger value="community">{t('achievements.categories.community')}</TabsTrigger>
          <TabsTrigger value="profile">{t('achievements.categories.profile')}</TabsTrigger>
          <TabsTrigger value="learning">{t('achievements.categories.learning')}</TabsTrigger>
          <TabsTrigger value="social">{t('achievements.categories.social')}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Achievements;
