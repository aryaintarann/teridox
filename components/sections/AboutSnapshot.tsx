'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const valueProps = [
  { icon: 'bolt',     titleKey: 'fast',     descKey: 'fastDesc' },
  { icon: 'bullseye', titleKey: 'precise',  descKey: 'preciseDesc' },
  { icon: 'gem',      titleKey: 'quality',  descKey: 'qualityDesc' },
]


export default function AboutSnapshot() {
  const t = useTranslations('about')

  return (
    <section style={{ background: 'var(--background)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 64, alignItems: 'center' }}>
        {/* Left: text */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-dmsans)', color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12 }}>
            {t('label')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)', marginBottom: 20, lineHeight: 1.25 }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted-foreground)', lineHeight: 1.8, marginBottom: 16, fontFamily: 'var(--font-dmsans)' }}>
            {t('p1')}
          </p>
          <p style={{ fontSize: 16, color: 'var(--muted-foreground)', lineHeight: 1.8, marginBottom: 32, fontFamily: 'var(--font-dmsans)' }}>
            {t('p2')}
          </p>

          {/* Value props */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {valueProps.map((p) => (
              <div key={p.icon} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid fa-${p.icon}`} style={{ color: '#00C7B7', fontSize: 18 }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 15, fontFamily: 'var(--font-dmsans)' }}>{t(p.titleKey)}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>{t(p.descKey)}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}
          >
            {t('more')}
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
          </Link>
        </div>

        {/* Right: logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/logo/1.svg"
            alt="Teridox"
            width={480}
            height={360}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  )
}
