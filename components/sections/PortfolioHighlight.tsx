'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const CAT_COLOR: Record<string, string> = {
  web: '#0F1B2D', mobile: '#0F172A', saas: '#1E1B4B', ai: '#1A0533',
}
const DEFAULT_COLORS = ['#0F1B2D', '#064E3B', '#0F172A']

interface PortfolioItem {
  id: string; title: string; slug: string; description: string
  technologies: string[]; category: string; featured: boolean; created_at: string
}

function PortfolioCard({ item, large, locale }: { item: PortfolioItem; large: boolean; locale: string }) {
  const [hov, setHov] = useState(false)
  const color = CAT_COLOR[item.category.toLowerCase()] ?? '#0F1B2D'
  const t = useTranslations('portfolio')

  return (
    <Link href={`/portfolio/${item.slug}`}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          gridRow: large ? 'span 2' : 'auto', borderRadius: 20, overflow: 'hidden',
          position: 'relative', cursor: 'pointer', minHeight: large ? 480 : 220,
          background: color,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: hov ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.2)', transition: 'background 0.3s' }} />
        {item.featured && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: '#00C7B7', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 9999, zIndex: 2, fontFamily: 'var(--font-dmsans)' }}>
            Featured
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, transform: hov ? 'translateY(0)' : 'translateY(8px)', transition: 'transform 0.3s', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {item.technologies.slice(0, 2).map((tag) => (
              <span key={tag} style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 9999, fontFamily: 'var(--font-dmsans)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: large ? 26 : 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            {item.title}
          </h3>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-dmsans)' }}>
            {item.category} · {new Date(item.created_at).getFullYear()}
          </div>
          {hov && (
            <div style={{ marginTop: 12, color: '#00C7B7', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-dmsans)' }}>
              {t('viewProject')} <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function PortfolioHighlight() {
  const t      = useTranslations('portfolio')
  const locale = useLocale()
  const [items, setItems]     = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('portfolio_items')
      .select('id,title,slug,description,technologies,category,featured,created_at')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [])

  if (!loading && items.length === 0) return null

  return (
    <section style={{ background: 'var(--background)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#00C7B7', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 12, fontFamily: 'var(--font-dmsans)' }}>
              {t('label')}
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--foreground)' }}>
              {t('title')}
            </h2>
          </div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: '#00C7B7', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-dmsans)' }}>
            {t('viewAll')} <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: i === 0 ? 480 : 220, borderRadius: 20, background: 'var(--muted)', animation: 'pulse 1.5s infinite', gridRow: i === 0 ? 'span 2' : 'auto' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 20 }}>
            {items.map((item, i) => (
              <PortfolioCard key={item.id} item={item} large={i === 0} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
