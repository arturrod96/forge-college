import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/types/supabase'

export const DEFAULT_LOCALE = 'pt-BR'

const LOCALIZATION_TABLES = {
  lesson: {
    table: 'lesson_localizations',
    foreignKey: 'lesson_id',
  },
  module: {
    table: 'module_localizations',
    foreignKey: 'module_id',
  },
  course: {
    table: 'course_localizations',
    foreignKey: 'course_id',
  },
  learning_path: {
    table: 'learning_path_localizations',
    foreignKey: 'learning_path_id',
  },
  formation: {
    table: 'formation_localizations',
    foreignKey: 'formation_id',
  },
} as const satisfies Record<string, { table: keyof Database['public']['Tables']; foreignKey: string }>

type LocalizationTarget = keyof typeof LOCALIZATION_TABLES

type LocalizationRow<TTarget extends LocalizationTarget> = Tables<
  (typeof LOCALIZATION_TABLES)[TTarget]['table']
>

type LocalizationColumn<TTarget extends LocalizationTarget> = (typeof LOCALIZATION_TABLES)[TTarget]['foreignKey']

export type LocaleRow = Tables<'locales'>

export function buildLocaleChain(locale?: string | null, fallbackLocale: string = DEFAULT_LOCALE) {
  const requested = (locale ?? '').trim()
  const chain = requested && requested !== fallbackLocale ? [requested] : []
  if (!chain.includes(fallbackLocale)) {
    chain.push(fallbackLocale)
  }
  return chain
}

export function mapLocalizationsByLocale<TRow extends { locale: string }>(records: TRow[]) {
  return records.reduce<Record<string, TRow>>((acc, record) => {
    acc[record.locale] = record
    return acc
  }, {})
}

export function pickPublishedLocalization<TRow extends { locale: string; is_published: boolean }>(
  records: TRow[],
  preferredLocale?: string | null,
  fallbackLocale: string = DEFAULT_LOCALE
) {
  const chain = buildLocaleChain(preferredLocale, fallbackLocale)
  for (const locale of chain) {
    const match = records.find((record) => record.locale === locale && record.is_published)
    if (match) {
      return match
    }
  }
  return null
}

