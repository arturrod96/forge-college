import React from 'react';
import { cn } from '@/lib/utils';
import { User, Briefcase, BookOpen, Target } from 'lucide-react';

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: User,
    description: 'Basic personal details and contact information'
  },
  {
    id: 'professional',
    label: 'Professional Profile',
    icon: Briefcase,
    description: 'Work experience, skills, and career information'
  },
  {
    id: 'learning',
    label: 'Learning Progress',
    icon: BookOpen,
    description: 'Track your learning journey and achievements'
  },
  {
    id: 'career',
    label: 'Career Preferences',
    icon: Target,
    description: 'Job preferences and career goals'
  }
];

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
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
