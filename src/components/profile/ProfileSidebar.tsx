import React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { User, Briefcase, BookOpen, Target } from 'lucide-react';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      {
        id: 'personal',
        label: t('profile.sections.personal'),
        icon: User,
        description: t('profile.sections.personalDesc')
      },
      {
        id: 'professional',
        label: t('profile.sections.professional'),
        icon: Briefcase,
        description: t('profile.sections.professionalDesc')
      },
      {
        id: 'learning',
        label: t('profile.sections.learning'),
        icon: BookOpen,
        description: t('profile.sections.learningDesc')
      },
      {
        id: 'career',
        label: t('profile.sections.career'),
        icon: Target,
        description: t('profile.sections.careerDesc')
      }
    ],
    [t]
  );

  return (
    <div className="space-y-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full text-left p-4 rounded-lg transition-all duration-200",
              "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
              isActive 
                ? "bg-orange-500 text-white shadow-md" 
                : "bg-white text-gray-700 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
              <div className="flex-1">
                <div className="font-medium">{tab.label}</div>
                <div className={cn("text-sm mt-1", isActive ? "text-orange-100" : "text-gray-500")}>
                  {tab.description}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
