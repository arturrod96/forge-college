import { useTranslation } from 'react-i18next'

export function BetaPromoBar() {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-forge-orange-600 text-white shadow-md">
      <div className="mx-auto flex h-[30px] max-w-6xl items-center justify-center px-4 text-center text-sm font-medium">
        <p className="font-medium">{t('layout.betaPromo.message')}</p>
      </div>
    </div>
  )
}
