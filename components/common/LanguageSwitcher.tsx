'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/lib/i18n/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    router.replace(pathname, { locale: locale === 'id' ? 'en' : 'id' })
  }

  return (
    <div
      className="flex items-center rounded-full p-[3px] gap-[2px]"
      style={{ border: '1px solid var(--border)' }}
    >
      {(['id', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className="rounded-full transition-all"
          style={{
            padding: '3px 10px',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-dmsans)',
            background: locale === l ? '#00C7B7' : 'transparent',
            color: locale === l ? 'white' : 'var(--muted-foreground)',
            cursor: 'pointer',
            border: 'none',
          }}
          aria-label={l === 'id' ? 'Bahasa Indonesia' : 'English'}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
