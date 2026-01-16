import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LocaleRow } from '@/lib/localization'

interface LocalizationTabsProps {
  locales: LocaleRow[]
  activeLocale: string
  onLocaleChange: (locale: string) => void
  renderFields: (locale: string) => ReactNode
  tabsClassName?: string
}

export function LocalizationTabs({
  locales,
  activeLocale,
  onLocaleChange,
  renderFields,
  tabsClassName,
}: LocalizationTabsProps) {
  if (locales.length === 0) {
    return null
  }

  return (
    <Tabs value={activeLocale} onValueChange={onLocaleChange} className="space-y-4">
      <TabsList className={tabsClassName ?? 'flex flex-wrap gap-2 bg-forge-cream/60 p-1'}>
        {locales.map((locale) => (
          <TabsTrigger key={locale.code} value={locale.code} className="data-[state=active]:bg-white">
            {locale.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {locales.map((locale) => (
        <TabsContent key={locale.code} value={locale.code} className="space-y-4 rounded-lg border border-forge-cream/70 bg-white/70 p-4">
          {renderFields(locale.code)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
