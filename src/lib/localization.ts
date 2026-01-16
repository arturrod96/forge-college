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
