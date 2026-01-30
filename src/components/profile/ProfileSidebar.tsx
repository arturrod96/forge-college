import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { User, Briefcase, BookOpen, Target } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  fullName: string
  email: string
  avatarUrl?: string | null
}

export function ProfileSidebar({
  activeTab,
  onTabChange,
  fullName,
  email,
  avatarUrl,
}: ProfileSidebarProps) {
  const { t } = useTranslation()

  const tabs = useMemo(
    () => [
      {
        id: 'personal',
        label: t('profile.sections.personal'),
        icon: User,
        description: t('profile.sections.personalDesc'),
      },
      {
        id: 'professional',
        label: t('profile.sections.professional'),
        icon: Briefcase,
        description: t('profile.sections.professionalDesc'),
      },
      {
        id: 'learning',
        label: t('profile.sections.learning'),
        icon: BookOpen,
        description: t('profile.sections.learningDesc'),
      },
      {
        id: 'career',
        label: t('profile.sections.career'),
        icon: Target,
        description: t('profile.sections.careerDesc'),
      },
    ],
    [t]
  )

  const displayName = fullName?.trim() || t('profile.sidebar.anonymousUser')
  const displayEmail = email || ''
  const initials = useMemo(() => {
    const source = displayName || displayEmail
    const segments = source.split(' ').filter(Boolean)
    if (segments.length === 0) {
      return 'U'
    }
    return segments
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase() ?? '')
      .join('')
      .padEnd(2, 'U')
  }, [displayName, displayEmail])

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{displayEmail}</p>
        </div>
      </div>

      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'w-full rounded-lg p-4 text-left transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              isActive
                ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-500')} />
              <div className="flex-1">
                <div className="font-medium">{tab.label}</div>
                <div className={cn('mt-1 text-sm', isActive ? 'text-orange-100' : 'text-gray-500')}>{tab.description}</div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
