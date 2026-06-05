'use client'

import { useEffect } from 'react'
import { Link } from '@/lib/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          500
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          {t('error')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('errorDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-primary text-primary transition-colors hover:bg-primary/10"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            {t('tryAgain')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
            style={{ background: '#00C7B7', color: 'white' }}
          >
            <i className="fa-solid fa-house" aria-hidden="true" />
            {t('backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
