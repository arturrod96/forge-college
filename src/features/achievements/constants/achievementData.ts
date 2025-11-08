import { TFunction } from 'i18next';
import {
  MessageCircle,
  Users,
  Mail,
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  Clock,
  Target,
  Star,
  Sparkles
} from 'lucide-react';
import { Achievement } from '../types/achievement.types';

export const getAchievementsData = (t: TFunction): Achievement[] => [
  // Community Achievements
  {
    id: 'telegram-join',
    title: t('achievements.tasks.telegramJoin.title'),
    description: t('achievements.tasks.telegramJoin.description'),
    xpReward: 100,
    status: 'in_progress' as const,
    category: 'community' as const,
    icon: MessageCircle,
    action: {
      label: t('achievements.tasks.telegramJoin.action'),
      url: 'https://t.me/forgecollege',
      type: 'external' as const
    }
  },
  {
    id: 'discord-join',
    title: t('achievements.tasks.discordJoin.title'),
    description: t('achievements.tasks.discordJoin.description'),
    xpReward: 100,
    status: 'in_progress' as const,
    category: 'community' as const,
    icon: Users,
    action: {
      label: t('achievements.tasks.discordJoin.action'),
      url: 'https://discord.gg/forgecollege',
      type: 'external' as const
    }
  },
  {
    id: 'first-message',
    title: t('achievements.tasks.firstMessage.title'),
    description: t('achievements.tasks.firstMessage.description'),
    xpReward: 50,
    status: 'locked' as const,
    category: 'community' as const,
    icon: MessageCircle,
  },

  // Profile Achievements
  {
    id: 'email-verify',
    title: t('achievements.tasks.emailVerify.title'),
    description: t('achievements.tasks.emailVerify.description'),
    xpReward: 150,
    status: 'completed' as const,
    category: 'profile' as const,
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
    status: 'in_progress' as const,
    category: 'profile' as const,
    progress: 7,
    maxProgress: 10,
    icon: Target,
    action: {
      label: t('achievements.tasks.completeProfile.action'),
      url: '/dashboard/profile',
      type: 'internal' as const
    }
  },
  {
    id: 'github-connect',
    title: t('achievements.tasks.githubConnect.title'),
    description: t('achievements.tasks.githubConnect.description'),
    xpReward: 100,
    status: 'in_progress' as const,
    category: 'profile' as const,
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
    status: 'in_progress' as const,
    category: 'profile' as const,
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
    status: 'in_progress' as const,
    category: 'social' as const,
    icon: Twitter,
    action: {
      label: t('achievements.tasks.twitterFollow.action'),
      url: 'https://x.com/Forge_College',
      type: 'external' as const
    }
  },
  {
    id: 'share-progress',
    title: t('achievements.tasks.shareProgress.title'),
    description: t('achievements.tasks.shareProgress.description'),
    xpReward: 150,
    status: 'locked' as const,
    category: 'social' as const,
    icon: Sparkles,
  },

  // Learning Achievements
  {
    id: 'first-lesson',
    title: t('achievements.tasks.firstLesson.title'),
    description: t('achievements.tasks.firstLesson.description'),
    xpReward: 50,
    status: 'completed' as const,
    category: 'learning' as const,
    icon: BookOpen,
  },
  {
    id: 'week-streak',
    title: t('achievements.tasks.weekStreak.title'),
    description: t('achievements.tasks.weekStreak.description'),
    xpReward: 300,
    status: 'in_progress' as const,
    category: 'learning' as const,
    progress: 4,
    maxProgress: 7,
    icon: Clock,
  },
  {
    id: 'complete-path',
    title: t('achievements.tasks.completePath.title'),
    description: t('achievements.tasks.completePath.description'),
    xpReward: 500,
    status: 'in_progress' as const,
    category: 'learning' as const,
    progress: 12,
    maxProgress: 28,
    icon: Star,
  },
  {
    id: 'perfect-quiz',
    title: t('achievements.tasks.perfectQuiz.title'),
    description: t('achievements.tasks.perfectQuiz.description'),
    xpReward: 200,
    status: 'locked' as const,
    category: 'learning' as const,
    icon: Target,
  },
];
