'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const services = [
  { id: 'web',      icon: 'globe',              accentColor: '#00C7B7', href: '/services/web-development' },
  { id: 'mobile',   icon: 'mobile-screen-button', accentColor: '#6366F1', href: '/services/mobile-development' },
  { id: 'software', icon: 'box-open',           accentColor: '#F59E0B', href: '/services/software-sales' },
]

function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ slug: string; title: string; desc: string; features?: string[] }>
  const item = items[index] ?? { title: '', desc: '', features: [] }
  const [hov, setHov] = useState(false)

  return (
    <Link href={service.href}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          padding: 32,
          border: '1px solid var(--border)',
          borderTop: `3px solid ${hov ? service.accentColor : 'transparent'}`,
          transform: hov ? 'translateY(-6px)' : 'none',
          boxShadow: hov ? '0 12px 40px rgba(15,27,45,0.12)' : 'var(--shadow)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <i className={`fa-solid fa-${service.icon}`} style={{ color: '#00C7B7', fontSize: 24 }} aria-hidden="true" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: 16, fontFamily: 'var(--font-dmsans)' }}>
          {item.desc ? item.desc.substring(0, 100) + '...' : ''}
        </p>
        {item.features && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {item.features.slice(0, 3).map((f: string) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>
                <i className="fa-solid fa-check" style={{ color: '#00C7B7', fontSize: 12 }} aria-hidden="true" />
                {f}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00C7B7', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-dmsans)' }}>
          {t('learnMore')}
          <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

export default function ServicesPreview() {
  const t = useTranslations('services')

  return (
    <section style={{ background: 'var(--muted)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
            {t('label')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted-foreground)', maxWidth: 540, margin: '0 auto', fontFamily: 'var(--font-dmsans)' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
