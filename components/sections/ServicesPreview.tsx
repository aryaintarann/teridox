'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

// Maps lucide icon name → FontAwesome icon class (used in this component)
const FA_ICON: Record<string, string> = {
  Globe: 'globe', Smartphone: 'mobile-screen-button', Package: 'box-open',
  BrainCircuit: 'microchip', Code: 'code', Database: 'database',
  Cloud: 'cloud', Shield: 'shield-halved', Zap: 'bolt', Users: 'users',
  Settings: 'gear', Layers: 'layer-group', Server: 'server',
  BarChart2: 'chart-bar', Headphones: 'headset', Layout: 'table-layout',
}

interface Service {
  id: string; slug: string; icon: string; accent_color: string
  title: string; title_en: string; description: string; description_en: string
  features: string[]; features_en: string[]
}

function ServiceCard({ service, locale }: { service: Service; locale: string }) {
  const t       = useTranslations('services')
  const [hov, setHov] = useState(false)
  const title    = locale === 'en' && service.title_en ? service.title_en : service.title
  const desc     = locale === 'en' && service.description_en ? service.description_en : service.description
  const features = locale === 'en' && service.features_en?.length ? service.features_en : (service.features ?? [])
  const faIcon   = FA_ICON[service.icon] ?? 'globe'

  return (
    <Link href={`/services/${service.slug}`}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          padding: 32,
          border: '1px solid var(--border)',
          borderTop: `3px solid ${hov ? service.accent_color : 'transparent'}`,
          transform: hov ? 'translateY(-6px)' : 'none',
          boxShadow: hov ? '0 12px 40px rgba(15,27,45,0.12)' : 'var(--shadow)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: `${service.accent_color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <i className={`fa-solid fa-${faIcon}`} style={{ color: service.accent_color, fontSize: 24 }} aria-hidden="true" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: 20, fontWeight: 700, color: 'var(--foreground)', marginBottom: 10 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: 16, fontFamily: 'var(--font-dmsans)' }}>
          {desc ? desc.substring(0, 100) + (desc.length > 100 ? '...' : '') : ''}
        </p>
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {features.slice(0, 3).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted-foreground)', fontFamily: 'var(--font-dmsans)' }}>
                <i className="fa-solid fa-check" style={{ color: service.accent_color, fontSize: 12 }} aria-hidden="true" />
                {f}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: service.accent_color, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-dmsans)' }}>
          {t('learnMore')}
          <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

export default function ServicesPreview() {
  const t      = useTranslations('services')
  const locale = useLocale()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    createClient()
      .from('services')
      .select('id,slug,icon,accent_color,title,title_en,description,description_en,features,features_en')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => { setServices(data ?? []); setLoading(false) })
  }, [])

  if (!loading && services.length === 0) return null

  return (
    <section style={{ background: 'var(--muted)', padding: '96px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ height: 300, borderRadius: 'var(--radius)', background: 'var(--card)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {services.map(s => (
              <ServiceCard key={s.id} service={s} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
