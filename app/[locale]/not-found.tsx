import { Link } from '@/lib/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('common')

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
          {t('notFound')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('notFoundDesc')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors"
          style={{ background: '#00C7B7', color: 'white' }}
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          {t('backHome')}
        </Link>
      </div>
    </div>
  )
}