export async function fetchSupportedLocales(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from('locales')
    .select('code, label, is_default')
    .order('is_default', { ascending: false })
    .order('label', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function fetchEntityLocalizations<TTarget extends LocalizationTarget>(
  client: SupabaseClient<Database>,
  target: TTarget,
  entityId: string
) {
  const { table, foreignKey } = LOCALIZATION_TABLES[target]

  const { data, error } = await client
    .from(table)
    .select('*')
    .eq(foreignKey as LocalizationColumn<TTarget>, entityId)

  if (error) {
    throw error
  }

  return (data ?? []) as LocalizationRow<TTarget>[]
}

export function ensureLocaleMap<TRow>(
  locales: LocaleRow[],
  localizedRecords: Partial<Record<string, TRow>>,
  factory: (locale: string) => TRow
) {
  return locales.reduce<Record<string, TRow>>((acc, locale) => {
    acc[locale.code] = localizedRecords[locale.code] ?? factory(locale.code)
    return acc
  }, {})
}

export function getDefaultLocale(locales: LocaleRow[]) {
  return locales.find((locale) => locale.is_default)?.code ?? DEFAULT_LOCALE
}

/** Course (or similar) with optional localized titles */
export type TitleI18n = {
  title: string
  title_en?: string | null
  title_pt_br?: string | null
}

/**
 * Returns the title in the best available language for the given locale.
 * Prefers title_en when locale is en, title_pt_br when pt; otherwise falls back to title.
 */
export function getCourseTitleByLocale(entity: TitleI18n, locale: string): string {
  const code = (locale || '').split('-')[0].toLowerCase()
  if (code === 'en' && entity.title_en?.trim()) return entity.title_en.trim()
  if (code === 'pt' && entity.title_pt_br?.trim()) return entity.title_pt_br.trim()
  return entity.title?.trim() ?? ''
}

/** Localization row with locale and title (e.g. from course_localizations) */
export type LocalizationTitleRow = { locale: string; title: string | null }

/**
 * Returns the course title for the given locale.
 * Prefers title from course_localizations (admin "Localized content"), then title_en/title_pt_br, then title.
 */
export function getCourseTitleWithLocalizations(
  entity: TitleI18n,
  localizations: LocalizationTitleRow[] | null | undefined,
  locale: string
): string {
  const want = (locale || '').trim()
  if (want && Array.isArray(localizations)) {
    const exact = localizations.find((r) => r.locale === want && r.title?.trim())
    if (exact?.title?.trim()) return exact.title.trim()
    const lang = want.split('-')[0].toLowerCase()
    const byLang = localizations.find((r) => r.locale?.toLowerCase().startsWith(lang) && r.title?.trim())
    if (byLang?.title?.trim()) return byLang.title.trim()
  }
  return getCourseTitleByLocale(entity, locale)
}

/**
 * Returns the title for the given locale from a list of localization rows (e.g. formation_localizations, learning_path_localizations).
 * Falls back to baseTitle when no matching localization is found.
 */
export function getTitleFromLocalizations(
  localizations: LocalizationTitleRow[] | null | undefined,
  locale: string,
  baseTitle: string
): string {
  const want = (locale || '').trim()
  if (!want || !Array.isArray(localizations)) return baseTitle?.trim() ?? ''
  const exact = localizations.find((r) => r.locale === want && r.title?.trim())
  if (exact?.title?.trim()) return exact.title.trim()
  const lang = want.split('-')[0].toLowerCase()
  const byLang = localizations.find((r) => r.locale?.toLowerCase().startsWith(lang) && r.title?.trim())
  if (byLang?.title?.trim()) return byLang.title.trim()
  return baseTitle?.trim() ?? ''
}

/** Localization row with locale, title, and optional description */
export type LocalizationRowWithDescription = { locale: string; title: string | null; description?: string | null }

/**
 * Returns the description for the given locale from localization rows. Falls back to baseDescription.
 */
export function getDescriptionFromLocalizations(
  localizations: LocalizationRowWithDescription[] | null | undefined,
  locale: string,
  baseDescription: string | null
): string {
  const want = (locale || '').trim()
  if (!want || !Array.isArray(localizations)) return baseDescription?.trim() ?? ''
  const exact = localizations.find((r) => r.locale === want && (r.description?.trim() ?? r.title?.trim()))
  if (exact?.description?.trim()) return exact.description.trim()
  const lang = want.split('-')[0].toLowerCase()
  const byLang = localizations.find((r) => r.locale?.toLowerCase().startsWith(lang) && r.description?.trim())
  if (byLang?.description?.trim()) return byLang.description.trim()
  return baseDescription?.trim() ?? ''
}

/** Localization row with locale and content (e.g. lesson_localizations) */
export type LocalizationRowWithContent = { locale: string; title?: string | null; content?: unknown }

/**
 * Returns the content for the given locale from localization rows (e.g. lesson_localizations).
 * Falls back to baseContent when no matching localization is found.
 */
export function getContentFromLocalizations(
  localizations: LocalizationRowWithContent[] | null | undefined,
  locale: string,
  baseContent: unknown
): unknown {
  const want = (locale || '').trim()
  if (!want || !Array.isArray(localizations)) return baseContent
  const exact = localizations.find((r) => r.locale === want && r.content != null)
  if (exact?.content != null) return exact.content
  const lang = want.split('-')[0].toLowerCase()
  const byLang = localizations.find((r) => r.locale?.toLowerCase().startsWith(lang) && r.content != null)
  if (byLang?.content != null) return byLang.content
  return baseContent
}
