'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'

const featured = [
  { id: 1, title: 'TokoBaju E-Commerce', category: 'Web Development', tags: ['Next.js', 'PostgreSQL', 'Stripe'], featured: true,  color: '#0F1B2D', year: '2025', result: '+150% Konversi', href: '/portfolio/tokobaju' },
  { id: 5, title: 'BaliStay Booking',    category: 'Web Development', tags: ['Vue.js', 'Laravel', 'MySQL'],    featured: false, color: '#064E3B', year: '2025', result: '+85% Booking',  href: '/portfolio/balistay' },
  { id: 12, title: 'TravelMate App',     category: 'Mobile App',      tags: ['Flutter', 'Firebase'],           featured: false, color: '#0F172A', year: '2025', result: '4.8★ App Store', href: '/portfolio/travelmate' },
]

function PortfolioCard({ item, large }: { item: typeof featured[number]; large: boolean }) {
  const [hov, setHov] = useState(false)

  return (
    <Link href={item.href}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          gridRow: large ? 'span 2' : 'auto',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          minHeight: large ? 480 : 220,
          background: item.color,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.2)', transition: 'background 0.3s' }} />
        {item.featured && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#00C7B7', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999, zIndex: 2, fontFamily: 'var(--font-dmsans)' }}>
            Featured
          </div>
        )}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24,
            transform: hov ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 0.3s', zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 9999, fontFamily: 'var(--font-dmsans)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: large ? 26 : 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            {item.title}
          </h3>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-dmsans)' }}>
            {item.category} · {item.year}
          </div>
          {hov && (
            <div style={{ marginTop: 12, color: '#00C7B7', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-dmsans)' }}>
              Lihat Detail
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function PortfolioHighlight() {
  const t = useTranslations('portfolio')

  return (
    <section style={{ background: 'var(--background)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
              {t('label')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
              {t('title')}
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}
          >
            {t('viewAll')}
            <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 20 }}>
          {featured.map((item, i) => (
            <PortfolioCard key={item.id} item={item} large={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
